if (Meteor.isClient) {
  Telescope.modules.add("top", {
    template: "lightBox",
    order: 0
  });

  Template.layout.events({
    'click .post-content': function (e) {
      Session.set('lightBoxPageViewCounter', 1 );
    }
  });

  Template.lightBox.helpers({
    lightBoxOn: function() {
      return false;
    }
  });

  Template.lightBox.events({
    'click #pg-light-box-leadin-button': function(e) {
      e.preventDefault();
      Meteor.call('sendToMailChimp', function(err,result) {
        if (err) {

        } else {

        }
          //send error to view
      });
    }
  });
}
