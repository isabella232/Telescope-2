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
  }
};
