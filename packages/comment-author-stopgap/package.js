Package.describe({
  name: "admithub:comment-author-stopgap",
  summary: "Allow admins to set comment authors, until Telescope core supports it",
  version: "0.0.1",
  git: ""
});

Package.onUse(function (api) {

  api.use([
    'telescope:core'
  ]);

  api.addFiles('stopgap.js', ['client', 'server']);

});
