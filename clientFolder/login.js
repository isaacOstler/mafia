//DOM references
var loginForm = $('#loginForm'),
	usernameTextbox = $('#loginBox_input_usernameTextfield'),
	passwordTextbox = $('#loginBox_input_passwordTextfield'),
	createNewAccountButton = $('#createNewAccountButton'),
	loginBox = $('#loginBox'),
	newAccountSettings = $('#newAccountSettings'),
	newAccountSettings_usernameAndPassword = $('#newAccountSettings_usernameAndPassword'),
	newAccountSettings_userInfo = $('#newAccountSettings_userInfo'),
	newAccountSettings_continueButton = $('#newAccountSettings_continueButton'),
	newAccountSettings_firstName = $('#newAccountSettings_userInfo_firstName'),
	newAccountSettings_lastName = $('#newAccountSettings_userInfo_lastName'),
	newAccountSettings_middleName = $('#newAccountSettings_userInfo_middleName'),
	newAccountSettings_hairColor = $('#newAccountSettings_userInfo_hairColor'),
	newAccountSettings_hairLength = $('#newAccountSettings_userInfo_hairLength'),
	newAccountSettings_gender = $('#newAccountSettings_userInfo_gender'),
	newAccountSettings_heightInFeet = $('#newAccountSettings_userInfo_heightInFeet'),
	newAccountSettings_heightInInches = $('#newAccountSettings_userInfo_heightInInches');


//variables
var socket = io(),
	hasInit = false,
	registrationStep = 0,
	newUserUsername = null,
	newUserPassword = null;


socket.on('connect',function(){
	if(hasInit){
		return;
		//we can only init once
	}
	hasInit = true;

	//io
	socket.on('recieveUserGUID',function(data){
		if(data == null){
			//username and / or password was incorrect
			alert('Username or password incorrect');
		}else{
			//move on to lobbies
			window.location = '/resource?file=lobbies.html&player=' + data;
		}
	});

	//event listeners
	loginForm.submit(function(event){
		socket.emit('getUserGUID',{'username' : usernameTextbox.val(),'password' : passwordTextbox.val()});
	});

	createNewAccountButton.click(function(event){
		loginBox.fadeOut();
		createNewAccountButton.fadeOut();
		newAccountSettings.fadeIn();
		newAccountSettings_userInfo.css('display','none');
	});
	newAccountSettings_continueButton.click(function(event){
		if(registrationStep == 0){
			newAccountSettings_usernameAndPassword.fadeOut();
			newAccountSettings_userInfo.fadeIn();
			registrationStep++;
			newAccountSettings_continueButton.html('Create');
		}else{
			if(newUserUsername == null || newUserPassword == null){
				throw new Error('Username and/or password was null!');
				return;
			}
			var newUser = {
				"loginInformation" :
				{
					"username" : newUserUsername,
					"password" : newUserPassword
				},
				"userTraits" :
				{
					"guid" : null,
					"name" :
					{
						"first" : newAccountSettings_firstName.val(),
						"middle" : newAccountSettings_middleName.val(),
						"last" : newAccountSettings_lastName.val()
					},
					"hair" : 
					{
						"color" : newAccountSettings_hairColor.val(),
						"length" : Number(newAccountSettings_hairLength.val())
					},
					"gender" : newAccountSettings_gender.val(),
					"race" : newAccountSettings_userInfo_race.val(),
					"height" :
					{
						"feet" : Number(newAccountSettings_heightInFeet.val()),
						"inches" : Number(newAccountSettings_heightInInches.val())
					}
				}
			}
			registrationStep = 0;
			newAccountSettings_continueButton.html('Continue');
		}
	});
});