const express = require("express");
const spawn   = require('child_process').spawn;
const app = express();
const path = require("path");
const http = require('http');
const fs = require('fs');


// Serve template and static assets
app.use(express.static(__dirname + '/script.js'));

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/assets/*', function(req, res) {
  res.sendFile(path.join(__dirname + req.url));
})

// Guess Genre
app.get('/guessGenre', function(req, res) {

  // Replace all this with the python script
  const echo = spawn('echo', ["lol who knowsss"]);

  echo.stdout.on('data', (data) => {
    res.send(`${data}`);
  })
})

// Downloads the image at a given url to the /image folder, sets filename based on final URL param
app.post('/download', function(req, res){
  const url = req.query.url;
  const fileName = req.query.fileName;

  const file = fs.createWriteStream('images/' + fileName);
  const request = http.get(url, function(response) {
    response.pipe(file);
  })

  file.on('finish', function(){
    // Report a successful download
    res.writeHead(200);
    res.end();
  })
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000')
})