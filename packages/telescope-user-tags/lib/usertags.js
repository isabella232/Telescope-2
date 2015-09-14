Telescope.subscriptions.preload('usertags');

var userTagSchema = new SimpleSchema({
  name: {type: String},
  slug: {type: String, unique: true}
});

UserTags = new Mongo.Collection("usertags");
UserTags.attachSchema(userTagSchema);

Users.addField({
  fieldName: 'profile.tags',
  fieldSchema: {
    type: [String], // reference to UserTag _id
    label: "I identify as a",
    profile: true,
    template: "profile_list_usertags",
    required: true,
    editableBy: ["member", "admin"],
    autoform: {
      type: "usertags"
    }
  }
});

Telescope.callbacks.profileCompletedChecks.push(function(user) {
  // complete if profile.tags exists, even if it's empty.
  return !!(user.profile && user.profile.tags);
});

Telescope.menuItems.add("adminMenu", {
  route: "usertags",
  label: "User Tags",
  description: "Edit available user tags"
});

Router.onBeforeAction(Router._filters.isAdmin, {only: ['usertags']});
// User tags administration view
Router.route('/usertags', {
  name: 'usertags',
  template: 'admin_usertags'
});

if (Meteor.isClient) {
  AutoForm.addInputType("usertags", {
    template: "usertags_autoform"
  });
}
