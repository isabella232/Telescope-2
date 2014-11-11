Meteor.startup(function() {

  var _getUserTags = function(user) {
    if (!(user && user.profile && user.profile.tags && user.profile.tags.length)) {
      return [];
    }
    return UserTags.find({_id: {$in: user.profile.tags || []}}).fetch();
  }


  Template[getTemplate('userTagsForPost')].helpers({
    userTags: function() {
      var post = this;
      var user = Meteor.users.findOne(post.userId);
      return _getUserTags(user);
    }
  });

  var _handleError = function(err) {
    console.log(err);
    flashMessage(err.reason, "error");
    clearSeenErrors();
  }

  Template[getTemplate('usertags')].events({
    'submit .js-add-user-tag': function(event) {
      event.preventDefault();
      var nameEl = $("[name=newtagname]");
      var name = nameEl.val();
      if (name) {
        Meteor.call("addUserTag", name, function(err) {
          if (err) {
            _handleError(err);
          } else {
            nameEl.val("");
          }
        })
      }
    }
  });

  Template[getTemplate('usertags')].helpers({
    usertags: function() {
      return UserTags.find({}).fetch();
    }
  });

  Template[getTemplate('listUserTags')].helpers({
    mytags: function() {
      var user = this;
      return _getUserTags(user);
    }
  })

  Template[getTemplate('editUserTags')].helpers({
    availableTags: function() {
      var user = this;
      user.profile = user.profile || {};
      var userTagIds = user.profile.tags || [];
      var allTags = UserTags.find({}).fetch();
      return _.map(allTags, function(tag) {
        var attrs = {
          name: "usertag",
          value: tag._id
        };
        if (_.contains(userTagIds, tag._id)) {
          attrs.checked = "checked";
        }
        return {name: tag.name, attrs: attrs};
      });
    }
  })

  Template[getTemplate('usertagItem')].events({
    'submit .js-edit-user-tag': function(event) {
      event.preventDefault();
      var scope = $(event.currentTarget);
      var newName = scope.find("[name=name]").val();
      var _id = scope.find("[name=name]").attr("data-tag-id");
      Meteor.call("updateUserTag", _id, newName, function(err) {
        if (err) {
          _handleError(err);
        } else {
          flashMessage(i18n.t("Tag edited."), "success");
        }
      });
    },
    'click .delete': function(event) {
      event.preventDefault();
      var _id = $(event.currentTarget).attr("data-tag-id");
      var tag = UserTags.findOne(_id);
      if (tag && confirm(i18n.t("Are you sure you want to delete this tag?"))) {
        Meteor.call("deleteUserTag", _id, function(err) {
          if (err) {
            _handleError(err);
          } else {
            flashMessage(i18n.t("Tag deleted."), "success");
          }
        });
      }
    }
  });

});
