//DOM references
var gamesList = $('#openLobbiesList_list');
var userElement = $('#user');

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

function init(){
    if(urlParams.player == null){
        window.location = '/resource?file=login.html';
    }
    //set up socket connections

    socket.on('connect',function(){
        socket.emit('getUserInfo',{'guid' : urlParams.player});
       
        socket.on('recieveUserInfo',function(data){
            if(data == null){
                window.location = '/resource?file=login.html';
            }else{
                console.log(data);
                userElement.html('Logged in as <u>' + data.loginInformation.username + '</u>');
            }
        });
        socket.emit('getCurrentGames');
        socket.on('recieveCurrentGames',function(data){
            if(true || currentGames.length != data.length){
                //redraw
                currentGames = data;

                var html = '';

                for(var i = 0;i < currentGames.length;i++){
                    html += '<div gameGUID="' + currentGames[i].game.guid + '" class="openLobbiesList_list_item button">';
                    html += '<div gameGUID="' + currentGames[i].game.guid + '" class="openLobbiesList_list_item_name">';
                    html += currentGames[i].game.gameName;
                    html += '</div>';
                    html += '<div gameGUID="' + currentGames[i].game.guid + '" class="openLobbiesList_list_item_players">';
                    html += currentGames[i].players.length + ' / 12';
                    html += '</div>';
                    html += '</div>';
                }

                gamesList.html(html);
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
        userElement.click(function(event){
            window.location = '/resource?file=login.html';
        });
    });
}