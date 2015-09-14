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

if (Meteor.isClient) {
  AutoForm.addInputType("usertags", {
    template: "usertags_autoform"
  });
}
