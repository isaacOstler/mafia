class Godfather extends Player{
	constructor(name){
		super(name);
	}

	killPlayer(playerToKill,players){
		if(isNaN(Number(playerToKill))){
			throw new Error('err: value 0 of killPlayer must be a numeric value, value "' + playerToKill + "' is NaN");
			return;
		}
		players[playerToKill].setStatus("dead");
	}
}