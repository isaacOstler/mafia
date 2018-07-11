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

module.exports.createUser = function(newUser,callback){
	newUser.userTraits.guid = (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	users.splice(users.length,0,newUser);
	writeUsersToFS(newUser,callback);
}

//private functions
function writeUsersToFS(newUser,callback){
	var file = appRoot + '/records/users.json';
	jsonfile.writeFile(file,users,function(){
		callback(newUser.userTraits.guid);
	});
}

function S4(){
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
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