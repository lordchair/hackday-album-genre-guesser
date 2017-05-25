const express = require("express");
const multer = require("multer");
const fork   = require('child_process').fork;
const path = require("path");

const fs = require('fs');
const http = require('http');
const sharp = require('sharp');


const app = express();
app.use(express.static(__dirname + '/script.js')); // Serve template and static assets
const upload = multer({ dest: 'images/' }); // allow multi part form upload of images


app.get('/',function(req,res){
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/assets/*', function(req, res) {
  res.sendFile(path.join(__dirname + req.url));
});

app.post('/predictGenre', upload.single('webcam'), function(req, res, next) {
  // console.log(`file received: ${req.file}`);

  const child = fork('./predict_thread');
  child.send(req.file.path);

  child.on('message', function(message) {
    console.log('[parent] received message from child: ', message)
    res.send(`${message}`);
  })
});

/*
// Guess Genre
app.get('/guessGenre', function(req, res) {

  // Replace all this with the python script
  const echo = spawn('echo', ["lol who knowsss"]);

  echo.stdout.on('data', (data) => {
    res.send(`${data}`);
  })
});

// Downloads the image at a given url to the /image folder, sets filename based on final URL param
app.post('/download', function(req, res){
  const url = req.query.url;
  const fileName = req.query.fileName;

  const writeStream = fs.createWriteStream('images/' + fileName);

  const request = http.get(url, function(response) {
    response.pipe(writeStream);
  })

  writeStream.on('finish', function(){
    // Report a successful download
    res.writeHead(200);
    res.end();
  })
});
*/

app.listen(3000, function () {
  console.log('Genre-ify listening on port 3000')
})