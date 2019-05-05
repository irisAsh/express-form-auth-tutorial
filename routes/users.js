var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var session = req.session;
console.log(session.userId)
  if (!!session.userId) {
    User.findOne({ _id: session.userId })
    .then(function(result) {
      if (!result) {
        throw new Error('Userが見つかりません');
      }
      res.render('user/index', {
        title: 'Success',
        user: result
      });
    })
    .catch(function(err) {
      console.log(err);
      next(err);
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
