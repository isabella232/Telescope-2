var common = require("../nightwatch_globals");
var _ = require("underscore");

function wizard(client, namesAndVals) {
  for (var i = 0; i < namesAndVals.length; i+=2) {
    var name = namesAndVals[i];
    var val = namesAndVals[i+1];
    var selector = "[name='" + name + "']"
    client.waitForElementVisible(selector);
    if (val === true) {
      client.click(selector);
    } else if (val !== false) {
      client.setValue(selector, val);
    }
    client.click(".js-nav-next");
  }
}
function wizardMultiple(client, headings, entries) {
  _.each(entries, function(entry) {
    _.each(_.zip(headings, entry), function(kv) {
        var selector = "[name='" + kv[0] + "']"
        client.waitForElementVisible(selector);
        client.setValue(selector, kv[1]);
        client.click("body"); // hack to clear pikaday
    });
    client.click(".js-add-multiple");
    client.execute(function() { window.scrollTo(100000000000, 0); }); // scroll to bottom.
  });
  client.click(".js-nav-next");
}
function wizardMultipleBooleans(client, namesLists) {
  _.each(namesLists, function(namelist) {
    _.each(namelist, function(name) {
      var selector = "[data-schema-key='" + name + "']"
      client.waitForElementVisible(selector);
      client.click(selector);
    });
    client.click(".js-nav-next");
  });
}

module.exports = {
  beforeEach: common.prepClient,
  "Complete free trial bot": function(client) {
    common.db.drop("freetrialbots", {userId: "FiS9gTPMke8JbJZfN"}, function() {
      client.admit.signIn({email: "student@example.com", password: "password"})
      client.url(common.BASE_URL + "/survey")
      client.waitForElementVisible("[name=name]");
      wizard(client, [
        "name", "Jane Student",
        "email", "student@example.com",
        "gender", "Other",
        "expectedGraduationYear", "2011",
        "parent1Name", "Mommy Jane",
        "parent1Email", "mom@example.com",
        "parent1Phone", "",
        "parent1CollegeName", "COLLLEGE!!!",
        "parent2Name", "Daddy Jane",
        "parent2Email", "dad@example.com",
        "parent2Phone", "2343212343",
        "parent2CollegeName", "University of Phoenix",
        "homeCityAndState", "Deep Springs, CA",
        "race", "American Indian or Native Alaskan",
        "oneQuestion", "What time is love?",
        "oneQuestionPostToForum", true,
        "highSchoolName", "The High School",
        "highSchoolType", "Independent",
        "highSchoolCityState", "Salt Lake City, UT",
        "currentCourseTypes", "Regular",
        "gpa", "3.2",
        "gpaWeighting", "Weighted",
        "classRank", "11",
        "classRankType", "Percentile",
      ]);
      wizardMultiple(client,
        ["sat_tests.0.test_date", "sat_tests.0.math", "sat_tests.0.reading",
          "sat_tests.0.writing", "sat_tests.0.essay"],
        [["2015-02-21", "300", "400", "500", "2"],
         ["2015-02-22", "301", "401", "501", "3"]]);
      wizardMultiple(client,
        ["act_tests.0.test_date", "act_tests.0.english", "act_tests.0.math",
         "act_tests.0.reading", "act_tests.0.science", "act_tests.0.essay",
         "act_tests.0.composite"],
        [["2015-02-23", "20", "21", "22", "23", "1", "24"],
         ["2015-02-24", "21", "22", "23", "24", "2", "25"]])
      wizardMultiple(client,
        ["other_tests.0.test_date", "other_tests.0.name_of_test", "other_tests.0.score"],
        [["2015-02-25", "International Bachelorette", "5"],
         ["2015-02-26", "SAT 47", "234"]])
      wizardMultipleBooleans(client, [
        ["favoriteSubject.science", "favoriteSubject.english", "favoriteSubject.other"],
        ["bestSubject.science", "bestSubject.historySocialStudies"],
        ["otherActivities.art", "otherActivities.theater", "otherActivities.job"]
      ])
      wizard(client, [
        "athleticRecruiting", true,
        "friendsAdjectives", "You know, a person",
        "dreamCollege", "Deep Springs",
        "dreamCollegeReasons", "Alfalfa",
        "financialAidIntent", true,
        "studyIntent", true,
      ])
      wizardMultipleBooleans(client, [
        ["schoolInterests.ethnicallyDiverse", "schoolInterests.researchUniversity"],
        ["weather.flipFlops", "weather.frozenTundra"],
        ["size.small", "size.large"],
        ["city.medium", "city.sticks"],
      ]);
      wizard(client, [
        "closeToHome", "No",
        "plannedCollege1", "Reed",
        "plannedCollege2", "Deep Springs",
        "plannedCollege3", "Williams",
        "evaluation", "meh",
        "evaluationRecommend", "All the Persons",
      ]);
      client.end();
    });
  }
};
