/**
 * Created by kiprasad on 31/07/16.
 */

var mysql = require('mysql');
var async = require('async');

var PRODUCTION_DB = 'convergeDB';
var TEST_DB = 'convergeDB';

exports.MODE_TEST = 'development';
exports.MODE_PRODUCTION = 'production';

var state = {
  pool: null,
  mode: null
};

exports.connect = function(mode, done) {
  state.pool = mysql.createPool({
    host: '',
    user: 'converge',
    password: 'PassWord',
    database: mode === exports.MODE_PRODUCTION ? PRODUCTION_DB : TEST_DB
  });
  state.mode = mode;
  done();
};

exports.get = function() {
  return state.pool;
};
