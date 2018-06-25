class Game{
	constructor(players){
		this.players = players;
		this.dayLengthInSeconds = 50;
		this.nightLengthInSeconds = 20;
		this.trialLengthInSeconds = 30;
		this.eventHandlers = {
			"dayOrNightEnd" : null
		};
		this.isDay = true;

		let timePassed = 0;
		let timeRequired = 5;
		let that = this;
		let internalTimer = function(){
			timePassed++;
			if(timePassed >= timeRequired){
				timePassed = 0;
				that.isDay = !that.isDay;
				if(that.eventHandlers.dayOrNightEnd != null){
					that.eventHandlers.dayOrNightEnd(that.isDay);
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