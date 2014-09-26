Template[getTemplate('postAdmin')].helpers({
  postsMustBeApproved: function () {
    return !!getSetting('requirePostsApproval');
  },
  isApproved: function(){
    return this.status == STATUS_APPROVED;
  },
  shortScore: function(){
    return Math.floor(this.score*1000)/1000;
  },
  is_admin: function(user) {
    return Roles.userIsInRole(user, "Admin", Roles.GLOBAL_GROUP);
  }
});
