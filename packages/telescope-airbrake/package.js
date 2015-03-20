Package.describe({
  summary: 'Integration of Airbrake error reporting for Telescope',
  version: '0.0.1',
  name: 'telescope-airbrake'
});
Npm.depends({
  "airbrake": "0.3.8"
});
Package.onUse(function (api) {
  // --------------------------- 1. Meteor packages dependencies ---------------------------

  api.use([
    'templating',
    'tap:i18n', // internationalization package
    'jquery',
    'telescope-base', // basic Telescope hooks and objects
    'telescope-lib', // useful functions
    'telescope-i18n', // internationalization wrapper
  ]);

  // ---------------------------------- 2. Files to include ----------------------------------
  // i18n config (must come first)
  api.add_files(['package-tap.i18n'], ['client', 'server']);
  // both
  api.add_files(['lib/airbrake.js'], ['client', 'server']);
  // client
  api.add_files(['lib/client/airbrake-shim.js'], 'client');
  // i18n languages (must come last)
  api.add_files([
    'i18n/en.i18n.json',
  ], ['client', 'server']);
});
