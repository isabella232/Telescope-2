Template.ah_ask_us_anything_banner.created = function() {
  this.showEmail = new ReactiveVar(false);
};

Template.ah_ask_us_anything_banner.helpers({
  schema: function() {
    return new SimpleSchema({
      title: {
        type: String,
        optional: false,
        label: 'Question',
        autoform: {
          editable: true
        }
      },
      email: {
        type: String,
        optional: true,
        label: 'Email Address',
        regEx: SimpleSchema.RegEx.Email,
        autoform: {
          editable: true
        }
      },
      newsletter: {
        type: Boolean,
        optional: true,
        label: 'Join the newsletter?',
        autoform: {
          editable: true
        }
      }
    });
  },
  showEmail: function() {
    return Template.instance().showEmail.get();
  }
});

AutoForm.hooks({
  askUsAnythingForm: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {

      function submitCallback(err, post) {
        if (err) {
          flashMessage(err.message.split('|')[0].split('[')[0].trim(), 'error');
          clearSeenMessages();
          return;
        }
        Router.go('post_page', {_id: post._id});
      }

      this.template.$('button[type=submit]').addClass('loading');

      if (Meteor.user()) {
        insertDoc.email = Meteor.user().emails[0].address;
        insertDoc.userId = Meteor.userId();
        Meteor.call('submitPost', {
          title: insertDoc.title
        }, submitCallback);
      }
      else {
        var showEmail = this.template.get('showEmail');

        if (showEmail.get()) {
          Meteor.call('registerAndAsk',
            insertDoc.email,
            insertDoc.newsletter,
            insertDoc.title,
            submitCallback);
        }
        else {
          showEmail.set(true);
          flashMessage('Enter your email address so we can get you your answer!');
        }
      }
      return false;
    },
    onSuccess: function(operation, post) {
      this.template.$('button[type=submit]').removeClass('loading');
    },
    onError: function(operation, error) {
      this.template.$('button[type=submit]').removeClass('loading');
      flashMessage(error.message.split('|')[0].split('[')[0].trim(), 'error');
      clearSeenMessages();
    }
  }
})