var homeTabServices = [
    {
        name: 'Deluge',
        url: 'http://raspberrypi:8112',
        iconClass: 'glyphicon glyphicon-download-alt'
    }
];

var sideTabServices = [
    {
        name: 'Deluge',
        url: 'http://raspberrypi:8112',
        iconClass: 'glyphicon glyphicon-download-alt'
    }, 
    {
        name: 'Plex',
        url: 'http://raspberrypi:32400/web/index.html',
        iconClass: 'glyphicon glyphicon-film'
    }
];

module.exports = {    
    homeTabServices: homeTabServices,
    sideTabServices: sideTabServices,
    widgets: [{
        name: 'Home',
        route: '/',
        iconClass: 'glyphicon glyphicon-home'
    }].concat(sideTabServices.map(function (service) {
        service.route = service.route || '/' + service.name; 
        return service;
    }))
};