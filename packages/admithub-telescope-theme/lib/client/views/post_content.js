Template.post_content.helpers({
  justTitle: function() {
    return _.filter(postHeading, function(obj) {
      return obj.template === 'postTitle'
    });
  },

  allButTitle: function() {
    return _.filter(postHeading, function(obj) {
      return obj.template !== 'postTitle'
    });
  }
})
