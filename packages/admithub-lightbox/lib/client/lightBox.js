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
      return true;
    }
  });

}

//above template helper does not work so i am using global helper  
  UI.registerHelper("lightBoxOn", function() {
    return Session.get('lightBoxPageViewCounter') === 1;
  });