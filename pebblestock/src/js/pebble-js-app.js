var initialized = false;
var options = {};
var symbols = ["BRCM", "FB", "GOOGL"];
var watch_list = [];
var running_flag = false;
var notify_list = [];
var global_notify_idx = 0;
var global_change_threshold = 5;
var max_notify_one_turn = 3;
var symbol_vibe_time_table = {};
var working_state = false;

Pebble.addEventListener("showConfiguration", function() {
  console.log("showing configuration");
  var optionstring = '';
  if (localStorage.getItem('Symbols') != null){
	optionstring = "OldSymbols=" + localStorage.getItem('Symbols');
  } else {
	optionstring = "OldSymbols=" + symbols.join(',');

  }
  var url = ('http://cdn.rawgit.com/mqchau/mqchau.github.io/master/pebblestock/index.html?'+optionstring);
  console.log('opening url ' + url);
  Pebble.openURL(url);

});

Pebble.addEventListener("webviewclosed", function(e) {
	console.log("configuration closed");
	if (e.response) {
		var options = JSON.parse(decodeURIComponent(e.response));
		console.log('options received from configuration: ' + JSON.stringify(options));
		var note = options['Symbols'];
		localStorage.setItem('Symbols', note.join(','));
		console.log("Symbols = " + localStorage.getItem('Symbols'));
		startFetchQuote();
    //sendNoteContents();
	} else {
		console.log('no symbol received');
	}
	// webview closed
	//Using primitive JSON validity and non-empty check
	//if (e.response.charAt(0) == "{" && e.response.slice(-1) == "}" && e.response.length > 5) {
		//options = JSON.parse(decodeURIComponent(e.response));
		//symbol = options.StockSymbol;
		//console.log("Options = " + JSON.stringify(options));
		//startFetchQuote();
	//} else {
		//console.log("Cancelled");
	//}
});

// Set callback for the app ready event
Pebble.addEventListener("ready",
	function(e) {
		console.log("APP is ready");
		//startFetchQuote();
	});

// Set callback for appmessage events
Pebble.addEventListener("appmessage", function(e) {
			var msg = {};
		msg.init = true;
		msg.symbol = options.StockSymbol;
		msg.price = "40";
		if (!running_flag)
			startFetchQuote();
	});



function startFetchQuote() {
	console.log("startFetchQuote 1");	
	var response;
	var req = new XMLHttpRequest();
	
	// build the GET request
	req.open('GET', "http://dev.markitondemand.com/Api/v2/Quote/json?" + "symbol=" + symbols[current_idx], true);
	//req.open('GET', "http://mqchau.pythonanywhere.com/oldSymbols", true);
	req.onload = function(e) {
		if (req.readyState == 4) {
			// 200 - HTTP OK
			if(req.status == 200) {
				console.log(req.responseText);
				response = JSON.parse(req.responseText);
				
				symbols = response.symbols;
				
				console.log("startFetchQuote 2");
				notify_list = [];
				fetchStockQuote(0);
				
			} else {
				console.log("Request returned error code " + req.status.toString());
			}
		}
	
	};
	req.send(null);
	
	
}


// Fetch stock data for a given stock symbol (NYSE or NASDAQ only) from markitondemand.com
// & send the stock price back to the watch via app message
// API documentation at http://dev.markitondemand.com/#doc
function fetchStockQuote(current_idx) {
	//running_flag = true;
	
	var response;
	var req = new XMLHttpRequest();
	
	// build the GET request
	req.open('GET', "http://dev.markitondemand.com/Api/v2/Quote/json?" + "symbol=" + symbols[current_idx], true);
	//console.log("http://mqchau.pythonanywhere.com/json?" + "symbol=" + symbols[current_idx]);
	//req.open('GET', "http://mqchau.pythonanywhere.com/json?" + "symbol=" + symbols[current_idx], true);
	req.onload = function(e) {
		if (req.readyState == 4) {
			// 200 - HTTP OK
			if(req.status == 200) {
				console.log(req.responseText);
				response = JSON.parse(req.responseText);
				var price;
				if (response.Data) {
					if (Math.abs(response.Data.ChangePercent) > global_change_threshold){
					//if (1){
						var struct = {
							"2": response.Data.Symbol, 
							"3": roundPercent(response.Data.ChangePercent)
						};
						notify_list.push(struct);
						console.log("sending data to pebble " + JSON.stringify(struct));
						
					} else {
						console.log("stock doesn't change " + global_change_threshold + " for idx = " + current_idx);
					}
				}
			} else {
				console.log("Request returned error code " + req.status.toString());
			}
		}
		current_idx++;
		if (current_idx == symbols.length) {
			current_idx = 0; 
			global_notify_idx = 0;
			console.log("final notify list : " + JSON.stringify(notify_list));
			notifyPebble();
		} else fetchStockQuote(current_idx);
		//setTimeout(fetchStockQuote, 500);
	};
	req.send(null);
}

function notifyPebble(){
	console.log("notifyPebble");
	if (global_notify_idx == notify_list.length || global_notify_idx == max_notify_one_turn){
		global_notify_idx = 0;
		setTimeout(startFetchQuote, 2000);
	} else {
		
		var current_hour = new Date().getHours(); 
		if (!working_state && (current_hour >= 5 && current_hour < 16)){
			//transit to work state
			working_state = true;
			symbol_vibe_time_table = {};
		} else if (working_state && (current_hour >= 16 || current_hour < 5)){
			//transit to not work state
			working_state = false;
		}
		
		var vibe_flag;
		var current_time = new Date().getTime();
		if (symbol_vibe_time_table[notify_list[global_notify_idx]["2"]] === undefined) {
			vibe_flag = true;
			symbol_vibe_time_table[notify_list[global_notify_idx]["2"]] = current_time;
		} else {
			vibe_flag = false;
		}
		

// 		if (symbol_vibe_time_table[notify_list[global_notify_idx]["2"]] === undefined ){
// 			//if this company doesn't get vibe yet
// 			console.log(notify_list[global_notify_idx]["2"] + " not recorded");
// 			vibe_flag = true;
// 			 
// 			symbol_vibe_time_table[notify_list[global_notify_idx]["2"]] = current_time;
// 		} else {
// 			var current_time = new Date().getTime();
// 			if (current_time - symbol_vibe_time_table[notify_list[global_notify_idx]["2"]] > 24 * 3600 * 1000){
// 				//if last vibe is more than 24 hour ago
// 				vibe_flag = true;
// 				symbol_vibe_time_table[notify_list[global_notify_idx]["2"]] = current_time;
// 			} 
// 		}
		notify_list[global_notify_idx]["1"] = vibe_flag ? "true" : "false";
		Pebble.sendAppMessage(notify_list[global_notify_idx]);
		global_notify_idx++;
		setTimeout(notifyPebble, 2000);
	}
}

function roundPercent(long_float_string){
	var long_float = parseFloat(long_float_string);
	var short_float = long_float.toFixed(2);
	if (short_float > 0)
		return "+" + short_float.toString() + "%";
	else
		return short_float.toString() + "%";
}
