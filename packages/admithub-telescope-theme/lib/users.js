// Schema loading happens in 3 phases -- ensure that packages are loaded in this order:
// 1. telescope:telescope-users attaches a schema.
// 2. admithub:admithub-common attaches its schema (replacing telescope-users').
// 3. we add back the telescope-users bits here.
Users.addField({
  fieldName: 'telescope',
  fieldSchema: {
    type: Telescope.schemas.userData, optional: true
  }
});

// Set up "roles" for auth
var adminMongoQuery = {};
adminMongoQuery["roles." + Roles.GLOBAL_GROUP] = "Admin";
var notAdminMongoQuery = {};
notAdminMongoQuery["roles." + Roles.GLOBAL_GROUP] = {"$ne": "Admin"};

Users.is.admin = function(userOrUserId) {
  if (userOrUserId === undefined) {
    try {
      userOrUserId = Meteor.userId();
    } catch (e) {
      return false;
    }
  }
  return Roles.userIsInRole(userOrUserId, ["Admin"]);
};
Users.is.adminById = Users.is.admin;

Users.can.comment = function(user, returnError) {
  if (Roles.userIsInRole(user, ["Admin", "Editor", "Officer"], Roles.GLOBAL_GROUP)) {
    return true;
  }
  return returnError ? "no_rights" : false;
};

Users.commenters = function(options) {
  return Roles.getUsersInRole(["Admin", "Editor", "Officer"], Roles.GLOBAL_GROUP, options);
};


// Include roles in public properties.
Users.pubsub.publicProperties.roles = true;

// Alter definition of admin for the purposes of filtering post lists.
// May be unnecessary -- see https://github.com/TelescopeJS/Telescope/issues/1119
Users.pubsub.getSubParams = function(filterBy, sortBy, limit) {
  var find = {},
      sort = {createdAt: -1};

  switch(filterBy) {
    case 'invited':
      find = {$or: [{isInvited: true}, adminMongoQuery]};
      break;
    case 'uninvited':
      find = {$and: [{isInvited: false}, notAdminMongoQuery]}
      break;
    case 'admin':
      find = adminMongoQuery;
      break;
  }

  switch(sortBy) {
    case 'username':
      sort = { username: 1 };
      break;
    case 'karma':
      sort = { karma: -1 };
      break;
    case 'postCount':
      sort = { postCount: -1 };
      break;
    case 'commentCount':
      sort = { commentCount: -1 };
      break;
    case 'invitedCount':
      sort = { invitedCount: -1 };
      break
  }
  return {
    find: find,
    options: { sort: sort, limit: limit }
  };
};
Users.getSubParams = Users.pubsub.getSubParams;

Users.updateAdmin = function(userId, admin) {
  if (admin) {
    Roles.addUsersToRoles(userId, ["Admin"], Roles.GLOBAL_GROUP);
  } else {
    Roles.removeUsersFromRoles(userId, ["Admin"], Roles.GLOBAL_GROUP);
  }
};

Users.adminUsers = function(options) {
  return Meteor.users.find(adminMongoQuery, options);
};

if (Meteor.isClient) {
  // Change reactive table for users to use Users.is.admin(user) instead of user.isAdmin boolean.
  Template.users_dashboard.helpers({
    settings: function() {
      return {
        collection: 'all-users',
        rowsPerPage: 20,
        showFilter: true,
        fields: [
          { key: 'avatar', label: '', tmpl: Template.users_list_avatar, sortable: false },
          { key: 'createdAt', label: 'Member Since', tmpl: Template.users_list_created_at, sort: 'descending' },
          { key: 'isAdmin', label: 'Admin', fn: function(val, object){ return Users.is.admin(object) }},
          { key: 'username', label: 'Username', tmpl: Template.users_list_username },
          { key: 'telescope.displayName', label: 'Display Name', tmpl: Template.users_list_display_name },
          { key: 'telescope.email', label: 'Email', tmpl: Template.users_list_email },
          { key: 'telescope.postCount', label: 'Posts' },
          { key: 'telescope.commentCount', label: 'Comments' },
          { key: 'telescope.karma', label: 'Karma', fn: function(val){return Math.round(100*val)/100} },
          { key: 'telescope.inviteCount', label: 'Invites' },
          { key: 'telescope.isInvited', label: 'Invited', fn: function(val){return val ? 'Yes':'No'} },
          { key: 'actions', label: 'Actions', tmpl: Template.users_list_actions, sortable: false }
        ]
      };
    }
  });
}


// AdmitHub permissions additions
Users.can.seeTimestamps = function(user) {
  return Roles.userIsInRole(user, ["Admin", "Officer"], Roles.GLOBAL_GROUP);
};
Users.can.seeUsernames = function(user) {
  return Roles.userIsInRole(user, ["Admin"], Roles.GLOBAL_GROUP);
};
