Template.post_info.helpers({
  showPostedLine: function() {
    var user = Meteor.user();
    var poster = Meteor.users.findOne(this.userId);
    return (this.categories && this.categories.length) ||
           Users.can.seeTimestamps(user) ||
           Users.can.seeUsernames(user) ||
           (poster && poster.profile && poster.profile.tags && poster.profile.tags.length);
  },
  usernameOrTags: function() {
    var user = Meteor.user();
    var poster = Meteor.users.findOne(this.userId);
    return Users.can.seeUsernames(user) ||
           (poster && poster.profile && poster.profile.tags && poster.profile.tags.length);
  },
  canSeeUsernames: function() {
    return Users.can.seeUsernames(Meteor.user());
  },
  getUserTag: function(userId) {
    var tagId = dotGet(Meteor.users.findOne(userId), "profile.tags.0");
    if (tagId) {
      var tag = UserTags.findOne(tagId);
      return tag.name;
    }
    return null;
  },
  canSeeTimestamps: function() {
    return Users.can.seeTimestamps(Meteor.user());
  }
});

Template.post_author.helpers({
  hasTags: function() {
    var poster = Meteor.users.findOne(this.userId);
    return poster && poster.profile && poster.profile.tags && poster.profile.tags.length;
  }
})
