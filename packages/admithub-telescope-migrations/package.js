Package.describe({
  name: "admithub:admithub-telescope-migrations",
  summary: "Migrations to run before telescope",
  version: "0.0.1",
});

Package.onUse(function(api) {
  api.use([
    'telescope:core'
  ]);

  api.addFiles([
    'lib/server/migrations.js'
  ], ['server']);

});
