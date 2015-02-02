var common = require("../nightwatch_globals");

module.exports = {
  beforeEach: common.prepClient,
  "Complete free trial bot": function(client) {
    client.admit.signIn({email: "student@example.com", password: "password"})
    common.url(common.URL + "/survey")
    client.end();
  }
};
