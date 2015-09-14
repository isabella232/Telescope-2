Template.post_admin.events({
  'click .approve-link': function(e, instance){
    Meteor.call('approvePost', this);
    e.preventDefault();
  },
  'click .unapprove-link': function(e, instance){
    Meteor.call('unapprovePost', this);
    e.preventDefault();
  }
});
