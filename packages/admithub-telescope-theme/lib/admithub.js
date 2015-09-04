// TODO:
// - user tags
// - user signatures
// - 'ask us anything'?
// - ensure:
//   - email address updates work as expected (incl hashes and user.emails)
//   - user registration works as expected
//   - roles, signature, tags all get published correctly
// - import data
// - tests?
// - update and integrate admithub-auth? at least, admithub-auth needs to use
// telescope's new schema for email_hash etc.

ahTelescopeThemeAssetPath = '/packages/admithub_admithub-telescope-theme/public/'

// Get rid of the list of views (e.g. 'Top', 'Best', etc).
Telescope.modules.remove("top", "views_menu");

// Fully replace primary and secondary nav with our own.
Telescope.modules.removeAll("primaryNav");
Telescope.modules.removeAll("secondaryNav");
_.each({
  "primaryNav": [
    {template: "notifications_menu", order: 0},
    {template: "ah_application_robot_link", order: 1},
    {template: "ah_signin", order: 2},
    {template: "search", order: 3}
  ],
  "secondaryNav": [
    {template: "user_menu"}
  ]
}, function(modules, zone) {
  modules.forEach(function(module) {
    Telescope.modules.add(zone, module);
  });
});

// We don't use URLs on posts; all posts have bodies. Make the URL field
// un-editable.
Posts.removeField("url");
Posts.addField({
  fieldName: "url",
  fieldSchema: {
    type: String,
    optional: true,
    max: 500,
    editableBy: [],
    autoform: {omit: true}
  }
});

Avatar.setOptions({
  defaultImageUrl: ahTelescopeThemeAssetPath + "img/owlAvatar.png", // TODO: replace with admithub-common asset
  fallbackType: "default image"
});

contributorQueryTerms = {}
contributorQueryTerms["roles." + Roles.GLOBAL_GROUP] = {$in: ["Admin", "Officer", "Editor"]};
