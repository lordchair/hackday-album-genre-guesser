
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

window.onload = function(){

}