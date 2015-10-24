var Promise = require('bluebird');
var app = Promise.promisifyAll(require('express')());
var childProcess = Promise.promisifyAll(require('child_process'));
var fs = Promise.promisifyAll(require('fs'));
var db = require('./db');
var restFactory = require('./rest-factory');


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

var pages = restFactory(require('./Page'));
app.put('/pages', pages.put);
app.get('/pages/:id', pages.getOne);
app.get('/pages', pages.getAll);
app.delete('/pages/:id', needAuth, pages.delete);

function needAuth(req, res, next) {
  if (!req.query.password) {
    res.status(401).end();
    return;
  }
  next();
}

module.exports.start = (dbName) => {
  return db.connect(dbName)
    .then(() => app.listenAsync(3000))
    .then(() => console.log('server up!'));
};





