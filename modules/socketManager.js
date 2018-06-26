var io;
var http;
var port;
var gameMaster;

module.exports.init = function(passedIO,passedHTTP,passedPort,passedGameMaster){
	io = passedIO;
	http = passedHTTP;
	port = passedPort;
	gameMaster = passedGameMaster;

	io.on('connection', function(socket) {
		console.log('A user connected');
		socket.on('joinGame',function(data){
			gameMaster.addPlayerToGame(data.gameGUID,{'guid' : data.userGUID,'socket' : socket});
			console.log('Player ' + data.userGUID + ' joined game ' + data.gameGUID);
		});
		socket.on('disconnect', function () {
			console.log('A user disconnected');
		});
	});

	http.listen(port);
};