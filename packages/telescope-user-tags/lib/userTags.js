var userTagSchema = new SimpleSchema({
  name: {type: String},
  slug: {type: String, unique: true}
});

UserTags = new Mongo.Collection("usertags");
UserTags.attachSchema(userTagSchema);

addToUserSchema.push({
  propertyName: "profile.tags",
  propertySchema: {
    type: [String], // reference to UserTag _id
    optional: true
  }
})

postAuthor.push({
  template: 'userTags',
  order: 2
});
