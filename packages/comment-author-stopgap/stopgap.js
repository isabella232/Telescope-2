if (Meteor.isServer) {
  Meteor.publish('ahAllCommentersAdmin', function() {
    return Users.commenters(Users.pubsub.avatarProperties);
  });
}

var CommentSchema = Comments.simpleSchema()._schema;
CommentSchema.userId.editableBy = ['admin'];
CommentSchema.userId.autoform = {
  group: 'admin',
  options: function() {
    return Users.commenters().map(function (user) {
      return {
        value: user._id,
        label: Users.getDisplayName(user)
      };
    });
  }
};
Comments.attachSchema(CommentSchema);

Comments.controllers.page.prototype.waitOn = function() {
  return [
    Telescope.subsManager.subscribe('singleCommentAndChildren', this.params._id),
    Telescope.subsManager.subscribe('commentUsers', this.params._id),
    Telescope.subsManager.subscribe('commentPost', this.params._id),
    Telescope.subsManager.subscribe('ahAllCommentersAdmin')
  ];
};

var origSubscriptions = Posts.controllers.page.prototype.subscriptions;
Posts.controllers.page.prototype.subscriptions = function() {
  origSubscriptions.call(this);
  Telescope.subsManager.subscribe('ahAllCommentersAdmin');
};

