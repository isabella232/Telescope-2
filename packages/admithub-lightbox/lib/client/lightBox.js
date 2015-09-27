
Meteor.startup(function(){
  Meteor.setTimeout(function(){
      if ( checkShowSettings() ) { 
        Session.set('lightBoxPageViewSetting', true);
        toggleMask(); 
      }
  }, 1000 );
});

Telescope.modules.add("top", {
template: "newsletter_alt",
order: 0
});

var toggleMask = function() {
 $('body').toggleClass('pg-mask');
}

var checkShowSettings = function () {
  if (
    !Users.can.view(Meteor.user())
    || Session.get('lightBoxPageViewSetting') === false
    ||  Cookie.get('showCustomBanner') === "no"        
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
    dismissBanner();
};

var dismissBanner = function () {
  toggleMask();
  Session.set('lightBoxPageViewSetting', false);
  Cookie.set('showCustomBanner', "no");
  if(Meteor.user()){
    console.log('if')
    // if user is connected, change setting in their account
    Users.setSetting(Meteor.user(), 'newsletter.showBanner', false);
  }
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
  
  },
  'click .newsletter-dismiss': function (e) {
    Session.set('lightBoxPageViewSetting', false);
    dismissBanner();
    e.preventDefault();
  }
});


