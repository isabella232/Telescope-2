Template.notifications_menu.helpers({
  countNotifications: function() {
    return Herald.collection.find({userId: Meteor.userId(), read: false}).count();
  }
});
Template.notifications_menu.events({
  'click .notifications-toggle': function(e){
    e.preventDefault();
    $('body').toggleClass('notifications-open');
  },
  'click .mark-as-read': function(){
    Meteor.call('heraldMarkAllAsRead',
      function(error, result){
        error && console.log(error);
      }
    );
  }
});
