//npm modules
var appRoot = require('app-root-path');
var jsonfile = require('jsonfile');

//modules

//variables
var users = [];

//public functions
module.exports.init = function(){
	readUsersFromFS(function(err,obj){
		if(!err){
			users = obj;
		}
	});
};

module.exports.getUserGUID = function(username,password){
	for(var i = 0;i < users.length;i++){
		if(users[i].loginInformation.username == username){
			if(users[i].loginInformation.password == password){
				return users[i].userTraits.guid;
			}
		}
	}
	return null;
};

module.exports.getUserInfo = function(guid){
	for(var i = 0;i < users.length;i++){
		if(users[i].userTraits.guid == guid){
			return users[i].userTraits;
		}
	}
	return null;
};

module.exports.getUserInformation = function(guid){
	for(var i = 0;i < users.length;i++){
		if(users[i].userTraits.guid == guid){
			return users[i].userTraits;
		}
	}
}

//private functions
function writeUsersToFS(){

}

function readUsersFromFS(callback){
	var file = appRoot + '/records/users.json';
	jsonfile.readFile(file, function(err, obj) {
		if(err){
			console.log('ERROR! '.error.bold + err.toString().error);
			callback(err);
		}else{
			callback(null,obj);
		}
	});
}