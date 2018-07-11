//DOM references
var loginForm = $('#loginForm'),
	usernameTextbox = $('#loginBox_input_usernameTextfield'),
	passwordTextbox = $('#loginBox_input_passwordTextfield'),
	createNewAccountButton = $('#createNewAccountButton'),
	loginBox = $('#loginBox'),
	newAccountSettings = $('#newAccountSettings'),
	newAccountSettings_usernameAndPassword = $('#newAccountSettings_usernameAndPassword'),
	newAccountSettings_usernameTextfield = $('#newAccountSettings_usernameAndPassword_username'),
	newAccountSettings_passwordTextfield = $('#newAccountSettings_usernameAndPassword_password'),
	newAccountSettings_confirmPasswordTextfield = $('#newAccountSettings_usernameAndPassword_confirmPassword'),
	newAccountSettings_userInfo = $('#newAccountSettings_userInfo'),
	newAccountSettings_usernamePasswordErrorMessage = $('#newAccountSettings_usernameAndPassword_errorMessage');
	newAccountSettings_continueButton = $('#newAccountSettings_continueButton'),
	newAccountSettings_firstName = $('#newAccountSettings_userInfo_firstName'),
	newAccountSettings_lastName = $('#newAccountSettings_userInfo_lastName'),
	newAccountSettings_middleName = $('#newAccountSettings_userInfo_middleName'),
	newAccountSettings_hairColor = $('#newAccountSettings_userInfo_hairColor'),
	newAccountSettings_hairLength = $('#newAccountSettings_userInfo_hairLength'),
	newAccountSettings_gender = $('#newAccountSettings_userInfo_gender'),
	newAccountSettings_race = $('#newAccountSettings_userInfo_race'),
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

	socket.on('userCreated',function(guid){
		window.location = '/resource?file=lobbies.html&player=' + guid;
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
			newAccountSettings_usernamePasswordErrorMessage.stop();
			newAccountSettings_usernamePasswordErrorMessage.fadeOut();
			newAccountSettings_usernamePasswordErrorMessage.html('');
			if(newAccountSettings_usernameTextfield.val() == ''){
				//no username
				newAccountSettings_usernamePasswordErrorMessage.fadeIn();
				newAccountSettings_usernamePasswordErrorMessage.html('Please enter a username');
			}else if(newAccountSettings_passwordTextfield.val() != newAccountSettings_confirmPasswordTextfield.val()){
				//no password
				newAccountSettings_usernamePasswordErrorMessage.fadeIn();
				newAccountSettings_usernamePasswordErrorMessage.html('Passwords do not match');
			}else{
				newUserUsername = newAccountSettings_usernameTextfield.val();
				newUserPassword = newAccountSettings_passwordTextfield.val();
				newAccountSettings_usernamePasswordErrorMessage.fadeOut();
				newAccountSettings_usernameAndPassword.fadeOut();
				newAccountSettings_userInfo.fadeIn();
				registrationStep++;
				newAccountSettings_continueButton.html('Create');
			}
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
					"race" : newAccountSettings_race.val(),
					"height" :
					{
						"feet" : Number(newAccountSettings_heightInFeet.val()),
						"inches" : Number(newAccountSettings_heightInInches.val())
					}
				}
			}
			registrationStep = 0;
			newAccountSettings_continueButton.html('Continue');
			socket.emit('createUser',newUser);
		}
	});
});