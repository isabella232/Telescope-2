Meteor.methods({
  dontShowCustomEmailBanner: function() {
    Meteor.users.update({
      _id: Meteor.user()._id
    }, {
      $set: {"profile.dontShowCustomEmailBanner": true }
    });
  }
});

