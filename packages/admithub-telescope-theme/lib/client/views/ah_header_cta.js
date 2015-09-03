Template.ah_header_cta.helpers({
  showAskButton: function() {
    return !Meteor.user() || Users.can.post(Meteor.user());
  }
});
