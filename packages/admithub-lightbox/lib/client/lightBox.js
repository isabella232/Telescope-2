
Meteor.startup(function(){
  Meteor.setTimeout(function(){
      if (Session.get('lightBoxPageViewSetting') === undefined ) {
        Session.set('lightBoxPageViewSetting', checkShowSettings());
      }
  }, 60*1000 );
});

Telescope.modules.add("top", {
template: "newsletter_alt",
order: 0
});

var addMask = function() {
 $('body').addClass('pg-mask');
}

var removeMask = function() {
  $('body').removeClass('pg-mask');
}

var checkShowSettings = function () {
  if (
    !Users.can.view(Meteor.user())
    ||  Session.get('lightBoxPageViewSetting') === false
    ||  Cookie.get('showCustomBanner') === "no"        
    ||  (Meteor.user() && Meteor.user().getSetting('profile.dontShowCustomEmailBanner', true) === true)
    ) {
      removeMask();
      return false
    } else {
      addMask();
      return true
    }
  }

Template.layout.events({
  'click a': function (e) {
    Session.get('lightBoxPageViewCount') === undefined ? Session.set('lightBoxPageViewCount', 1 ) : Session.set('lightBoxPageViewCount', (Session.get('lightBoxPageViewCount') + 1 )) ;
    if (Session.get('lightBoxPageViewCount') === 4 ) { Session.set('lightBoxPageViewSetting', checkShowSettings() ) }
  }
});

var updateDontShowCustomEmailBannerField = function() {
   Meteor.call('dontShowCustomEmailBanner', function (error, result) {
      if(error) {
        console.log(error.reason);
      } else {
        console.log(result)
      }
    });
}

var dismissBanner = function () {
  var checked = $('#dont-ask-me-again-check').is(':checked');
  removeMask();
  Session.set('lightBoxPageViewSetting', false);
  if (Meteor.user() && checked ) {
    updateDontShowCustomEmailBannerField();
    Cookie.set('showCustomBanner', "no");
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
        dismissBanner();
      }
    });
    if (Meteor.user()) {
      updateDontShowCustomEmailBannerField();
    }
  },
  'click .newsletter-dismiss': function (e) {
    e.preventDefault();
    Session.set('lightBoxPageViewSetting', false);
    dismissBanner();
  }
});


