Comments.addField({
  fieldName: 'body',
  fieldSchema: {
   type: String,
    max: 10000,
    editableBy: ["member", "admin"],
    autoform: {
      rows: 5,
      afFormGroup: {
        'formgroup-class': 'hide-label'
      }
    }
  }
});

