ahTelescopeThemeAssetPath = '/packages/admithub_admithub-telescope-theme/public/'

// Get rid of the list of views (e.g. 'Top', 'Best', etc).
Telescope.modules.remove("top", "views_menu");
Telescope.modules.remove("hero", "newsletter_banner");
Telescope.menuItems.add("adminMenu", [
  {
    route: 'posts_pending',
    label: 'Pending Posts'
  }
]);

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

// Override Posts schema definitions.  We're not using addField/removeField
// here so we don't upset the field order.
var PostsSchema = Posts.simpleSchema()._schema;
PostsSchema['title'].label = "Question";
PostsSchema['body'].label = "Details";
PostsSchema['url'].editableBy = [];
PostsSchema['url'].autoform = {omit: true};
PostsSchema['thumbnailUrl'].editableBy = [];
PostsSchema['thumbnailUrl'].autoform = {omit: true};
Posts.attachSchema(PostsSchema);

Avatar.setOptions({
  defaultImageUrl: ahTelescopeThemeAssetPath + "img/owlAvatar.png", // TODO: replace with admithub-common asset?
  fallbackType: "default image"
});

ahContributorQueryTerms = {}
ahContributorQueryTerms["roles." + Roles.GLOBAL_GROUP] = {$in: ["Admin", "Officer", "Editor"]};
