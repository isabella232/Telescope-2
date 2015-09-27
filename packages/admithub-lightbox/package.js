Package.describe({
  name: "admithub:admithub-lightbox",
  summary: "popup lightbox for admit hub forum to college email leads",
  version: "0.0.1"
});

Package.onUse(function(api) {
  api.use([
    'accounts-base',
    'stylus',
    'telescope:core',
    'aldeed:simple-schema',
    'aldeed:collection2',
    'aldeed:autoform',
    'telescope:newsletter',
    'telescope:notifications',
    'standard-app-packages'
  ]);

  api.addFiles('lib/client/lightbox.html', 'client');
  api.addFiles('lib/client/lightBox.js', 'client');
  api.addFiles('lib/client/lightbox.styl', 'client');
  api.addFiles('lib/server/methods.js', 'server');
});