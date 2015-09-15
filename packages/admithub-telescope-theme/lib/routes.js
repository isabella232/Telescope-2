if (Meteor.isClient) {
  Meteor.startup(function() {
    // Put touts templates on post list pages.
    Router.onAfterAction(function() {
      this.render("ah_touts", {to: "touts"});
    }, {
      only: ['posts_top', 'posts_default', 'posts_new', 'posts_best', 'post_page']
    });

    Router.route("/contributors", {
      name: "contributors_redirect",
      action: function() {
        Router.go("/partners-and-contributors", null, {"replaceState": true});
      }
    });

    Router.route("/partners-and-contributors", {
      name: "contributors",
      waitOn: function() { return Meteor.subscribe("contributors"); }
    });
  });
}
