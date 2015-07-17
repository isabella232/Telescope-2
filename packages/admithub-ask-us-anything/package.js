Package.describe({
  name: "admithub:admithub-ask-us-anything",
  summary: "AdmitHub Ask Us Anything banner feature",
  version: "0.0.1",
  git: ""
});

Package.onUse(function (api) {

  api.use([
      'underscore',
      'alanning:roles',
      'aldeed:simple-schema',
      'aldeed:autoform@5.0.0',
      'bengott:avatar',
      'jparker:gravatar',
      'iron:router',
      'richsilv:pikaday@1.0.0',
      'telescope-lib',
      'telescope-base',
      'telescope-daily',
      'telescope-newsletter',
      'telescope-notifications',
      'telescope-rss',
      'telescope-search',
      'telescope-tags',
      'standard-app-packages',
      'stylus',
      'reactive-var'
  ]);

  api.addFiles('lib/ask_us_anything.js', ['client', 'server']);

  api.addFiles('lib/client/views/ah_ask_us_anything_banner.html', 'client');
  api.addFiles('lib/client/views/ah_ask_us_anything_banner.styl', 'client');
  api.addFiles('lib/client/views/ah_ask_us_anything_banner.js', 'client');

});
