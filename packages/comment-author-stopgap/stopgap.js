var CommentSchema = Comments.simpleSchema()._schema;
CommentSchema.userId.editableBy = ['admin'];
CommentSchema.userId.autoform = {
  group: 'admin',
  options: function() {
    return Meteor.users.find().map(function (user) {
      return {
        value: user._id,
        label: Users.getDisplayName(user)
      };
    });
  }
};
Comments.attachSchema(CommentSchema);

Comments.controllers.page.waitOn = function() {
  return [
    Telescope.subsManager.subscribe('singleCommentAndChildren', this.params._id),
    Telescope.subsManager.subscribe('commentUsers', this.params._id),
    Telescope.subsManager.subscribe('commentPost', this.params._id),
    Telescope.subsManager.subscribe('allUsersAdmin')
  ];
};
