preloadSubscriptions.push('usertags');

// Add our template to user profile viewing.
userProfileDisplay.push({template: "listUserTags", order: 2});
// Add our template to user profile editing.
userProfileEdit.push({template: "editUserTags", order: 2});
// Add our template to the finish-signup view.
userProfileFinishSignup.push({template: "editUserTags", order: 2});
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
// Callback to determine whether or not a user profile is complete.
userProfileCompleteChecks.push(function(user) {
  if (UserTags.find({}, {limit: 1}).count()) {
    return user && user.profile && typeof user.profile.tags !== "undefined";
  }
  return true;
});
// Add tags to the post info byline display
postAuthor.push({template: "userTagsForPost", order: 2})

// Add our admin view to nav.
adminNav.push({route: 'usertags', label: "User Tags"});
Meteor.startup(function() {
  Router.onBeforeAction(Router._filters.isAdmin, {only: ['usertags']});
  // User tags administration view
  Router.route('/usertags', {
    name: 'usertags'
  });
});
