if (Meteor.isClient) {
  
  Meteor.startup(function(){
    Meteor.setTimeout(function(){
      Session.get('lightBoxPageViewSetting') === undefined  ? Session.set('lightBoxPageViewSetting', checkShowSettings() ) : null ;
    }, 1*1000 );
  });

  Template.newsletter_alt.onCreated(function() {
    this.thankYouForSubmission = new ReactiveVar(false);
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
    },
    thankYouForSubmission: function () {
      return Template.instance().thankYouForSubmission.get();
    }
  });

  Template.newsletter_alt.events({
    'click .newsletter-button': function (e, t) {
      e.preventDefault();
      var $banner = $('.newsletter-banner'); 
      var email = $('.newsletter-email').val();
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!email || !re.test(email)){
        alert('Please fill in your email.');
        return;
      }
      t.thankYouForSubmission.set(true);
      Meteor.setTimeout(function(){

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
      },2000);
    },

    'click .newsletter-dismiss': function (e) {
      e.preventDefault();
      Session.set('lightBoxPageViewSetting', false);
      dismissBanner();
    }
  });
}

