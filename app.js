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
    .then(page => res.json(page._doc))
    .catch(err => {
      if (err.name == 'ValidationError') {
        res.json(err.errors);
      } else {
        res.json({message: 'An error has occurred'});
      }
    });
});

app.get('/pages/:id', (req, res) => {
  Page.findById(req.params.id)
    .then(page => res.json(page));
});

app.delete('/pages/:id', (req, res) => {
  Page.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end());
});

app.get('/pages', (req,res) => {
  Page.find()
    .stream({transform: obj => JSON.stringify(obj) + ',\n'})
    .pipe(res);
});


db.connect()
  .then(() => app.listenAsync(3000))
  .then(() => console.log('server up!'));



