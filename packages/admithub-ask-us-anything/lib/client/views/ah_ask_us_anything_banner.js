Template.newsletter_banner.created = function() {
  this.showEmail = new ReactiveVar(false);
  this.question = new ReactiveVar();
};

Template.newsletter_banner.helpers({
  showEmail: function() {
    return Template.instance().showEmail.get();
  }
});

Template.newsletter_banner.events({
  'submit #ah_ask_us_form': function(e) {
    e.preventDefault();

    var question = Template.instance().question.get() ||
                   $('#ah_ask_us_question').val();
    var email = $('#ah_ask_us_email').val();
    var newsletter = $('#ah_ask_us_newsletter').is(':checked');

    function submitCallback(err, post) {
      if (err) {
        var reason = err.reason;
        if (reason === "Email already exists.") {
          reason = "You already have an account! Please sign in first.";
        }
        Messages.flash(reason, 'error');
        Messages.clearSeen();
        return;
      }
      Router.go('post_page', {_id: post._id});
    }

    if (Meteor.user()) {
      Meteor.call('submitPost', {
        title: question
      }, submitCallback);
    }
    else {
      if (Template.instance().showEmail.get()) {
        Meteor.call('registerAndAsk',
          email,
          newsletter,
          question,
          submitCallback);
      }
      else {
        Template.instance().showEmail.set(true);
        Template.instance().question.set(question);
      }
    }
  }
});
