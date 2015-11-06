Posts.addField({
  fieldName: 'imageUrl',
  fieldSchema: {
    type: String,
    optional: true,
    max: 100,
    editableBy: ["admin"]
  }
});

Posts.addField({
  fieldName: 'imageLicense',
  fieldSchema: {
    type: String,
    optional: true,
    max: 300,
    editableBy: ["admin"]
  }
});