var initialized = false;
var options = {};
var watch_list = [];
var running_flag = false;


Pebble.addEventListener("showConfiguration", function() {
  console.log("showing configuration");
  Pebble.openURL('http://mqchau.pythonanywhere.com/pebblestocksettings.html?'+encodeURIComponent(JSON.stringify(options)));
});

Pebble.addEventListener("webviewclosed", function(e) {
	console.log("configuration closed");
	// webview closed
	//Using primitive JSON validity and non-empty check
	if (e.response.charAt(0) == "{" && e.response.slice(-1) == "}" && e.response.length > 5) {
		options = JSON.parse(decodeURIComponent(e.response));
		console.log("Options = " + JSON.stringify(options));
	} else {
		console.log("Cancelled");
	}
});

// Set callback for the app ready event
Pebble.addEventListener("ready",
	function(e) {
		console.log("connect! " + e.ready);
		console.log(e.type);
	if (!running_flag)
			fetchStockQuote();
	});

// Set callback for appmessage events
Pebble.addEventListener("appmessage", function(e) {
			var msg = {};
		msg.init = true;
		msg.symbol = options.StockSymbol;
		msg.price = "40";
		if (!running_flag)
			fetchStockQuote();
	});


// We use the fake "PBL" symbol as default
var defaultSymbol = "GOOG";
var symbol = defaultSymbol;

// Fetch stock data for a given stock symbol (NYSE or NASDAQ only) from markitondemand.com
// & send the stock price back to the watch via app message
// API documentation at http://dev.markitondemand.com/#doc
function fetchStockQuote() {
	//running_flag = true;
	
	var response;
	var req = new XMLHttpRequest();
	// build the GET request
	req.open('GET', "http://dev.markitondemand.com/Api/Quote/json?" + "symbol=" + symbol, true);
	req.onload = function(e) {
		if (req.readyState == 4) {
			// 200 - HTTP OK
			if(req.status == 200) {
				console.log(req.responseText);
				response = JSON.parse(req.responseText);
				var price;
				if (response.Data) {
					var struct = {
						"1": true, 
						"2": response.Data.Symbol, 
						"3": roundPercent(response.Data.ChangePercent)
					};
					console.log("sending data to pebble " + JSON.stringify(struct));
					Pebble.sendAppMessage(struct);
				}
			} else {
				console.log("Request returned error code " + req.status.toString());
			}
		}
		
		//setTimeout(fetchStockQuote, 500);
	};
	req.send(null);
}

function roundPercent(long_float_string){
	var long_float = parseFloat(long_float_string);
	var short_float = long_float.toFixed(2);
	if (short_float > 0)
		return "+" + short_float.toString();
	else
		return short_float.toString();
}