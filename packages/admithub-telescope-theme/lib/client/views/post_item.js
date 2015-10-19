Template.ah_post_title_and_content.helpers({
  getBodyTemplateName: function() {
    // Return the full body if we're on a post detail page, and a teaser
    // otherwise.
    if (_.contains(["post_page"], Router.current().route.getName())) {
      return "post_body";
    }
    return "ah_post_teaser";
  },
  can_edit: function() {
    return Users.can.edit(Meteor.user(), this);
  }
});

