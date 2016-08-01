var express = require('express');
var dbModel = require('../db/user');

var router = express.Router();

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  if ('id' in req.params) {
    dbModel.getUser(req.params.id, function(err, result) {
      if (!err) {
        if (result.length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(result));
        } else {
          res.status(500).send('Cannot find User with ID=' + req.params.id);
        }
      } else {
        res.status(500).send('Error:' + err.code);
      }
    });
  } else {
    res.status(404).send('Missing ID');
  }
});

router.post('/add', function(req, res, next) {
  var body = req.body;

  if (!body.name || !body.password || !body.email) {
    res.status(500).send('Missing Required Parameters');
  }

  dbModel.addUser(body.name, body.email, body.password, function(err, id) {
    if (!err) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({'id': id}));
    } else {
      res.status(500).send('Error:' + err.code);
    }
  });
});

router.delete('/delete/:id', function(req, res, next) {
  if ('id' in req.params) {
    dbModel.deleteUser(req.params.id, function(err, rowsAffected) {
      if (!err && rowsAffected == 1) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({'id': req.params.id}));
      } else {
        if (err) {
          res.status(500).send('Error:' + err.code);
        } else {
          res.status(500).send('Cannot find User with ID=' + req.params.id);
        }
      }
    });
  } else {
    res.status(404).send('Missing ID');
  }
});

router.put('/update/:id', function(req, res, next) {
  if ('id' in req.params) {
    console.log(req.params.id);
    res.send('respond with a resource');
  } else {
    res.status(404).send('Missing ID');
  }
});

module.exports = router;
