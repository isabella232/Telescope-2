Package.describe({
  summary: "Telescope user tags package",
  name: "telescope-user-tags",
  version: "0.0.1"
});

Package.onUse(function(api) {
  api.use([
    'telescope-lib',
    'telescope-base',
    'aldeed:simple-schema',
    'standard-app-packages'
  ], ['client', 'server']);

  api.use([
    'jquery',
    'underscore',
    'iron:router',
    'templating'
  ], 'client');

  api.add_files([
    'lib/userTags.js',
  ], ['client', 'server']);

  api.add_files([
    'lib/client/routes.js',
    'lib/client/views/userTag.html',
    'lib/client/views/userTag.js',
    'lib/client/views/userTag.css'
  ], ['client']);

  api.add_files([
    'lib/server/publications.js'
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
