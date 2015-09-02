Template.layout.events({
  'click .flash-messages .close': function(e) {
    $(e.currentTarget).closest(".alert").remove();
  },
});
