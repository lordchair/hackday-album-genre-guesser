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

app.listen(3000, function () {
  console.log('Genre-ify listening on port 3000')
})