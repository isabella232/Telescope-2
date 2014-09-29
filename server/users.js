Accounts.onCreateUser(function(options, user){
  var userProperties = {
    profile: options.profile || {},
    karma: 0,
    isInvited: false,
    postCount: 0,
    commentCount: 0,
    invitedCount: 0,
    votes: {
      upvotedPosts: [],
      downvotedPosts: [],
      upvotedComments: [],
      downvotedComments: []
    }
  };
  user = _.extend(user, userProperties);

  if (options.email) {
    if (user.emails && user.emails[0]) {
      user.emails[0].address = options.email;
    } else {
      user.emails = [{address: options.email, verified: false}];
    }
  }
    
  if (getEmail(user))
    user.email_hash = getEmailHash(user);
  
  if (!user.profile.name)
    user.profile.name = user.username;
  
  // set notifications default preferences
  user.profile.notifications = {
    users: false,
    posts: false,
    comments: true,
    replies: true
  };

  // create slug from username
  user.slug = slugify(getUserName(user));

  // if this is the first user ever, make them an admin
  if (!Meteor.users.find().count() )
    Roles.addUsersToRoles(user, ["Admin"], Roles.GLOBAL_GROUP);

  // give new users a few invites (default to 3)
  user.inviteCount = getSetting('startInvitesCount', 3);

  trackEvent('new user', {username: user.username, email: getEmail(user)});

  // if user has already filled in their email, add them to MailChimp list
  // if(getEmail(user)) {
  //   addToMailChimpList(user, false, function(error, result){
  //     if(error){
  //       console.log(error)
  //     }
  //   });

  // if the new user has been invited 
  // set her status accordingly and update invitation info
  if(invitesEnabled() && getEmail(user)){
    var invite = Invites.findOne({ invitedUserEmail : getEmail(user) });
    if(invite){
      var invitedBy = Meteor.users.findOne({ _id : invite.invitingUserId });
      
      user = _.extend(user, {
        isInvited: true,
        invitedBy: invitedBy._id,
        invitedByName: getDisplayName(invitedBy)
      });

      Invites.update(invite._id, {$set : {
        accepted : true
      }});
    }
  }

  // send notifications to admins
  var admins = Roles.getUsersInRole("Admin", Roles.GLOBAL_GROUP);
  admins.forEach(function(admin){
    if(getUserSetting('notifications.users', false, admin)){
      var emailProperties = {
        profileUrl: getProfileUrl(user),
        username: getUserName(user)
      };
      var html = getEmailTemplate('emailNewUser')(emailProperties);
      sendEmail(getEmail(admin), 'New user account: '+getUserName(user), buildEmailTemplate(html));
    }
  });

  return user;
});


Meteor.methods({
  changeEmail: function(newEmail) {
    // Update the working user so we can use it to fetch the email_hash.
    var user = Meteor.user();
    var emails = [{address: newEmail}];
    user.emails = emails;
    user.email_hash = getEmailHash(user);
    // Update the db and hash.
    Meteor.users.update(user._id, {$set: {
      emails: user.emails,
      email_hash: user.email_hash
    }});
  },
  numberOfPostsToday: function(){
    console.log(numberOfItemsInPast24Hours(Meteor.user(), Posts));
  },
  numberOfCommentsToday: function(){
    console.log(numberOfItemsInPast24Hours(Meteor.user(), Comments));
  },
  testBuffer: function(){
    // TODO
  },
  getScoreDiff: function(id){
    var object = Posts.findOne(id);
    var baseScore = object.baseScore;
    var ageInHours = (new Date().getTime() - object.submitted) / (60 * 60 * 1000);
    var newScore = baseScore / Math.pow(ageInHours + 2, 1.3);
    return Math.abs(object.score - newScore);
  },
  setEmailHash: function(user){
    var hash = getEmailHash(user);
    Meteor.users.update(user._id, {$set : {email_hash : hash}});
  }
});
