var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/:qaID', function(req, res, next) {
  res.sendFile('doit.html', global.options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Someone did a test!');
    }
  });
});

module.exports = router;
