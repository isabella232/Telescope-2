isAdminById=function(userId){
  return Roles.userIsInRole(userId, ["Admin"], Roles.GLOBAL_GROUP);
};
isAdmin=function(user){
  user = (typeof user === 'undefined') ? Meteor.user() : user;
  return !!user && isAdminById(user._id);
};
setAdmin = function(user, admin){
  user = (typeof user === 'undefined') ? Meteor.user() : user;
  if (!admin && user.roles && user.roles[Roles.GLOBAL_GROUP] && user.roles[Roles.GLOBAL_GROUP].length) {
    user.roles[Roles.GLOBAL_GROUP] = _.without(user.roles[Roles.GLOBAL_GROUP], "Admin");
  } else if (admin) {
    if (!user.roles) {
      user.roles = {};
    }
    if (!user.roles[Roles.GLOBAL_GROUP]) {
      user.roles[Roles.GLOBAL_GROUP] = [];
    }
    if (!_.contains(user.roles[Roles.GLOBAL_GROUP]), "Admin") {
      user.roles[Roles.GLOBAL_GROUP].push("Admin");
    }
  }
};
adminMongoQuery = {$in: {}};
adminMongoQuery["$in"]["roles." + Roles.GLOBAL_GROUP] = "Admin";
notAdminMongoQuery = {$not: adminMongoQuery};
updateAdmin = function(userId, admin) {
  if (admin) {
    Roles.addUsersToRoles(userId, ['Admin'], Roles.GLOBAL_GROUP);
  } else {
    Roles.removeUsersFromRoles(userId, ['Admin'], Roles.GLOBAL_GROUP);
  }
};
isInvited=function(user){
  if(!user || typeof user === 'undefined')
    return false;
  return isAdmin(user) || !!user.isInvited;
};
adminUsers = function(){
  return Roles.getUsersInRole("Admin", Roles.GLOBAL_GROUP);
};
getUserName = function(user){
  try{
    if (user.username)
      return user.username;
    if (user && user.services && user.services.twitter && user.services.twitter.screenName)
      return user.services.twitter.screenName
  }
  catch (error){
    console.log(error);
    return null;
  }
};
getDisplayName = function(user){
  return (user.profile && user.profile.name) ? user.profile.name : getUserName(user);
};
getDisplayNameById = function(userId){
  return getDisplayName(Meteor.users.findOne(userId));
};
getProfileUrl = function(user) {
  return Meteor.absoluteUrl()+'users/' + slugify(getUserName(user));
};
getProfileUrlById = function(id){
  return Meteor.absoluteUrl()+'users/'+ id;
};
getProfileUrlBySlug = function(slug) {
  return Meteor.absoluteUrl()+'users/' + slug;
};
hasPassword = function(user) {
  return !!user.services.password;
};
getTwitterName = function(user){
  // return twitter name provided by user, or else the one used for twitter login
  if(checkNested(user, 'profile', 'twitter')){
    return user.profile.twitter;
  }else if(checkNested(user, 'services', 'twitter', 'screenName')){
    return user.services.twitter.screenName;
  }
  return null;
};
getGitHubName = function(user){
  // return twitter name provided by user, or else the one used for twitter login
  if(checkNested(user, 'profile', 'github')){
    return user.profile.github;
  }else if(checkNested(user, 'services', 'github', 'screenName')){ // TODO: double-check this with GitHub login
    return user.services.github.screenName;
  }
  return null;
};
getTwitterNameById = function(userId){
  return getTwitterName(Meteor.users.findOne(userId));
};
getEmail = function(user){
  if(user.emails && user.emails[0] && user.emails[0].address){
    return user.emails[0].address;
  }else{ 
    return null; 
  }
};
getEmailHash = function(user){
  // has to be this way to work with Gravatar
  return Gravatar.hash(getEmail(user));
};
getAvatarUrl = function(user) {
  console.warn('FUNCTION getAvatarUrl() IS DEPRECATED -- package bengott:avatar is used instead.')
  return Avatar.getUrl(user);
};
getCurrentUserEmail = function(){
  return Meteor.user() ? getEmail(Meteor.user()) : '';
};
userProfileComplete = function(user) {
  for (var i = 0; i < userProfileCompleteChecks.length; i++) {
    if (!userProfileCompleteChecks[i](user)) {
      return false;
    }
  }
  return true;
};

findLast = function(user, collection){
  return collection.findOne({userId: user._id}, {sort: {createdAt: -1}});
};
timeSinceLast = function(user, collection){
  var now = new Date().getTime();
  var last = findLast(user, collection);
  if(!last)
    return 999; // if this is the user's first post or comment ever, stop here
  return Math.abs(Math.floor((now-last.createdAt)/1000));
};
numberOfItemsInPast24Hours = function(user, collection){
  var mDate = moment(new Date());
  var items=collection.find({
    userId: user._id,
    createdAt: {
      $gte: mDate.subtract(24, 'hours').valueOf()
    }
  });
  return items.count();
};
getUserSetting = function(setting, defaultValue, user){
  var user = (typeof user == 'undefined') ? Meteor.user() : user;
  var defaultValue = (typeof defaultValue == "undefined") ? null: defaultValue;
  var settingValue = getProperty(user.profile || {}, setting);
  return (settingValue == null) ? defaultValue : settingValue;
};
setUserSetting = function (setting, value, userArgument) {
  // note: for some very weird reason, doesn't work when called from Accounts.onCreateUser

  var user;

  if(Meteor.isClient){
    user = Meteor.user(); // on client, default to current user
  }else if (Meteor.isServer){
    user = userArgument; // on server, use argument
  }

  if(!user)
    throw new Meteor.Error(500, 'User not defined');

  console.log('Setting user setting "'+setting+'" to "'+value+'" for '+getUserName(user));
  var find = {_id: user._id};
  var field = {};
  field['profile.'+setting] = value;
  var options = {$set: field};
  // console.log(find);
  // console.log(options);
  var result = Meteor.users.update(find, options, {validate: false});
};

getProperty = function(object, property){
  // recursive function to get nested properties
  var array = property.split('.');
  if(array.length > 1){
    var parent = array.shift();
    // if our property is not at this level, call function again one level deeper if we can go deeper, else return null
    return (typeof object[parent] == "undefined") ? null : getProperty(object[parent], array.join('.'));
  }else{
    // else return property
    return object[array[0]];
  }
};
