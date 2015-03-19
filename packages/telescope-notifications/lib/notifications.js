// add new post notification callback on post submit
postAfterSubmitMethodCallbacks.push(function (post) {

  var adminIds = _.pluck(Meteor.users.find(adminMongoQuery, {fields: {_id:1}}).fetch(), '_id');
  var notifiedUserIds = _.pluck(Meteor.users.find({'profile.notifications.posts': 1}, {fields: {_id:1}}).fetch(), '_id');

  // remove post author ID from arrays
  var adminIds = _.without(adminIds, post.userId);
  var notifiedUserIds = _.without(notifiedUserIds, post.userId);

  if (post.status === STATUS_PENDING && !!adminIds.length) { 
    // if post is pending, only notify admins
    Herald.createNotification(adminIds, {courier: 'newPost', data: post});
  } else if (!!notifiedUserIds.length) { 
    // if post is approved, notify everybody
    Herald.createNotification(notifiedUserIds, {courier: 'newPost', data: post});
  }
  return post;

});

// add new comment notification callback on comment submit
commentAfterSubmitMethodCallbacks.push(function (comment) {
  if(Meteor.isServer){

    var parentCommentId = comment.parentCommentId;
    var user = Meteor.user();
    var post = Posts.findOne(comment.postId);
    var postUser = Meteor.users.findOne(post.userId);

    var notificationData = {
      comment: _.pick(comment, '_id', 'userId', 'author', 'body'),
      post: _.pick(post, '_id', 'title', 'url')
    };

    if(parentCommentId){
      // child comment
      var parentComment = Comments.findOne(parentCommentId);
      var parentUser = Meteor.users.findOne(parentComment.userId);

      notificationData.parentComment = _.pick(parentComment, '_id', 'userId', 'author');

      // reply notification
      // do not notify users of their own actions (i.e. they're replying to themselves)
      if(parentUser._id != user._id)
        Herald.createNotification(parentUser._id, {courier: 'newReply', data: notificationData})

      // comment notification
      // if the original poster is different from the author of the parent comment, notify them too
      if(postUser._id != user._id && parentComment.userId != post.userId)
        Herald.createNotification(postUser._id, {courier: 'newComment', data: notificationData})

    }else{
      // root comment
      // don't notify users of their own comments
      if(postUser._id != user._id)
        Herald.createNotification(postUser._id, {courier: 'newComment', data: notificationData})
    }
  }

  return comment;
});

var emailNotifications = {
  propertyName: 'emailNotifications',
  propertySchema: {
    type: Boolean,
    optional: true,
    defaultValue: true,
    autoform: {
      group: 'notifications',
      instructions: 'Enable email notifications for new posts and new comments (requires restart).'
    }
  }
}
addToSettingsSchema.push(emailNotifications);
