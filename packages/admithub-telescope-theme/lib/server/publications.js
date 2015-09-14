Meteor.publish("contributors", function() {
  return [
    Meteor.users.find(ahContributorQueryTerms, {fields: Users.pubsub.publicProperties}),
    Comments.find({isDeleted: {$ne: true}}, {fields: {userId: 1}})
  ];
});
