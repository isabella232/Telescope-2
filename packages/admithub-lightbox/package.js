Package.describe({
  name: "admithub:admithub-lightbox",
  summary: "popup lightbox for admit hub forum to college email leads",
  version: "0.0.1"
});

Package.onUse(function(api) {
  api.use([
    'accounts-base',
    'stylus',
    'telescope:core@0.24.0',
    'aldeed:simple-schema',
    'aldeed:collection2',
    'aldeed:autoform'  
  ]);

  api.addFiles('lib/lightBox.js', ['client', 'server']);
  api.addFiles('lib/lightbox.html', ['client', 'server']);
});