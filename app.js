var app = require('express')();
var childProcess = require('child_process');
var fs = require('fs');

app.get('/ping', (req, res) => {
  fs.readFile(__filename, (err, file) => {
    childProcess.exec('top -stats command,cpu -l 1', (error, stdout) => {
      res.json({
        currentFile: file.toString().split('\n'),
        topProcesses: stdout.split('\n')
      });
    });
  });
});

app.listen(3000, () => console.log('server up!'));

