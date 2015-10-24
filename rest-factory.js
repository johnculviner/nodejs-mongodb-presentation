module.exports = function (model) {
  return {
    put: (req, res) => {
      model.findById(req.body._id)
        .then(page => {
          if(!page) {
            page = new model();
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
    },
    getOne: (req, res) => {
      model.findById(req.params.id)
        .then(page => res.json(page));
    },
    'delete': (req, res) => {
      model.findByIdAndRemove(req.params.id)
        .then(() => res.status(204).end());
    },
    getAll: (req, res) => {
      model.find()
        .stream({transform: obj => JSON.stringify(obj) + ',\n'})
        .pipe(res);
    }
  };
};

