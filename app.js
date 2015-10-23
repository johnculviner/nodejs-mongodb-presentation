var Promise = require('bluebird');
var app = Promise.promisifyAll(require('express')());
var childProcess = Promise.promisifyAll(require('child_process'));
var fs = Promise.promisifyAll(require('fs'));

app.get('/ping', (req, res) => {

  Promise.join(
    fs.readFileAsync(__filename),
    childProcess.execAsync('top -stats command,cpu -l 1')
  )
    .spread((file, stdout) => {
      res.json({
        currentFile: file.toString().split('\n'),
        topProcesses: stdout[0].split('\n')
      });
    });
});

app.listenAsync(3000)
  .then(() => console.log('server up!'));

