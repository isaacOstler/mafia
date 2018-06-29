var socket = io();
var currentGames = '';

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
})();

//set up socket connections

socket.on('connect',function(){
    console.log("hello")
    var player = new Player("Unknown Player");
    player.setGUID(urlParams.player);
    socket.emit('joinGame',{'gameGUID' : urlParams.game,'player' : player});
	socket.emit('getCurrentGames');
    socket.on('recieveCurrentGames',function(data){
        console.log(data);
    });
});