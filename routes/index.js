var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var saltRounds = 10;
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express Form Auth Tutorial' });
});

router.get('/signin', function(req, res, next) {
  res.render('signin', { title: 'Sign In' });
});

router.post('/signin', function(req, res, next) {
  var { username, password } = req.body;
  // bcrypt でハッシュ化してusernameとパスワードを保存
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(password, salt);
  User.create({
    username,
    password: hash
  })
  .then(function(result) {
    // user_idをセッションに詰める
    var session = req.session;
    session.userId = result._id;
    res.redirect('/users');
  })
  .catch(function(err) {
    console.log(err);
    next(err);
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login', function(req, res, next) {
  var { username, password } = req.body;
  User.findOne({ username })
  .then(function(result) {
    if (!result) {
      throw new Error('Userが見つかりません');
    }
    if (bcrypt.compareSync(password, result.password)) {
      // user_idをセッションに詰める
      var session = req.session;
      session.userId = result._id;
      res.redirect('/users');
    } else {
      res.redirect('/login');
    }
  })
  .catch(function(err) {
    console.log(err);
    next(err);
  });
});

router.post('/logout', function(req, res, next) {
  var session = req.session;
  session.userId = null;
  res.redirect('/');
});


module.exports = router;
