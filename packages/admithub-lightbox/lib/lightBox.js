

Telescope.modules.add("top", {
  template: "light-box",
  order: 1
});




if (Meteor.isClient) {

  Template.layout.events({
    'click .post-content': function (e) {
      Session.set('lightBoxPageViewCounter', 1 );
    }
  });



}