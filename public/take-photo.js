(function() {

  var width = 320;
  var height = 0;
  var streaming = false;

  var video = null;
  var canvas = null;
  var photo = null;
  var button = null;
  var buttonText = null;
  var clickclick = null;
  var clickclickText = null;
  var container = null;

  var TIMER = 0;

  // var getMedia = null;

  function startup() {

    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    button = document.getElementById('start');
    clickclick = document.getElementById('click-click');
    container = document.getElementById('photo-app');

    // save for later use
    buttonText = button.textContent;
    clickclickText = clickclick.textContent;

    navigator.getMedia = (navigator.getUserMedia || 
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUsermedia);

    navigator.getMedia({video: true, audio: false}, function(stream) {
      var vendorURL = window.URL || window.webkitURL;
      video.src = vendorURL.createObjectURL(stream);
      video.play();
    }, console.error);

    video.addEventListener('canplay', function(ev) {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);

        if (isNaN(height)) {
          console.warn('Problem getting video height. Falling back to 4/3 aspect ratio');
          height = width / (4/3);
        }

        console.log('width/height: %s x %s', width, height);

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

        streaming = true;
      }
    });

    button.addEventListener('click', function(ev) {
      timer(TIMER);
      ev.preventDefault();
    }, false);

    // automode
    var autoInterval = null;
    clickclick.addEventListener('click', function(ev) {
      if (autoInterval) {
        disengage();
      } else {
        var counter = 2000;
        clickclick.textContent = '[ENGAGED]';
        autoInterval = setInterval(function() {
          timer(TIMER);
          if (--counter <= 0) disengage();
        }, 5 * 1000);
      }
    });

    function disengage() {
      clickclick.textContent = clickclickText;
      clearInterval(autoInterval);
    }

    container.style.display = 'block';

    clearPhoto();
  }

  function clearPhoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = '#AAA';
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }

  function takePicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      var dataUrl = canvas.toDataURL('image/png');
      photo.setAttribute('src', dataUrl);
      postPicture(dataUrl.split(',')[1]);
    } else {
      clearPhoto();
    }
  }

  function postPicture(imgData) {
    console.log('post picture');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/images', true);
    // xhr.setRequestHeader('content-type', 'image/png');
    // xhr.setRequestHeader('content-transfer-encoding', 'base64');
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 400) throw Error('Unexpected things have happened (' + xhr.status + ')');
      console.log('images posted successfully');
    }
    xhr.send(imgData);
  }

  function timer(i) {
    if (i === 0) {
      takePicture();
      button.textContent = buttonText;
      button.removeAttribute('disabled');
    } else {
      button.textContent = i;
      setTimeout(function() {timer(i - 1)}, 1000);
      button.setAttribute('disabled', true);
    }
  };

  window.initPhotoApp = startup;

})();
