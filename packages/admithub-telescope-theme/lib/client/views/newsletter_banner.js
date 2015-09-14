Template.newsletter_banner.events({
  "click .js-newsletter-button": function(e) {
    e.preventDefault();
    var $banner = $(".js-newsletter-banner-wrap");

    var email = $banner.find(".js-newsletter-email").val();
    if (!email) {
      alert("Pelase fill in your email.");
      return
    }
    $banner.addClass("show-loader");
    Meteor.call("addEmailToMailChimpList", email, function(err, result) {
      $banner.removeClass("show-loader");
      if (err) {
        console.log(err);
        Messages.flash(err.message, "error");
      } else {
        $banner.fadeOut("fast", function() {
          if (Meteor.user()) {
            setUserSetting('showBanner', false);
          } else {
            Cookie.set('showBanner', 'no');
          }
        });
        Messages.flash("Thank you, request received!", "success");
      }
    });
  }
});
