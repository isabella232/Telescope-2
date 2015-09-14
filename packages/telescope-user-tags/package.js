Package.describe({
  summary: "Telescope user tags package",
  name: "admithub:telescope-user-tags",
  version: "0.1.0"
});

Package.onUse(function(api) {
  api.use([
    'standard-app-packages',
    'telescope:core',
    'aldeed:simple-schema'
  ], ['client', 'server']);

  api.use([
    'jquery',
    'underscore',
    'iron:router',
    'templating',
    'aldeed:autoform'
  ], 'client');

  api.add_files([
    'lib/usertags.js',
  ], ['client', 'server']);

  api.add_files([
    'lib/client/routes.js',
    'lib/client/views/usertags.html',
    'lib/client/views/usertags.js',
    'lib/client/views/usertags.css',
    'lib/client/views/user_complete.html',
    'lib/client/views/user_complete.js'
  ], ['client']);

  api.add_files([
    'lib/server/publications.js',
    'lib/server/methods.js'
  ], ['server']);

  api.export([
    'adminNav',
    'postAuthor',
    'preloadSubscriptions',
    'addToUserSchema',
    'userProfileDisplay',
    'userProfileEdit',
    'userProfileFinishSignup',
    'userEditClientCallbacks',
    'userProfileCompleteChecks',
    'UserTags'
  ]);

});
