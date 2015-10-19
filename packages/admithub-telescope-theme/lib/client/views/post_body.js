//custom_post_body helpers causing errors, thus we have imageLicenseInfo

Template.ah_post_teaser.helpers({
  postBodyTeaser: function() {
    var html = "";
    if (this.htmlBody) {
      if (this.htmlBody.length < 400) {
        html = this.htmlBody;
      } else {
        html = $.trim($(this.htmlBody).text()).slice(0, 397) + "...";
      }
    }
    return html;
  },

  getThumbnail: function() {
    return dotGet(this, 'imageUrl');
  }
});

Template.imageLicenseInfo.helpers({
  convertToHtml: function(imageLicense) {
    $('.insert-links').html(imageLicense);
    return null;
  } 
});


