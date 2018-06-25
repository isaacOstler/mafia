class Player{
	constructor(name){
    	var S4 = function() {
    	   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
   		};
		this.guid = (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
		this.playerName = name;
		this.status = "alive";
	}

	getGUID(){
		return this.guid;
	}
	setGUID(newGUID){
		this.guid = newGUID;
	}

	getPlayerName(){
		return this.playerName;
	}
	setPlayerName(newName){
		this.playerName = newName;
	}

	getStatus(){
		return this.status
	}
	setStatus(newStatus){
		this.status = newStatus;
	}
}