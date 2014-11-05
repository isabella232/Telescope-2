Template[getTemplate('user_email')].helpers({
  user: function(){
    return Meteor.user();
  },
  username: function () {
    return getUserName(Meteor.user());
  },
  getTemplate: function() {
    return getTemplate(this.template);
  },
  userProfileFinishSignup: function() {
    return userProfileFinishSignup;
  }
});

Template[getTemplate('user_email')].events({
  'submit form': function(e){
    e.preventDefault();
    if(!Meteor.user()) {
      flashMessage(i18n.t('You must be logged in.'), "error");
      return;
    }
    var $target=$(e.target);
    var user=Session.get('selectedUserId')? Meteor.users.findOne(Session.get('selectedUserId')) : Meteor.user();
    var email = $target.find('[name=email]').val();
    var username = $target.find('[name=username]').val();
    if (email) {
      Meteor.call("changeEmail", email, function(error) {
        if (error) {
          throwError(error.reason);
        }
      });
    }
    if (username) {
      var update = {
        username: username,
        slug: slugify(username)
      };
      update = userEditClientCallbacks.reduce(function(result, currentFunction) {
        return currentFunction(result);
      }, update);

      Meteor.users.update(user._id, {
        $set: update
      }, function(error){
        if(error){
          if (error.reason.indexOf("duplicate key error index: meteor.users.$username") !== -1) {
            flashMessage("That username is already taken.", "error");
          } else {
            flashMessage(error.reason, "error");
          }
        } else {
          flashMessage(i18n.t('Thanks for signing up!'), "success");
          // Meteor.call('addCurrentUserToMailChimpList');
          trackEvent("new sign-up", {'userId': user._id, 'auth':'twitter'});
          Router.go('/');
        }
      });
    } else {
      Router.go('/');
    }
  }

});
