var express = require('express');
var router = express.Router();
var path = require('path');

/* GET Transaction page. */
router.get('/:transactionNumber', function(req, res, next) {

    res.sendFile(path.join(__dirname + '/../public/pages/transactionInfo/transactionInfo.html'));

});

module.exports = router;
