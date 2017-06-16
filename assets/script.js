
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
  $('#my_camera').bind('click', function(e) {
    take_snapshot();
  })
}

function initDragDrop() {
  const drag_target = $('#my_camera')
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
