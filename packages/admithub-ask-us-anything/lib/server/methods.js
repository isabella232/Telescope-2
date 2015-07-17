Meteor.methods({
  registerAndAsk: function(email, newsletter, question) {
    check(email, String);
    check(newsletter, Boolean);
    check(question, String);

    var userId = Accounts.createUser({
      email: email,
      profile: {
        subscribedToNewsletter: newsletter
      }
    });

    this.setUserId(userId);
    Accounts.sendEnrollmentEmail(userId);

    var syncCall = Meteor.wrapAsync(Meteor.call);
    var post = syncCall('submitPost', {
      title: question
    });

    return post;
  }
});