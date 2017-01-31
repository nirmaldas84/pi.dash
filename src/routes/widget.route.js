var config = require('../app/config');

var path = '/browse';

function handler (router) {

    config.sideTabServices.forEach(function (service) {

        var path = service.route;
        
        router.get(path, function (req, res) {
            res.render('sideTabBody', { 
                widgets: config.widgets,
                src: service.url
            });
        });

    });
    
};

module.exports = {
    handle: handler
};