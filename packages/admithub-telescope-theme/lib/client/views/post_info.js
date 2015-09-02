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
  canSeeTimestamps: function() {
    return Users.can.seeTimestamps(Meteor.user());
  }
});

Template.post_author_name.helpers({
  hasTags: function() {
    var poster = Meteor.users.findOne(this.userId);
    return poster && poster.profile && poster.profile.tags && poster.profile.tags.length;
  }
})
