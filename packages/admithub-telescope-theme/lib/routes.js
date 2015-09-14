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

//    // Set titles on post list pages.
//    function listTitle(title) {
//      Session.set("postListTitle", title);
//    }
//    var defaultView = Telescope.theme.getSetting("defaultView");
//    var topTitles = ["posts_top"];
//    var newTitles = ["posts_new"];
//    if (defaultView === "Top") {
//      topTitles.push("posts_default");
//    } else if (defaultView === "New") {
//      newTitles.push("posts_default");
//    }
//    Router.onAfterAction(function() { listTitle("Top Questions"); },
//                         {only: topTitles});
//    Router.onAfterAction(function() { listTitle("Newest Questions"); },
//                         {only: newTitles});
//    Router.onAfterAction(function() { listTitle("Pending Questions"); },
//                         {only: ['posts_pending']});
//    Router.onAfterAction(function() { listTitle("Daily Digest"); },
//                         {only: ['posts_digest']});
//    Router.onAfterAction(function() {
//      cat = Categories.findOne({"slug": this.params.slug});
//      listTitle(cat ? "Posts tagged “" + cat.name + "”" : "");
//    }, {only: ["posts_category"]});
//    // Clear titles if we aren't using them.
//    Router.onAfterAction(function() { listTitle(""); }, {except: [
//      "posts_default", "posts_top", "posts_new", "posts_pending",
//      "posts_digest", "posts_category"
//    ]});

    // Fix scroll position on category page links (issue #12)
//    Router.onAfterAction(function() { window.scrollTo(0, 0); }, {only: ["posts_category"]});

//    // Redirect submit to login instead of permission denied.
//    Router.onBeforeAction(function() {
//      if (this.ready() && !Meteor.loggingIn()) {
//        if (!Meteor.user()) {
//          Router.go('/sign-in');
//          Messages.flash("Please sign in or register to post a question", "info");
//          // Don't fire 'next' so that we don't get the unwanted flash message from core.
//        } else {
//          Messages.clearSeen();
//          this.next();
//        }
//      }
//    }, {only: ['post_submit']});
  });
}
