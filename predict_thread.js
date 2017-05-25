const spawn = require('child_process').spawn;

const keyString = 'main.cc:251]'; // always present on output rows

process.on('message', function(message) {
  console.log('[child] received message from server: ', message);

  const predict = spawn("../tensorflow/bazel-bin/tensorflow/examples/label_image/label_image", [
    "--graph=../trained_weights/100000_0.001/output_graph.pb",
    "--labels=../trained_weights/100000_0.001/output_labels.txt",
    "--output_layer=final_result",
    "--image=" + message,
    "--input_layer=Mul"
  ]);

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
    process.send(predictions);
  })
});