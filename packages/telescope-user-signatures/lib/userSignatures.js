// Add signature bits to the (currently unused) user schema.
Users.addField({
  fieldName: "profile.signature",
  fieldSchema: {
    label: "Signature",
    type: String,
    optional: true,
    public: true,
    editableBy: ["member", "admin"],
  }
});
Users.addField({
  fieldName: "profile.signatureHTML",
  fieldSchema: {
    label: "Signature",
    type: String,
    optional: true,
    public: true,
    profile: true,
    template: "user_signature_html",
    autoform: {omit: true}
  }
});

Users.before.update(function(userId, doc, fieldNames, modifier) {
  if (Meteor.isServer) {
    if (modifier.$unset && modifier.$unset["profile.signature"]) {
      modifier.$unset["profile.signatureHTML"] = "";
    }
    if (modifier.$set && modifier.$set["profile.signature"]) {
      var html = Telescope.utils.sanitize(marked(modifier.$set["profile.signature"]));
      modifier.$set["profile.signatureHTML"] = html;
    }
  }
});
if (Meteor.isServer) {
  // Expose signature and its sanitized/rendered HTML version.
  Users.pubsub.publicProperties['profile.signature'] = true;
  Users.pubsub.publicProperties['profile.signatureHTML'] = true;
}
