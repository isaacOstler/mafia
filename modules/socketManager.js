var io;
var http;
var port;
var gameMaster;
var socketEventListeners = [];

module.exports.init = function(passedIO,passedHTTP,passedPort,passedGameMaster){
	io = passedIO;
	http = passedHTTP;
	port = passedPort;
	gameMaster = passedGameMaster;

	io.on('connection', function(socket) {
		console.log('A user connected');

		socket.on('disconnect', function () {
			gameMaster.removePlayerFromGame(socket);
			console.log('A user disconnected');
		});

		socket.on('joinGame',function(data){
			gameMaster.addPlayerToGame(data.gameGUID,{'guid' : data.userGUID,'socket' : socket});
		});

		socket.on('getCurrentGames',function(){
			addToSocketEventListener('onLobbiesChange',socket);
			socket.emit('recieveCurrentGames',gameMaster.getCurrentGames());
		});
	});

	gameMaster.on('onLobbiesChange',function(newData){
		triggerSocketEvent('onLobbiesChange',newData,'recieveCurrentGames');
	});

	http.listen(port);
};

function addToSocketEventListener(eventKey,socket){
	var wasAdded = false;
	for(var i = 0;i < socketEventListeners.length;i++){
		if(socketEventListeners[i].eventKey == eventKey){
			wasAdded = true;
			socketEventListeners[i].sockets.splice(socketEventListeners[i].sockets.length,0,socket);
		}
	}
	if(!wasAdded){
		socketEventListeners.splice(socketEventListeners.length,0,{'eventKey' : eventKey,'sockets' : [socket]});
	}
}

function removeFromSocketEventListener(eventKey, socket){
	for(var i = 0;i < socketEventListeners.length;i++){
		if(socketEventListeners[i].eventKey == eventKey){
			for(var j = 0;j < socketEventListeners[i].sockets.length;j++){
				if(socketEventListeners[i].sockets[j] == socket){
					socketEventListeners[i].sockets.splice(j,1);
					return;
				}
			}
		}
	}
}

function triggerSocketEvent(eventKey,newData,socketEvent){
	for(var i = 0;i < socketEventListeners.length;i++){
		if(socketEventListeners[i].eventKey == eventKey){
			for(var j = 0;j < socketEventListeners[i].sockets.length;j++){
				socketEventListeners[i].sockets[i].emit(socketEvent,newData);
			}
		}
	}
}