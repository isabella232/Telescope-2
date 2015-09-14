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
    'lib/client/usertags.html',
    'lib/client/usertags.js',
    'lib/client/usertags.css',
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
