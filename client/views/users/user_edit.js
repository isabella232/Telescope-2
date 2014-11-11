Template[getTemplate('user_edit')].helpers({
  profileIncomplete : function() {
    return this && !this.loading && !userProfileComplete(this);
  },
  userName: function(){
    return getUserName(this);
  },
  userEmail : function(){
    return getEmail(this);
  },
  getTwitter: function(){
    return getTwitterName(this) || "";
  },
  getGitHub: function(){
    return getGitHubName(this) || "";
  },
  profileUrl: function(){
    return Meteor.absoluteUrl()+"users/"+this.slug;
  },
  hasNotificationsUsers : function(){
    return getUserSetting('notifications.users', '', this) ? 'checked' : '';
  },
  hasNotificationsPosts : function(){
    return getUserSetting('notifications.posts', '', this) ? 'checked' : '';
  },
  hasNotificationsComments : function(){
    return getUserSetting('notifications.comments', '', this) ? 'checked' : '';
  },
  hasNotificationsReplies : function(){
    return getUserSetting('notifications.replies', '', this) ? 'checked' : '';
  },
  hasPassword: function () {
    return hasPassword(Meteor.user());
  },
  getTemplate: function() {
    return getTemplate(this.template);
  },
  userProfileEdit: function() {
    return userProfileEdit;
  }
});

Template[getTemplate('user_edit')].rendered = function() {
  var instance = this;
  userEditRenderedCallbacks.forEach(function(callback) {
    callback(instance);
  });
};

Template[getTemplate('user_edit')].events({
  'submit #account-form': function(e){
    e.preventDefault();

    clearSeenMessages();
    if(!Meteor.user()) {
      flashMessage(i18n.t('You must be logged in.'), "error");
      return;
    }

    var $target=$(e.target);
    var name = $target.find('[name=name]').val();
    var email = $target.find('[name=email]').val();
    var user = this;
    var update = {
      "profile.name": name,
      "profile.slug": slugify(name),
      "profile.bio": $target.find('[name=bio]').val(),
      "profile.twitter": $target.find('[name=twitter]').val(),
      "profile.github": $target.find('[name=github]').val(),
      "profile.site": $target.find('[name=site]').val(),
      "profile.notifications.users": $('input[name=notifications_users]:checked').length, // only actually used for admins
      "profile.notifications.posts": $('input[name=notifications_posts]:checked').length,
      "profile.notifications.comments": $('input[name=notifications_comments]:checked').length,
      "profile.notifications.replies": $('input[name=notifications_replies]:checked').length
    };

    var old_password = $target.find('[name=old_password]').val();
    var new_password = $target.find('[name=new_password]').val();

    if(old_password && new_password){
   		Accounts.changePassword(old_password, new_password, function(error){
        // TODO: interrupt update if there's an error at this point
        if(error)
          flashMessage(error.reason, "error");
      });
    }

    var new_email = $target.find("[name=email]").val();
    var old_email = user.emails[0].address;
    if (old_email != new_email) {
      Meteor.call("changeEmail", new_email, function(error) {
        // TODO: interrupt update if there's an error at this point
        if (error){
          flashMessage(error.reason, "error");
        }
      });
    }

    update = userEditClientCallbacks.reduce(function(result, currentFunction) {
      return currentFunction(result);
    }, update);

    Meteor.users.update(user._id, {
      $set: update
    }, function(error){
      if(error){
        flashMessage(error.reason, "error");
      } else {
        flashMessage(i18n.t('Profile updated'), "success");
      }
      Deps.afterFlush(function() {
        var element = $('.grid > .error');
        $('html, body').animate({scrollTop: element.offset().top});
      });
    });

    Meteor.call('changeEmail', email);

  }

});
