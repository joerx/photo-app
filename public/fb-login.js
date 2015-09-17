(function() {
  
  // loadsdk  
  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  var fbLoginButton;
  var fbLoginStatus;
  var fbUser;

  function init() {
    fbLoginButton = document.getElementById('fb-login-button');
    fbLoginStatus = document.getElementById('fb-login-status');

    fbLoginButton.removeAttribute('disabled');

    fbLoginButton.addEventListener('click', function(e) {
      e.preventDefault();
      FB.login(loginStatusHandler, {scope: 'email'});
    });
  }

  function requestLogin() {
    fbLoginStatus.textContent = 'Please connect with Facebook';
    fbLoginButton.style.display = 'block';
  }

  function userIsLoggedIn() {
    fbLoginButton.style.display = 'none';
    fbStatus('Fetching info ...');
    FB.api('/me', function(response) {
      // console.log(response);
      fbStatus('Welcome ' + response.name + '!');
      fbUser = response;
      var evt = new CustomEvent('fb-login', {detail: fbUser});
      document.dispatchEvent(evt);
    });
  }

  function fbStatus(msg) {
    fbLoginStatus.textContent = msg;
  }

  function loginStatusHandler(response) {
    console.log('login status is "%s"', response.status);
    switch(response.status) {
      case 'connected':
        userIsLoggedIn();
      break;
      case 'not_authorized':
      default:
        requestLogin();
    }
  }

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '985117698207187',
      xfbml      : true,
      version    : 'v2.4'
    });
    init();
    FB.getLoginStatus(loginStatusHandler);
  };

  window.onFacebookLogin = function(fn) {
    document.addEventListener('fb-login', function(evt) {
      fn(evt.detail);
    });
    if (fbUser) fn(fbUser);
  }

})();
