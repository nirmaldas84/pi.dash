var express = require('express');
var router = express.Router();
var config = require('../app/config');

// Set routers
var childRoutes = [
  './home.route',
  './widget.route'
];

for(var i = 0; i < childRoutes.length; i++) {  
  var route = require(childRoutes[i]);
  route.handle(router);
}

module.exports = router;
