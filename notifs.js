$(document).ready(function () {

	var CLIENTID = ;
	var idList = [];
	var accountList = [];

	// initialize the client
	SC.initialize({
    	client_id: CLIENTID
  	});

  	chrome.alarms.create("scAlert", { // create alarm called 'scAlert'
		delayInMinutes: 1, // alarm fires after 1 minute
		periodInMinutes: 1 // alarm fires every minute thereafter 
	});

	chrome.alarms.onAlarm.addListener(function(alarm) { // fired when an alarm has elapsed

		// get all stored account names
		chrome.storage.sync.get('accounts', function(result){
			if (result.accounts != null) {
				accountList = result.accounts;
			}
		});

		// get all stored track IDs
		chrome.storage.sync.get('trackID', function(result){
			if (result.trackID != null){
				idList = result.trackID;
			}
		});

		// Go through all account names
		for (var i = 0; i < accountList.length; i++) {

			// create link based on accunt name to prepare GET request
			var link = '/users/' + accountList[i] + '/tracks';

			SC.get(link).then(function(tracks){ // make GET request 
				
				// ensure that the track hasn't already been checked and was posted within past 24h
				if (checkID(tracks[0].id) == false && checkPostTime(tracks[0].created_at) == true) {

					sendNotif(tracks[0].title); // create notification 
					addID(tracks[0].id); // add the id to list of ids checked

				}

			});

		}

	});

	// Checks the time a track has been posted 
	// If it was posted within the past 24 hours, return true
	// else, return false to indicate that we don't need to worry about it
	function checkPostTime (postTime) {

		var yesterday = Date.now() - 86400000;

		// get the year, month and day from the 'created_at' field in the json data
		var year = postTime.substring(0, 4);
		var month = postTime.substring(5, 7);
		var day = postTime.substring(8, 10);

		// conver the data to milliseconds 
		var trackDate = new Date(year, month-1, day);
		trackMil = trackDate.getTime();

		// if the track post time (in milliseconds) was within the past 24h, return true
		if (trackMil >= yesterday) {
			return true;
		}

		return false;

	}

	// add the track id to the list of ids that have been checked 
	// and store the updated list
	function addID (trackid) {

		idList.push(trackid);

		chrome.storage.sync.set({
			'trackID': idList
		});

	}

	// return true if a track we're looking at has already been checked
	// after a previous alarm and return false otherwise 
	function checkID(trackID) {

		if (idList != null) {
			for (var i = 0; i < idList.length; i++){
				if (trackID == idList[i]){
					return true;
				}
			}
		}

		return false;	
	}

	// go to the given URL when a user clicks on the notification window 
	chrome.notifications.onClicked.addListener(function() {

		chrome.tabs.create({url: "http://soundcloud.com"});
	});

	// create a notification object with the required properties 
	function sendNotif(tracktitle) {

		var opt = {
			type: "basic",
			title: "Soundcloud Notification",
			message: tracktitle,
			iconUrl: "sc.png",
		};

		// creates and displays the notification
		chrome.notifications.create(opt);
	}

});