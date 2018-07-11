var me = new Player("Isaac","Godfather");
var GUID = '3432-5132-5435423-asd32';
var socket = io();

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
	socket.emit('joinGame',{'gameGUID' : urlParams.game,'userGUID' : urlParams.player});
	socket.on('data',function(data){
		console.log(data);
	});
});