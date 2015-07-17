AutoForm.hooks({
  askUsAnythingForm: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.template.$('button[type=submit]').addClass('loading');
      setTimeout(function() {
        this.done();
      }.bind(this), 1000);
      return false;
        // var post = doc;

        // // ------------------------------ Checks ------------------------------ //

        // if (!Meteor.user()) {
        //   flashMessage(i18n.t('you_must_be_logged_in'), 'error');
        //   return false;
        // }

        // // ------------------------------ Callbacks ------------------------------ //

        // // run all post submit client callbacks on properties object successively
        // post = postSubmitClientCallbacks.reduce(function(result, currentFunction) {
        //     return currentFunction(result);
        // }, post);

        // return post;
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