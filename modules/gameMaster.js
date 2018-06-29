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

module.exports.removePlayerFromGame = function(socket){
	var gameGUID;
	var playerGUID;

	for(var i = 0;i < connectedSockets.length;i++){
		for(var j = 0;j < connectedSockets[i].sockets.length;j++){
			if(connectedSockets[i].sockets[j].socket == socket){
				gameGUID = connectedSockets[i].gameGUID;
				playerGUID = connectedSockets[i].sockets[j].player.guid;
				connectedSockets[i].sockets[j].socket = null; //garbage collection
				connectedSockets[i].sockets.splice(j,1);
				break;
			}
		}
	}
	if(playerGUID != null && gameGUID != null){
		for(var i = 0;i < currentGames.length;i++){
			if(gameGUID == currentGames[i].game.guid){
				for(var j = 0;j < currentGames[i].players.length;j++){
					if(currentGames[i].players[j].guid == playerGUID){
						currentGames[i].players.splice(j,1);
						break;
					}
				}
			}
		}
	}
	updateLobbyEventListener();
};

module.exports.addPlayerToGame = function(gameGUID,player,socket){
	var wasAdded = false;
	for(var i = 0;i < currentGames.length;i++){
		if(currentGames[i].game.guid == gameGUID){
			wasAdded = true;
			currentGames[i].players.splice(currentGames[i].players.length,0,player);
		}
	}
	if(wasAdded == false){
		//this game hasn't been created yet
		return;
	}
	wasAdded = false;
	for(var i = 0;i < connectedSockets.length;i++){
		if(connectedSockets[i].gameGUID == gameGUID){
			wasAdded = true;
			connectedSockets[i].sockets.splice(connectedSockets[i].sockets.length,0,{'player' : player,'socket' : socket});
			break;
		}
	}
	if(wasAdded == false){
		//this game has been created, but does NOT have a sockets list
		//we need to add one
		connectedSockets.splice(connectedSockets.length,0,{'gameGUID' : gameGUID,'sockets' : [{'player' : player,'socket' : socket}]})
	}
	updateLobbyEventListener();
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