
window.uid_counter = 1;
function get_uid(base) {
  window.uid_counter = window.uid_counter + 1;
  return `base_${window.uid_counter}`;
}

function process_data_uri(data_uri) {
  const id = get_uid('image');

  $('#processed_images').prepend($(`<div class="result_wrapper" id="${id}"><img src="${data_uri}"/><div class='loader'/></div>`))

  let formData = new FormData();
  formData.append('image', data_uri);

  Webcam.upload(data_uri, '/predictGenre', function(code, text) {
    results = text.split(',');
    $results = $('<ol class="predictions" />');
    console.log(`results: ${results}`);
    for (result in results) {
      $results.append($('<li>' + results[result] + '</li>'));
    }
    $(`#${id} .loader`).remove();
    $('#'+id).append($results);
  });
}

function take_snapshot() {
  Webcam.snap(process_data_uri);
}

function initWebcam() {
  Webcam.set({
    // live preview size
    width: 342,
    height: 256,

    // device capture size
    dest_width: 342,
    dest_height: 256,

    // final cropped size
    crop_width: 256,
    crop_height: 256,

    // format and quality
    image_format: 'jpeg',
    jpeg_quality: 90
  });

  Webcam.attach( '#my_camera' );
}

function initDragDrop() {
  var drag_target = $('#my_camera')
  .bind( 'dragenter dragover', false)
  .bind( 'drop', function( e ) {
    e.stopPropagation();
    e.preventDefault();


    $.each( e.originalEvent.dataTransfer.files, function(index, file){
      var fileReader = new FileReader();
      fileReader.onload = (function(file) {
       return function(e) {
        process_data_uri(e.target.result);
       };
     })(file);
     fileReader.readAsDataURL(file);
   });
  });
}

function init() {
  initWebcam();
  initDragDrop();
}

/*
function guessGenre() {
  const request = new XMLHttpRequest();
  request.open('GET', '/guessGenre', true);

  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      document.getElementById('proposedGenre').style.display = "inline-block";
      document.getElementById('guessGenre').style.display = "none";
      document.getElementById('answer').innerHTML = this.response;
    }
  };
  request.send();
};

function onDownload() {
  // declare variables for DOM elements
  const imageUrl = document.getElementById('urlInput').value;
  const coverImageDiv = document.getElementById('albumCoverDiv');
  const uploadWrapper = document.getElementById('uploadWrapper');
  const guessGenreBtn = document.getElementById('guessGenre');

  // If an imageURl is provided, try to download to /image folder. If successful, set image on webpage.
  if (imageUrl.length > 0) {
    const request = new XMLHttpRequest();
    const encodedUrl = '/download?url=' + encodeURIComponent(imageUrl) + '&fileName=' + imageUrl.split('/').pop();

    request.open('POST', encodedUrl, true);
    request.onload = function(){
      if (this.status >= 200 && this.status < 400) {
        // Hide upload utils and show image that has been downloaded
        uploadWrapper.style.display = "none";
        coverImageDiv.style.display = "inline-block"
        coverImageDiv.src = imageUrl;
        coverImageDiv.name = imageUrl.split('/').pop();

        // Once image has uploaded, display "guess genre" button:
        guessGenreBtn.style.display = "inline-block";
      }
    }
    request.send();
  } else {
    console.log('No url given');
  }
}
*/