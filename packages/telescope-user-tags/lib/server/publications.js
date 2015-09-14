Meteor.publish('usertags', function() {
  if(Users.can.viewById(this.userId)){
    return UserTags.find();
  }
  return [];
});
Users.pubsub.publicProperties['profile.tags'] = true;

