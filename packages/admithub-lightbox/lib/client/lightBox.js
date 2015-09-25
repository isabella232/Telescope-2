Meteor.startup(function(){
  Meteor.setTimeout(function(){
      if ( checkShowSettings() ) { Session.set('lightBoxPageViewSetting', true) }
  }, 1000 );
});

Telescope.modules.add("top", {
template: "newsletter_alt",
order: 0
});

var checkShowSettings = function () {
  if (
    !Users.can.view(Meteor.user())
    // ||  Cookie.get('showBanner') === "no"        
    ||  (Meteor.user() && Meteor.user().getSetting('newsletter.showBanner', true) === false)
    ||  (Meteor.user() && Meteor.user().getSetting('newsletter.subscribeToNewsletter', false) === true)
    ) {
      return false
    } else {
      return true
    }
  }

Template.layout.events({
  'click a': function (e) {
    var viewCount = Session.get('lightBoxPageViewCount') ? Session.get('lightBoxPageViewCount') + 1 : 1 ;
    if (viewCount > 1 ) { Session.set('lightBoxPageViewSetting', checkShowSettings() ) }
  }
});

var confirmSubscription = function () {
$('.newsletter-banner form').css('opacity', 0);
$('.newsletter-banner .newsletter-subscribed').css('display', 'block').css('opacity', 1);
Meteor.setInterval(function () {
    // required because otherwise banner disappears immediately after confirmation
    dismissBanner();
  }, 2000);
};

var dismissBanner = function () {
$('.newsletter-banner').fadeOut('fast', function () {
  if(Meteor.user()){
    // if user is connected, change setting in their account
    Users.setSetting(Meteor.user(), 'newsletter.showBanner', false);
  }else{
    // set cookie
    Cookie.set('showBanner', "no");
  }
});
};

Template.newsletter_alt.helpers({
  isNotConnected: function () {
    return !Meteor.user();
  },
  showBanner: function () {
    return Session.get('lightBoxPageViewSetting');
  }
});

Template.newsletter_alt.events({
  'click .newsletter-button': function (e) {
    e.preventDefault();
    var $banner = $('.newsletter-banner');
    if(Meteor.user()){
      $banner.addClass('show-loader');
      Meteor.call('addCurrentUserToMailChimpList', function (error, result) {
        $banner.removeClass('show-loader');
        if(error){
          console.log(error);
          Messages.flash(error.message, "error");
        }else{
          console.log(result);
          confirmSubscription();
        }
      });
    }else{
      var email = $('.newsletter-email').val();
      if(!email){
        alert('Please fill in your email.');
        return;
      }
      $banner.addClass('show-loader');
      Meteor.call('addEmailToMailChimpList', email, function (error, result) {
        $banner.removeClass('show-loader');
        if(error){
          console.log(error);
          Messages.flash(error.reason, "error");
        }else{
          Messages.clearSeen();
          console.log(result);
          confirmSubscription();
        }
      });
    }
    // $('body').addClass('showing-lightbox');
    // $(e.target).parents('.post').find('.post-video-lightbox').fadeIn('fast');
  },
  'click .newsletter-dismiss': function (e) {
    $('.newsletter-banner').fadeOut('fast');
    Session.set('lightBoxPageViewSetting', false);
    dismissBanner();
    e.preventDefault();
  }
});


