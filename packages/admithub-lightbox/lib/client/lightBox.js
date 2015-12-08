if (Meteor.isClient) {
  
  Meteor.startup(function(){
    Meteor.setTimeout(function(){
      Session.get('lightBoxPageViewSetting') === undefined  ? Session.set('lightBoxPageViewSetting', checkShowSettings() ) : null ;
    }, 60*1000 );
  });

  Telescope.modules.add("top", {
    template: "newsletter_alt",
    order: 0
  });

  var checkShowSettings = function () {
    if (
      Session.get('lightBoxPageViewSetting') === false
      ||  Cookie.get('showCustomBanner') === "no"        
      ||  ( Meteor.user() && Meteor.user().getSetting('profile.dontShowCustomEmailBanner', true) )
      ) {
        return false
      } else {
        return true
      }
    }

  Template.layout.events({
    'click a': function (e) {
      console.log( Session.get('lightBoxPageViewCount') );
      Session.get('lightBoxPageViewCount') === undefined ? Session.set('lightBoxPageViewCount', 1 ) : Session.set('lightBoxPageViewCount', (Session.get('lightBoxPageViewCount') + 1 )) ;
      Session.get('lightBoxPageViewCount') === 4  ? Session.set('lightBoxPageViewSetting', checkShowSettings() ) : null ;
    }
  });

  var dismissBanner = function () {
    var checked = $('#dont-ask-me-again-check').is(':checked');
    Session.set('lightBoxPageViewSetting', false);
    if ( checked ) {
      Cookie.set('showCustomBanner', "no");
    }
  };

  Template.newsletter_alt.helpers({
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
          dismissBanner();
        }
      });
    },

    'click .newsletter-dismiss': function (e) {
      e.preventDefault();
      Session.set('lightBoxPageViewSetting', false);
      dismissBanner();
    }
  });
}

