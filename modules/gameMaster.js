//npm modules
var appRoot = require('app-root-path');

//modules
var game = require(appRoot + '/classes/game.js');

//variables
var currentGames = [];
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
	var currentGameObject = currentGames[currentGames.length - 1];
	currentGameObject.game.on('dayOrNightEnd',function(){
		for(var i = 0;i < currentGameObject.players.length;i++){
			console.log('It is ' + (currentGameObject.game.isDay ? 'day' : 'night') + ' ' + (currentGameObject.game.currentDay + 1));
			currentGameObject.players[i].socket.emit('data','It is ' + (currentGameObject.game.isDay ? 'day' : 'night') + ' ' + (currentGameObject.game.currentDay + 1));
		}
	});
};

module.exports.removePlayerFromGame = function(socket){
	for(var i = 0;i < currentGames.length;i++){
		for(var j = 0;j < currentGames[i].players.length;j++){
			if(currentGames[i].players[j].socket == socket){
				console.log(('Player ' + currentGames[i].players[j].guid.toString().bold + ' was removed from game ' + currentGames[i].game.guid.toString().bold).error);
				currentGames[i].players.splice(j,1);
				return;
			}
		}
	}
};

module.exports.addPlayerToGame = function(gameGUID,playerInfo){
	for(var i = 0;i < currentGames.length;i++){
		if(currentGames[i].game.guid == gameGUID){
			currentGames[i].players.splice(currentGames.length,0,playerInfo);
			console.log(('Player ' + playerInfo.guid + ' successfully added to game ' + currentGames[i].game.guid + '!').toString().info);
		}
	}
};

module.exports.endGame = function(GUID){
	for(var i = 0;i < currentGames.length;i++){
		if(currentGames[i].game.getGUID() == GUID){
			currentGames[i].game = null;
			currentGames[i].splice(1);
			return;
		}
	}
};