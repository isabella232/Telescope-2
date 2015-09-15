// format and strategy copied from telescope:migrations

var AhMigrations = new Meteor.Collection('admithubtelescopemigrations');
Meteor.startup(function() {
  var allMigrations = Object.keys(migrationList);
  _.each(allMigrations, function(migrationName) {
    runMigration(migrationName);
  });
});

var runMigration = function(migrationName) {
  var migration = AhMigrations.findOne({name: migrationName});
  if (migration) {
    if (typeof migration.finishedAt === 'undefined') {
      // if migration exists but hasn't finished, remove it and start fresh
      console.log('!!! Found incomplete migration "'+migrationName+'", removing and running again.');
      AhMigrations.remove({name: migrationName});
    } else {
      // migration finished -- do nothing
      // console.log('Migration "'+migrationName+'" already exists, doing nothing.')
      return;
    }
  }

  console.log("//----------------------------------------------------------------------//");
  console.log("//------------//    Starting "+migrationName+" Migration    //-----------//");
  console.log("//----------------------------------------------------------------------//");
  AhMigrations.insert({name: migrationName, startedAt: new Date(), completed: false});

  // execute migration function
  var itemsAffected = migrationList[migrationName]() || 0;

  AhMigrations.update({name: migrationName}, {$set: {finishedAt: new Date(), completed: true, itemsAffected: itemsAffected}});
  console.log("//----------------------------------------------------------------------//");
  console.log("//------------//     Ending "+migrationName+" Migration     //-----------//");
  console.log("//----------------------------------------------------------------------//");
};

var migrationList = {

  addPostedAt: function() {
    var i = 0;
    Posts.find({postedAt: {$exists: false}, submitted: {$exists: false}}).forEach(function(post) {
      i++;
      Posts.update(post._id, {$set: {'postedAt': post.createdAt}});
    });
    return i;
  },

  overrideMoveVotesFromProfile: function() {
    // Telescope's 'moveVotesFromProfile' assumes fields will be there that aren't.
    // See https://github.com/TelescopeJS/Telescope/blob/04ee6e908dd65a6e94b127e534854bee812fff27/packages/telescope-migrations/lib/server/migrations.js#L326-L341

    // Fetch the telescope migration -- if it has finished, move on.
    var migration = Migrations.findOne({name: "moveVotesFromProfile"});
    if (migration && _.isDate(migration.finishedAt)) {
      return;
    }

    var i = 0;
    ['profile.upvotedPosts',
     'profile.downvotedPosts',
     'profile.upvotedComments',
     'profile.downvotedComments'].forEach(function(oldField) {

      // Look for any users that have the given field.
      var query = {};
      query[oldField] = {$exists: true};
      var users = Meteor.users.find(query);

      users.forEach(function(user) {
        var rename = {};
        rename[oldField] = oldField.replace("profile", "telescope");
        Meteor.users.update(user._id, {$rename: rename}, {multi: true, validate: false});
        i++;
      });
    });

    // mark the Telescope migration as finished so it doesn't run.
    if (migration) {
      Migrations.update(migration._id, {$set: {finishedAt: new Date()}});
    } else {
      Migrations.insert({name: "moveVotesFromProfile", finishedAt: new Date()});
    }

    return i;
  },

  setTelescopeEmail: function() {
    var i = 0;
    Meteor.users.find({"telescope.email": {$exists: false}, "emails.0.address": {$exists: true}}).forEach(function(user) {
      Meteor.users.update(user._id, {$set: {"telescope.email": user.emails[0].address}});
      i++;
    });
    return i;
  },
};
