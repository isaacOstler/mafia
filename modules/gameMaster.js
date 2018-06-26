//npm modules
var appRoot = require('app-root-path');

//modules
var game = require(appRoot + '/classes/game.js');

//variables
var currentGames = [];
var connectedSockets = [];
var onLobbiesChangeCallback;
//game object

/*
{
	"game" : Game Class,
	"players" : 
}*/

module.exports.init = function(){
	
};

module.exports.createNewGame = function(){
	var newGame = new game.Game();
	console.log('Created Game ' + newGame.guid);
	currentGames.splice(currentGames.length,0,{'game' : newGame,'players' : []});
	updateLobbyEventListener();
};

module.exports.removePlayerFromGame = function(socket){
	for(var i = 0;i < currentGames.length;i++){
		for(var j = 0;j < currentGames[i].players.length;j++){
			if(currentGames[i].players[j].socket == socket){
				console.log(('Player ' + currentGames[i].players[j].guid.toString().bold + ' was removed from game ' + currentGames[i].game.guid.toString().bold).error);
				addSocketToSocketList(currentGames[i].game.guid,socket);
				currentGames[i].players.splice(j,1);
				updateLobbyEventListener();
				return;
			}
		}
	}
};

module.exports.addPlayerToGame = function(gameGUID,playerInfo){
	for(var i = 0;i < currentGames.length;i++){
		if(currentGames[i].game.guid == gameGUID){
			currentGames[i].players.splice(currentGames[i].players.length,0,playerInfo.guid);
			addSocketToSocketList(gameGUID,playerInfo.socket);
			updateLobbyEventListener();
			console.log(('Player ' + playerInfo.guid + ' successfully added to game ' + currentGames[i].game.guid + '!').toString().info);
		}
	}
};

module.exports.endGame = function(GUID){
	for(var i = 0;i < currentGames.length;i++){
		if(currentGames[i].game.getGUID() == GUID){
			currentGames[i].game = null;
			currentGames[i].splice(1);
			updateLobbyEventListener();
			return;
		}
	}
};

module.exports.getCurrentGames = function(){
	return currentGames;
};

module.exports.on = function(event,callback){
	if(event == 'onLobbiesChange'){
		onLobbiesChangeCallback = callback;
	}
};

//functions

function updateLobbyEventListener(){
	if(onLobbiesChangeCallback != null){
		onLobbiesChangeCallback(currentGames);
	}
}

function removeSocketFromSocketList(gameGUID,socket){
	for(var i = 0;i < connectedSockets.length;i++){
		if(connectedSockets[i].gameGUID == gameGUID){
			for(var j = 0;j < connectedSockets[i].sockets.length;j++){
				connectedSockets[i].sockets.splice(j,1);
				return;
			}
		}
	}
}

function addSocketToSocketList(gameGUID,socket){
	var addedToSocketList = false;
	for(var i = 0;i < connectedSockets.length;i++){
		if(connectedSockets[i].gameGUID == gameGUID){
			connectedSockets[i].sockets.splice(connectedSockets[i].sockets.length,0,socket);
			addedToSocketList = true;
		}
	}
	if(!addedToSocketList){
		connectedSockets.splice(connectedSockets.length,0,{"gameGUID" : gameGUID,"sockets" : [socket]})
	}
}