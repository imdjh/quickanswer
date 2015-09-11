var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:qaID', function(req, res, next) {
  res.render('doit', { id: req.params.qaID });
});

module.exports = router;
