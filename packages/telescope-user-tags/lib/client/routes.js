//preloadSubscriptions.push('usertags');

Telescope.modules.add("profileDisplay", {
  template: "list_usertags", 
  order: 1
});
Telescope.modules.add("profileEdit", {
  template: "edit_usertags_profile",
  order: 1
});

/*
// Add our template to the finish-signup view.
//userProfileFinishSignup.push({template: "editUserTags", order: 2});
// Callback for processing user properties when editing a profile.
userEditClientCallbacks.push(function(user, properties) {
  if ($(".user-tag-form").length) {
    var tags = [];

    $("[name=usertag]:checked").each(function(i, el) {
      tags.push($(el).val());
    })
    properties["profile.tags"] = tags;
  }
  return properties;
});
*/

Telescope.menuItems.add("adminMenu", {
  route: "usertags",
  label: "User Tags",
  description: "Edit available user tags"
});

Meteor.startup(function() {
  Router.onBeforeAction(Router._filters.isAdmin, {only: ['usertags']});
  // User tags administration view
  Router.route('/usertags', {
    name: 'usertags',
    template: 'admin_usertags'
  });
});
