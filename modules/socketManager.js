var io;
var http;
var port;
var gameMaster;
var databaseManager;
var socketEventListeners = [];

module.exports.init = function(passedIO,passedHTTP,passedPort,passedGameMaster,passedDatabaseManager){
	io = passedIO;
	http = passedHTTP;
	port = passedPort;
	gameMaster = passedGameMaster;
	databaseManager = passedDatabaseManager;

	io.on('connection', function(socket) {
		console.log('A user connected');

		socket.on('disconnect', function () {
			gameMaster.removePlayerFromGame(socket);
			removeFromSocketEventListener('onLobbiesChange',socket);
			console.log('A user disconnected');
		});

		socket.on('joinGame',function(data){
			gameMaster.addPlayerToGame(data.gameGUID,data.player,socket);
		});

		socket.on('leaveGames',function(){
			gameMaster.removePlayerFromGame(socket)
		});

		socket.on('getCurrentGames',function(){
			addToSocketEventListener('onLobbiesChange',socket);
			socket.emit('recieveCurrentGames',gameMaster.getCurrentGames());
		});

		socket.on('getUserGUID',function(data){
			socket.emit('recieveUserGUID',databaseManager.getUserGUID(data.username,data.password));
		});

		socket.on('getUserInfo',function(data){
			socket.emit('recieveUserInfo',databaseManager.getUserInfo(data.guid));
		});

		socket.on('createUser',function(data){
			databaseManager.createUser(data,function(guid){
				socket.emit('userCreated',guid)
			});
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
				socketEventListeners[i].sockets[j].emit(socketEvent,newData);
			}
		}
	}
}