["category_list", "category_select"].forEach(function(template) {
  Template[template].helpers({
    categories: function() {
      var cats = []
      Categories.find({}, {"sort": {name: 1}}).forEach(function(cat) {
        var href = Router.path("posts_category", {slug: cat.slug});
        cats.push({
          href: href,
          name: cat.name,
          active: href === document.location.pathname
        })
      });
      return cats;
    }
  });
});

Template.category_select.events({
  "change .js-category-select-nav": function(event) {
    Router.go($(event.currentTarget).val());
  }
});
