// Add signature bits to the (currently unused) user schema.
addToUserSchema.push({propertyName: "profile.signature", propertySchema: {type: String}});
addToUserSchema.push({propertyName: "profile.signatureHTML", propertySchema: {type: String}});

// Add the user signature bits to what is displayed on the user profile.
userProfileDisplay.push({template: "userSignatureProfile", order: 1});
// Add the signature bits to what is displayed when editing the user profile.
userProfileEdit.push({template: "editUserSignature", order: 1});
// Process changes to the signature.
userEditClientCallbacks.push(function(user, properties) {
  var sig = $.trim($("[name=signature]").val());
  if (user.profile.signature !== sig) {
    Meteor.call("updateUserSignature", user._id, sig, function(err) {
      if (err) {
        flashMessage("Error updating signature", "error");
      }
    });
  }
  return properties;
});

if (Meteor.isServer) {
  Meteor.startup(function() {
    Meteor.methods({
      "updateUserSignature": function(userId, sig) {
        if (userId !== Meteor.userId() && !isAdmin(Meteor.user())) {
          throw new Meteor.Error(400, "Permission denied")
        }
        var html = sanitize(marked(sig));
        console.log(userId, sig, html);
        Meteor.users.update(userId, {$set: {
          "profile.signature": sig,
          "profile.signatureHTML": html
        }});
      }
    });

    // Expose signature and its sanitized/rendered HTML version.
    privacyOptions["profile.signature"] = true;
    privacyOptions["profile.signatureHTML"] = true;
  });
}
