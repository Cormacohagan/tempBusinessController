var express = require('express');
var router = express.Router();
var path = require('path');

/* GET block page. */
router.get('/:blockNumber', function(req, res, next) {

    res.sendFile(path.join(__dirname + '/../public/pages/blockInfo/blockInfo.html'));

});

module.exports = router;
