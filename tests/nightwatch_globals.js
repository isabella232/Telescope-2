var fixtures = require("./fixtures.json");
var mongodb = require("mongodb");
var _ = require("underscore");

var exp = {
  BASE_URL: "http://localhost:3000",
  MONGO_URL: "mongodb://localhost:3001/meteor",
  waitForConditionTimeout: 10000,
  timeoutsImplicitWait: 10000
};

exp.prepClient = function(client) {
  //////////////////////////////////////////////////////
  // Client actions

  // Set the window size.
  client.windowHandle(function(handle) {
    client.windowSize(handle.value, 1024, 768);
  });

  // Set up a namespace on client for all of our custom methods.
  client.admit = {};

  // Sign up  a new user account with the given data.
  client.admit.signUp = function(data) {
    client.url(exp.BASE_URL + "/signup")
      .waitForElementVisible("[name=email]")
      .setValue('input[name=email]', data.email)
      .setValue('input[name=password]', data.password);
    if (data.isStudent) {
      client.click('[name=isStudent][value=true]')
      client.waitForElementVisible("[name=cellPhone]")
    } else {
      client.click('[name=isStudent][value=false]')
    }
    client.setValue('[name=name]', data.name)
      .setValue('[name=cellPhone]', data.cellPhone)
      .click('[name=canText][value=false]')
      .setValue('[name=gradeLevel]', data.gradeLevel);
    client.click('input[type=submit]');

    client.waitForElementVisible('#userMenu')

    client.execute(function() {
        return Meteor.user();
      }, [], function(result) {
        if (result.value.emails[0].address !== data.email) {
          throw new Error("Signup failed");
        }
      }
    );
  };

  // Sign in with given data.
  client.admit.signIn = function(data) {
    client.url(exp.BASE_URL + "/sign-in")
      .waitForElementVisible("[name=at-field-username_and_email]")
      .setValue("[name=at-field-username_and_email]", data.email)
      .setValue("[name=at-field-password]", data.password)
      .click("form#at-pwd-form [type=submit]")

    client.waitForElementVisible('a.user-name')
    client.execute(function() {
      return Meteor.user()
    }, [], function(result) {
      if (result.value.emails[0].address !== data.email) {
        throw new Error("Signup failed");
      }
    });
  };
  
  // Sign out script.
  client.admit.signOut = function() {
    client.waitForElementVisible("#userMenu");
    client.click('#userMenu')
      .waitForElementVisible(".js-logout")
      .click(".js-logout");
    client.waitForElementVisible('a.signIn');
    client.execute(function() {
      return Meteor.user();
    }, [], function(result) {
      if (result.value !== null) {
        throw new Error("Signout failed");
      }
    });
  };

  // Assumes we are on a productBuy page.
  client.admit.checkCoupon = function(code, total, desc) {
    client.setValue("[name=coupon_code]", code)
      .pause(200)
      .assert.containsText(".coupon-desc", desc)
      .assert.containsText(".total td", total);
  }

  // Assumes we are on the "productBuy" page, and we want to check out with whatever
  // condition the checkout form is in.
  client.admit.stripeCheckout = function() {
    client.click(".js-checkout-form [type=submit]").pause(1000)
      .frame("stripe_checkout_app")
      .waitForElementVisible("#email")
      .click("#email").pause(200) // extra seems needed..
      .setValue("#email", "student@example.com")
      .click("#card_number").pause(200).keys("4242").pause(200).keys("4242").pause(200).keys("4242").pause(200).keys("4242")
      .click("#cc-exp").pause(200).keys("11").pause(200).keys("20")
      .click("#cc-csc").pause(200).keys("123")
      .click("#submitButton")
      .frameParent()
      .pause(4000); // Time for stripe to submit
    return client;
  };

  // Util for filling in large forms (such as the application).  Expects a flat
  // array with odd members as element names, and even members as values.
  client.admit.fillOut = function(arr) {
    var sel;
    for (var i = 0; i < arr.length; i += 2) {
      sel = "[name='" + arr[i] + "']";
      client.waitForElementVisible(sel);
      client.click(sel);
      client.setValue(sel, arr[i + 1]);
    }
  };
  client.admit.appStep = function(num) {
    var sel = ".nav-stacked li:nth-child(" + num + ") > a.js-update-and-go";
    client.waitForElementVisible(sel);
    client.click(sel).pause(400);
  };
  client.admit.addMultiple = function(num) {
    var sel = ".js-multiple:nth-of-type(" + (num + 1) + ") .js-add-multiple";
    client.waitForElementVisible(sel);
    client.click(sel).pause(400);
  };
  client.admit.checkMultiplesTable = function(tableNum, rowNum, values) {
    values.forEach(function(val, i) {
      var sel = "fieldset.js-multiple:nth-of-type(" + (tableNum + 1) + ") " +
        "table.js-multiple-results > tbody > " +
          "tr:nth-child(" + (rowNum + 1) + ") > " +
          "td:nth-child(" + (i + 1) + ")";
      client.waitForElementVisible(sel);
      client.assert.containsText(sel, val);
    });
  };
};

//
// Mongo database functions
//

var _cleanFixtureItem = function(item) {
  // NB: Modifies item in place.
  for (var key in item) {
    if (_.isObject(item[key])) {
      _cleanFixtureItem(item[key]);
    }
    if (item[key] && item[key]["$date"]) {
      item[key] = new Date(item[key]["$date"]);
    }
  }
}

exp.db = {
  loadFixtures: function(callback) {
    var MongoClient = mongodb.MongoClient;
    MongoClient.connect(exp.MONGO_URL, function(err, db) {
      if (err) { throw err; }
      var users = db.collection("users");

      // Get a count of all items for our callback handler.
      var count = 0;
      var collname;
      for (var collname in fixtures) {
        count += fixtures[collname].length;
      };
      var total = count;
      var handleUpsert = function(err) {
        count--;
        if (err) { throw err; }
        if (count === 0) {
          db.close();
          callback();
          console.log("done upserting " + total + " documents.");
        }
      }

      for (collname in fixtures) {
        (function(collname) {
          console.log("Loading fixture", collname, "...");
          var collection = db.collection(collname);
          fixtures[collname].forEach(function(item) {
            item = _.clone(item);
            _cleanFixtureItem(item);

            // Would love to upsert here -- but we want to hard-code _id's so we
            // can find an object (thus must include if we don't know if the doc
            // is there), and can't "$set" on an _id.  Instead, do two-step find
            // then insert or update.
            collection.findOne({_id: item._id}, function(err, doc) {
              if (err) { throw err; }
              if (doc) {
                var _id = item._id;
                delete item._id;
                collection.update({_id: _id}, {$set: item}, handleUpsert);
              } else {
                collection.insert(item, null, handleUpsert);
              }
            });
          });
        })(collname);
      }
    });
  },
  // Drop the record identified by 'selector' from the collection identified by
  // 'collectionName'
  drop: function(collectionName, selector, callback) {
    var MongoClient = mongodb.MongoClient;
    MongoClient.connect(exp.MONGO_URL, function(err, db) {
      if (err) { throw err; }
      var collection = db.collection(collectionName);
      console.log("Dropping", collectionName, selector);
      collection.findAndModify(selector, null, null, {remove: true}, function() {
        db.close();
        callback();
      });
    });
  },
  // Drop all the records from the array of:
  //   [['collname', 'selector'], ['collname2' 'selector2'], ...]
  dropAll: function(collsAndSelectors, callback) {
    var count = collsAndSelectors.length;
    if (count === 0) {
      callback();
    }
    collsAndSelectors.forEach(function(collAndSelector) {
      exp.db.drop(collAndSelector[0], collAndSelector[1], function() {
        count--;
        if (count === 0) {
          callback();
        }
      });
    });
  },
  dropCollegeApps: function(email, callback) {
    var MongoClient = mongodb.MongoClient;
    MongoClient.connect(exp.MONGO_URL, function(err, db) {
      if (err) { throw err; }
      var users = db.collection("users");
      var coll = db.collection("collegeapps");
      users.findOne({"emails.address": email}, function(err, user) {
        if (err) { throw err; }
        var ret = function() {
          db.close();
          callback();
        }
        if (!user) {
         ret();
        } else {
          coll.findAndModify({userId: user._id}, null, null, {remove: true}, ret);
        }
      });
    });
  },
  trash: []
};

exp.before = function(done) {
  exp.db.loadFixtures(done);
};
exp.after = function(done) {
  exp.db.dropAll(exp.db.trash, function() {
    exp.db.trash = [];
    done();
  });
};

module.exports = exp;
