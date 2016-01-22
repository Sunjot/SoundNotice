var list = [];

$(document).ready(function () {
 
	var id = 1;

	$('#add').mouseenter(function() {
		$('#add').fadeTo('fast', 1);
	});

	$('#add').mouseleave(function() {
		$('#add').fadeTo('fast', 0.85)
	});

	$('#remove').mouseenter(function() {
		$('#remove').fadeTo('fast', 1);
	});

	$('#remove').mouseleave(function() {
		$('#remove').fadeTo('fast', 0.85)
	});

	/* Change opacity when mouse hovers over a list item */
	$('#list').on({
		mouseenter: function() {
			var id = '#' + this.id;
			$(id).fadeTo('fast', 1);
		},
		mouseleave: function() {
			var id = '#' + this.id;
			$(id).fadeTo('fast', 0.7);
		}
	}, ".parent");

	/* Change opacity when mouse hovers over the list 'x' button */
	$('#list').on({
		mouseenter: function() {
			var id = '#' + this.id;
			$(id).fadeTo('fast', 1);
		},
		mouseleave: function() {
			var id = '#' + this.id;
			$(id).fadeTo('fast', 0.5);
		},
		click: function() {
			var id = '#' + $(this).parent().attr('id');
			var word = $('#list ' + id + ' .keyword').html();
			$(id).remove();	

			var tempList = [];
			for (var i = 0; i < list.length; i++) {
				if (list[i] != word) {
					tempList.push(list[i]);
				}
			}

			list = tempList;
			chrome.storage.sync.set({
				'accounts': tempList
			});			
		}
	}, ".remove");

	// when the add button is clicked
	$("#add").click(function(){

		// get the value from the textbox
		var account = document.getElementById('keywordbox').value;

		// if a valid word is entered and it doesn't already exist in the 
		// list of keywords, proceed
		if (account != "" && iterate(account) == false) {

			// add the word to the list of keywords and display it on the page
			var arr = [account];
			addToList(arr);
			document.getElementById('keywordbox').value = "";

			// store the updated list of keywords
			list.push(account);
			chrome.storage.sync.set({
				'accounts': list
			})

		}
	});

	// when the remove all button is clicked
	$("#remove").click(function(){

		if (confirm('Are you sure you want to clear the list?')) {

			list = [];
			id = 1;

			// empty the stored keywords and ids lists
			chrome.storage.sync.set({
				'accounts': list
			});

			// clear the list on the page
			$('#list div').remove();
		}

	});

	// Display the keyword(s) on the page 
	function addToList(arr) {
		for (var i = 0; i < arr.length; i++){
			$("#list").append('<div class="parent" id="' + id.toString() + '"><span class="keyword" id="k' + id.toString() + '">' + arr[i] + 
				'</span><span class="remove" id="r' + id.toString() + '">x</span></div>');
			id++;
		}
	}

	// check if the entered keyword exists in the list of 
	// keywords on the page and return true or false
	function iterate(account) {

		for (var i = 0; i < list.length; i++){
			if (list[i].toUpperCase() == account.toUpperCase()){
				return true;
			}
		}

		return false;
	}

	// display all stored keywords on the page
	function restore() {
		
		chrome.storage.sync.get('accounts', function(result){

			// add all keywords to a list one by one
			if (result.accounts != null) {
				for (var i = 0; i < result.accounts.length; i++){
					list.push(result.accounts[i]);
				}
			}

			// send the list to the function addToList to display 
			// all the keywords on the page
			if (list != null){
				addToList(list);
			}

		});

	}

	// everytime the page is loaded, call restore to display the stored keywords
	document.addEventListener('Restore', restore());

});
