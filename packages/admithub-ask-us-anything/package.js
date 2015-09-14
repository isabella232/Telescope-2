Package.describe({
  name: "admithub:admithub-ask-us-anything",
  summary: "AdmitHub Ask Us Anything banner feature",
  version: "0.0.1",
  git: ""
});

Package.onUse(function (api) {

  api.use([
      'underscore',
      'aldeed:simple-schema',
      'aldeed:autoform@5.3.2',
      'telescope:core',
      'telescope:newsletter',
      'telescope:notifications',
      'standard-app-packages',
      'stylus',
      'reactive-var'
  ]);

  api.addFiles('lib/client/views/ah_ask_us_anything_banner.html', 'client');
  api.addFiles('lib/client/views/ah_ask_us_anything_banner.styl', 'client');
  api.addFiles('lib/client/views/ah_ask_us_anything_banner.js', 'client');

  api.addFiles('lib/server/methods.js', 'server');

});
