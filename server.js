const express = require("express");
const multer = require("multer");
const spawn   = require('child_process').spawn;
const fork   = require('child_process').fork;
const path = require("path");
const http = require('http');
const fs = require('fs');
const sharp = require('sharp');


const app = express();
// Serve template and static assets
app.use(express.static(__dirname + '/script.js'));
// allow multi part form upload of images
const upload = multer({ dest: 'images/' });


app.get('/',function(req,res){
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/assets/*', function(req, res) {
  res.sendFile(path.join(__dirname + req.url));
});

app.post('/predictGenre', upload.single('webcam'), function(req, res, next) {
  console.log(`file received: ${req.file}`);
  const predict = spawn("../tensorflow/bazel-bin/tensorflow/examples/label_image/label_image", [
    "--graph=../trained_weights/100000_0.001/output_graph.pb",
    "--labels=../trained_weights/100000_0.001/output_labels.txt",
    "--output_layer=final_result",
    "--image=" + req.file.path,
    "--input_layer=Mul"
  ]);

  var keyString = 'main.cc:251]'; // always present on output rows

  total_data = '';
  function processData(data) { total_data = total_data + '\n' + data }

  predict.stderr.on('data', processData); // predictions in stderr for some reason
  predict.stdout.on('data', processData);

  predict.on('exit', (code) => {
    // pull all prediction rows out of script output
    predictions = [];
    total_data.split('\n').forEach(datum => {
      locator = datum.indexOf(keyString)
      if (locator > 0) {
        predictions.push(datum.slice(locator+keyString.length).trim().replace(/ \([^\)]+\)/g, ''));
      }
    });

    console.log(`Child exited with code ${code}
      predictions: ${predictions}`);

    // respond with predicitons
    res.send(`${predictions}`);
  });

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