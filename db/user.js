var db = require('../db/db');
var bcrypt = require('bcrypt');

const saltRounds = 10;

exports.getUser = function(id, done) {
  var connection = db.get();
  connection.query('SELECT id,name,email,created_at,updated_at FROM users where id = ?', id,
    function(err, result) {
      console.log(result);
      if (err) {
        return done(err);
      }
      done(null, result);
    });
};

exports.addUser = function(name, email, password, done) {
  var connection = db.get();
  connection.query('INSERT INTO users (name,email) VALUES(?, ?)',
    [connection.escape(name), connection.escape(email)],
    function(err, result) {
      if (err) {
        return done(err);
      }

      var salt = bcrypt.genSaltSync(saltRounds);
      var hash = bcrypt.hashSync(connection.escape(password), salt);

      connection.query('INSERT INTO password (id,salt,password) VALUES(?, ?, ?)',
        [result.insertId, salt, hash],
        function(err, res) {
          if (err) {
            return done(err);
          }
          done(null, result.insertId);
        });
    });
};

exports.deleteUser = function(id, done) {
  var connection = db.get();
  connection.query('DELETE FROM users WHERE id=?', id, function(err, result) {
    if (err) {
      return done(err);
    }
    done(null, result.affectedRows);
  });
};

exports.getUserWithPassword = function(email, password, done) {
  var connection = db.get();
  connection.query('SELECT id,email FROM users where email = ?', connection.escape(email),
    function(err, result) {
      if (err) {
        return done(err);
      }
      result = result[0];
      if ('id' in result) {
        connection.query('SELECT password FROM password where id = ?', result.id,
          function(err, res) {
            if (err) {
              return done(err);
            }
            res = res[0];
            if ('password' in res && bcrypt.compareSync(connection.escape(password), res.password)) {
              done(null, result);
            }else {
              done(null, null);
            }
          });
      }else {
        done(null, null);
      }
    });
};
