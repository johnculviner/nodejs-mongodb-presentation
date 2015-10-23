var Promise = require('bluebird');
var app = Promise.promisifyAll(require('express')());
var childProcess = Promise.promisifyAll(require('child_process'));
var fs = Promise.promisifyAll(require('fs'));
var db = require('./db');
var Page = require('./Page');

app.use(require('body-parser').json());

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

app.put('/pages', (req, res) => {

  Page.findById(req.body._id)
    .then(page => {
      if(!page) {
        page = new Page();
      }

      Object.assign(page, req.body);

      return page.save();
    })
    .then(page => res.json(page._doc));
});

db.connect()
  .then(() => app.listenAsync(3000))
  .then(() => console.log('server up!'));



