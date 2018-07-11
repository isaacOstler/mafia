//npm modules
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//variables
var port = 3000;

//modules
var router = require(__dirname + '/modules/router.js');
var database = require(__dirname + '/modules/database.js');
var socketManager = require(__dirname + '/modules/socketManager.js');
var gameMaster = require(__dirname + '/modules/gameMaster.js');

//code
router.init(app,port);
socketManager.init(io,http,port,gameMaster,database);
database.init();
gameMaster.init();

gameMaster.createNewGame();