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
	running_flag = true;
	
	var response;
	var req = new XMLHttpRequest();
	// build the GET request
	req.open('GET', "http://dev.markitondemand.com/Api/Quote/json?" + "symbol=" + symbol, true);
	console.log("fetchStockQuote 1");
	req.onload = function(e) {
		if (req.readyState == 4) {
			// 200 - HTTP OK
			if(req.status == 200) {
				console.log(req.responseText);
				response = JSON.parse(req.responseText);
				var price;
				if (response.Message) {
					// the markitondemand API sends a response with a Message
					// field when the symbol is not found
					Pebble.sendAppMessage({"price": "Not Found"});
				}
				if (response.Data) {
					Pebble.sendAppMessage({1: true, 2: "QUAL", 3: "62.50"});
				}
			} else {
				console.log("Request returned error code " + req.status.toString());
			}
		}
	};
	console.log("fetchStockQuote 3");
	req.send(null);
	console.log("fetchStockQuote 4");
}
