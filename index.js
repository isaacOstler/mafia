//npm modules
var express = require('express');

//variables
var port = 3000;
var app = express();

//modules
var route = require(__dirname + '/modules/route.js');
var database = require(__dirname + '/modules/database.js');

//code
route.init(app,port);
database.init();