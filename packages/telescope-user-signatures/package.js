Package.describe({
  summary: "Signatures for Telescope users",
  name: "admithub:telescope-user-signatures",
  version: "0.0.1"
});

Package.onUse(function(api) {
  api.use([
    'telescope-lib',
    'telescope-base',
    'chuangbo:marked',
    'standard-app-packages',
  ], ['client', 'server']);
  api.use(['jquery', 'underscore', 'templating'], 'client')

  api.add_files('lib/userSignatures.js');
  api.add_files('lib/userSignatures.html', 'client');
});
