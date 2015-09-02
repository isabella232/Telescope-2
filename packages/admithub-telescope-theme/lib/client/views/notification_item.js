Template.notification_item.events({
  'click .action-link': function(event, instance){
    var notificationId=instance.data._id;
    Herald.collection.update({_id: notificationId},
                             {$set:{read: true}}, function(error, result){
        if(error){
          console.log(error);
        }
      }
    );
  }
});
