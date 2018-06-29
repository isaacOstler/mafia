class Game{
	constructor(players){
		var S4 = function() {
    	   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
   		};
		this.guid = "test";//(S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
		this.players = players;
		this.dayLengthInSeconds = 50;
		this.nightLengthInSeconds = 20;
		this.trialLengthInSeconds = 30;
		this.onTrail = null;
		this.trialInProgress = false;
		this.eventHandlers = {
			"dayOrNightEnd" : null
		};
		this.isDay = true;
		this.currentDay = 0;

		let timePassed = 0;
		let timeRequired = 5;
		let that = this;
		let internalTimer = function(){
			if(!that.trialInProgress){
				timePassed++;
				if(timePassed >= timeRequired){
					timePassed = 0;
					that.isDay = !that.isDay;
					if(that.isDay){
						timeRequired = that.dayLengthInSeconds;
						that.currentDay++;
					}else{
						timeRequired = that.nightLengthInSeconds;
					}
					if(that.eventHandlers.dayOrNightEnd != null){
						that.eventHandlers.dayOrNightEnd(that.isDay);
					}
				}
			}
			setTimeout(function(){
				internalTimer();
			},1000);
		}
		internalTimer();
	}

	on(event,callback){
		if(event == "dayOrNightEnd"){
			this.eventHandlers.dayOrNightEnd = callback;
		}
	}
}

module.exports.Game = Game;