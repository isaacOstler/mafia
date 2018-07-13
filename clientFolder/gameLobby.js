//DOM References
var playersList = $("#list_players");

//variables
var socket = io();
var currentGames = [];

//get query string from URL
var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);

   init();
})();

//functions

function init(){
	//make sure they are logged in
	if(urlParams.player == null){
        window.location = '/resource?file=login.html';
    }
    //make sure they are in a game
	if(urlParams.game == null){
        window.location = '/resource?file=lobbies.html&player=' + urlParams.player;
    }
    //set up socket connections
    socket.on('connect',function(){
        socket.emit('getUserInfo',{'guid' : urlParams.player});
       
        socket.on('recieveUserInfo',function(data){
            if(data == null){
                window.location = '/resource?file=login.html';
            }else{
                var player = new Player("Unknown Player");
		      	player.setGUID(urlParams.player);
		      	player.setPlayerName(data.userTraits.name.first + ' ' + data.userTraits.name.last);
		      	socket.emit('leaveGames');
		    	socket.emit('joinGame',{'gameGUID' : urlParams.game,'player' : player});
            }
        });

    	socket.emit('getCurrentGames');
        socket.on('recieveCurrentGames',function(data){
            if(true || currentGames.length != data.length){
                //redraw
                currentGames = data;

                var gameFound = false;
                var html = '';
   	            for(var i = 0;i < currentGames.length;i++){
	            	if(currentGames[i].game.guid == urlParams.game){
	            		gameFound = true;
		                for(var j = 0;j < currentGames[i].players.length;j++){
		                    html += '<div class="listItem">';
		                    html += currentGames[i].players[j].playerName;
		                    html += '</div>';
		                }
	            	}
                }

                playersList.html(html);
                if(!gameFound){
                	//this game doesn't exist anymore, let's send them back to 
                	//the game lobbies
                	window.location = '/resource?file=lobbies.html&player=' + urlParams.player;
                }
            }else{
                //update

            }
            $('.openLobbiesList_list_item').off();
            $('.openLobbiesList_list_item').click(function(event){
                var gameGUID = $(event.target).attr('gameGUID');
                if(gameGUID == null || gameGUID == undefined){
                    return;
                }
                //player.setGUID(urlParams.player);
                window.location = '/resource?file=gameLobby.html&player=' + urlParams.player + '&game=' + gameGUID;
            });
        });
    });
}