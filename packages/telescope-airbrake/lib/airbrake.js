addToSettingsSchema.push({
  propertyName: "airbrakeApiKey",
  propertySchema: {
    type: String,
    optional: true,
    autoform: {
      group: "airbrake",
      instructions: "Airbrake API Key. Requires restart."
    }
  }
});

addToSettingsSchema.push({
  propertyName: "airbrakeProjectId",
  propertySchema: {
    type: String,
    optional: true,
    autoform: {
      group: "airbrake",
      instructions: "Airbrake Project ID. Requires restart."
    }
  }
});
addToSettingsSchema.push({
  propertyName: "airbrakeEnvironmentName",
  propertySchema: {
    type: String,
    optional: true,
    autoform: {
      group: "airbrake",
      instructions: "Environment name (e.g. development, production) for airbrake"
    }
  }
});

Meteor.startup(function() {
  var airbrake;
  var airbrakeApiKey = getSetting("airbrakeApiKey");
  var airbrakeProjectId = getSetting("airbrakeProjectId");
  var airbrakeEnvName = getSetting("airbrakeEnvironmentName");
  if (airbrakeApiKey && airbrakeProjectId) {
    if (Meteor.isServer) {
      airbrake = Npm.require("airbrake").createClient({
        airbrakeApiKey: airbrakeApiKey,
        airbrakeProjectId: airbrakeProjectId
      });
      airbrake.handleExceptions();
    }

    if (Meteor.isClient && typeof Airbrake !== "undefined") {
      Airbrake.onload = function(client) {
        client.setProject(airbrakeProjectId, airbrakeApiKey);
        if (airbrakeEnvName) { 
          client.setEnvironmentName(airbrakeEnvName);
        }
      }
      window.onerror = function(message, file, line) {
        Airbrake.push({error: {message: message, fileName: file, lineNumber: line}});
      }

      // This doesn't seem to work.... can't export/override console from
      // within meteor package?
      if (typeof console === "undefined") {
        window.console = {log: function(){}, error: function(){}};
      }
      if (!console.airbrakeShimmed) {
        var origLog = console.log;
        var origErr = console.error;
        var maybeLogError = function(err) {
          if (err && err instanceof Error) {
            Airbrake.push({error: err});
          }
        };
        console.log = function() {
          maybeLogError(arguments[0]);
          origLog.apply(this, arguments);
        }
        console.error = function() {
          maybeLogError(arguments[0]);
          origErr.apply(this, arguments);
        }
        console.airbrakeShimmed = true;
      }
    }
  }
});
