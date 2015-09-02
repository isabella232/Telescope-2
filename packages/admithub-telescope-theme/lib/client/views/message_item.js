var levels = {
  "error": "danger",
};
Template.message_item.helpers({
  getLevel: function(type) {
    return levels[type] || type;
  }
});
Template.message_item.events({
  'click .flash-messages .close': function(e) {
    $(e.currentTarget).closest(".alert").remove();
  }
});
