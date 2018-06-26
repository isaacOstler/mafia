//node modules
var colors = require('colors');
var appRoot = require('app-root-path');

//init node modules

colors.setTheme({
	silly: 'rainbow',
	input: 'grey',
	verbose: 'cyan',
	prompt: 'grey',
	info: 'green',
	data: 'grey',
	help: 'cyan',
	warn: 'yellow',
	debug: 'blue',
	error: 'red',
});

//code
module.exports.init = function(passedApp){
	var app = passedApp;
	var clientFolder = appRoot + '/clientFolder/';
	var	classFolder = appRoot + '/classes/';

	app.get('/', function (req, res) {
		res.sendFile(clientFolder + 'lobbies.html');
	});
	app.get('/resource', function(req, res) {
		res.sendFile(clientFolder + req.query.file.toString());
	});
	app.get('/class', function(req, res) {
		res.sendFile(classFolder + req.query.file.toString());
	});

	app.use(function (req, res, next) {
		var date = new Date();
		var timeStamp = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		console.log('[' + timeStamp.toString().prompt + ']');
		next();
	});

	app.use(function (err, req, res, next) {
		console.log('Error! '.error.bold + err.toString().error);
	});
};