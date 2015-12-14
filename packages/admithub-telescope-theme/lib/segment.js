var segmentWriteKey = "";
if (segmentWriteKey) {
  analytics.load(segmentWriteKey);
} else {
  ["track", "page", "identify"].forEach(function(key) {
    analytics[key] = function(){};
  });
}

Segment = {
  identifyUser: function(user) {

    function getTraits(user) {
      return {
        name: dotGet(user, 'profile.name'),
        email: dotGet(user, 'emails.0.address'),
        phone: dotGet(user, 'profile.phone'),
        username: dotGet(user, 'username'),
        createdAt: dotGet(user, 'createdAt'),
        highschool_expectedGraduationYear: dotGet(collegeProfile, 'highschool.expectedGraduationYear'),
        dreamCollege: dotGet(collegeProfile, 'preferences.dreamCollege.name'),
        SAT: dotGet(collegeProfile, 'tests.sat.composite'),
        ACT: dotGet(collegeProfile, 'tests.act.composite'),
        zip: dotGet(collegeProfile, 'location.zip'),
        finishedSurvey: dotGet(collegeProfile, 'meta.initialSurvey.finished'),
        utm_medium: dotGet(collegeProfile, 'meta.initialSurvey.utm_medium')
      };
    }

    var collegeProfile = CollegeProfiles.findOne({
      userId: user._id
    });

    if (Meteor.isServer) {
      analytics.identify({
        userId: user._id,
        traits: getTraits(user)
      });
    }
    else {
      analytics.identify(user._id, getTraits(user));
    }
  }
}

// Identify user on login
if (Meteor.isClient) {
  Meteor.startup(function() {
    Tracker.autorun(function(c) {
      // waiting for user subscription to load
      if (! Router.current() || ! Router.current().ready())
        return;

      var user = Meteor.user();
      if (! user)
        return;

      Segment.identifyUser(user);

      c.stop();
    });
  });
}
