var express = require('express');
var router = express.Router();

router.get('/reboot',  function (req, res) {
    res.render('messagePage', {
        message: 'Device Rebooting...'
    });
});

router.get('/shutdown', function (req, res) {
    res.render('messagePage', {
        message: 'Device Halted!'
    });
});

module.exports = router;