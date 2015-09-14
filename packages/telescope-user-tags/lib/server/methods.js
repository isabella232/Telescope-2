Users.can.editUserTags = function(userOrId) {
  return Users.is.adminById(userOrId);
};

var _slugifyUserTagName = function(name) {
  return name.toLowerCase().replace(/[^-a-z0-9]+/g, "-").replace(/(^-+|-+$)/g, "");
}

// Admin methods for CRUD for user tags.
Meteor.methods({
  addUserTag: function(name) {
    if (!Users.can.editUserTags(Meteor.userId())) {
      throw new Meteor.Error(403, i18n.t("You need to log in as an admin to add a new user tag."));
    }
    var tagId = UserTags.insert({
      name: name,
      slug:_slugifyUserTagName(name)
    });
  },
  updateUserTag: function(_id, newName) {
    if (!Users.can.editUserTags(Meteor.userId())) {
      throw new Meteor.Error(403, i18n.t("You need to log in as an admin to edit user tags."));
    }
    UserTags.update(_id, {$set: {
      name: newName,
      slug: _slugifyUserTagName(newName)
    }})
  },
  deleteUserTag: function(_id) {
    if (!Users.can.editUserTags(Meteor.userId())) {
      throw new Meteor.Error(403, i18n.t("You need to log in as an admin to delete user tags."));
    }
    Meteor.users.update({}, {$pull: {"profile.tags": _id}});
    UserTags.remove(_id);
  }
})

