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
      body: {
        type: String,
        optional: true,
        label: 'Details',
        autoform: {
          editable: true,
          rows: 5
        }
      },
      email: {
        type: String,
        optional: false,
        label: 'Email',
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
      this.template.$('button[type=submit]').addClass('loading');

      if (Meteor.user()) {
        insertDoc.email = Meteor.user().emails[0].address;
        insertDoc.userId = Meteor.userId();
        Meteor.call('submitPost', insertDoc, function() {
          this.done();
        });
      }
      else {
        Template.instance().showEmail.set(true);
      }
    },
    onSuccess: function(operation, post) {
      this.template.$('button[type=submit]').removeClass('loading');
      // trackEvent("new post", {'postId': post._id});
      // Router.go('post_page', {_id: post._id});
      // if (post.status === STATUS_PENDING) {
      //   flashMessage(i18n.t('thanks_your_post_is_awaiting_approval'), 'success');
      // }
    },
    onError: function(operation, error) {
      console.log('onerror', arguments);
      this.template.$('button[type=submit]').removeClass('loading');
      flashMessage(error.message.split('|')[0], 'error'); // workaround because error.details returns undefined
      clearSeenMessages();
      // $(e.target).removeClass('disabled');
      if (error.error == 603) {
        var dupePostId = error.reason.split('|')[1];
        Router.go('post_page', {_id: dupePostId});
      }
    }
  }
})