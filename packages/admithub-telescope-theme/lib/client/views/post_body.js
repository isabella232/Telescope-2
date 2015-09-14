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
  }
});
