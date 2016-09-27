var config = require('../app/config');
var deviceUtil = require('../app/deviceUtil');

var handler = function (router) {
    
    router.get('/', function(req, res, next) {
        res.render('home', { 
            widgets: config.widgets, 
            homeTabServices: config.homeTabServices
        });
    });

    router.get('/gettemp', function (req, res) {

        deviceUtil.getDeviceStats(function (err, json) {
            if(err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.end('error');
                return;
            }

            res.json(json);
        });
    });

    router.get('/reboot', function (req, res) {
        deviceUtil.reboot();

        res.redirect('/message/reboot');
    });

    router.get('/shutdown', function (req, res) {
        deviceUtil.shutdown();
        
        res.redirect('/message/shutdown');
    });
};

module.exports = {
    handle: handler
};
