ahAssetPath = '/packages/admithub_admithub-telescope-theme/public/'

/*
primaryNav = [
  {template: 'notificationsMenu', order: 0},
  {template: 'applicationRobot', order: 1},
  {template: 'ah_search', order: 2}
];
secondaryNav = [
  {template: 'userMenu', order: 0}
];

// Override autoform labels for posts, and remove URL.
addToPostSchema.push({
  propertyName: "url",
  propertySchema: {type: String, optional: true, autoform: {omit: true}}
});
addToPostSchema.push({
  propertyName: "title",
  propertySchema: {
    type: String, optional: false, label: "Question", autoform: {editable: true}
  }
});
addToPostSchema.push({
  propertyName: "body",
  propertySchema: {
    type: String, optional: true, label: "Details", autoform: {editable: true, rows: 5}
  }
});
*/

Meteor.startup(function() {
  // Replace "top" in nav if we have that as our default view.
  /*
  if (Telescope.theme.getSetting("defaultView") === "Top") {
    for (var i = 0; i < primaryNav.length; i++) {
      if (primaryNav[i] === "topQuestions") {
        primaryNav[i] = "newQuestions";
      }
    }
  }
  */
  Avatar.options.defaultImageUrl = ahAssetPath + "img/owlAvatar.png";
  Avatar.options.defaultType = 'image';
  Users.pubsub.publicProperties.roles = true;
});

contributorQueryTerms = {}
contributorQueryTerms["roles." + Roles.GLOBAL_GROUP] = {$in: ["Admin", "Officer", "Editor"]};
