var initialized = false;
var options = {};


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
                          // Fetch saved symbol from local storage (using
                          // standard localStorage webAPI)
                          symbol = localStorage.getItem("symbol");
                          if (!symbol) {
                            symbol = "PBL";
                          }
                          var isInitMsg = true;
                          fetchStockQuote(symbol, isInitMsg);
                        });

// Set callback for appmessage events
Pebble.addEventListener("appmessage",
                        function(e) {
							 var msg = {};
							msg.init = true;
							msg.symbol = options.StockSymbol;
							//msg.symbol = "BRCM";
							msg.price = "40";
							//Pebble.sendAppMessage({1: true, 2: "QUAL", 3: "62.50"});
							fetchStockQuote("BRCM");
                         /* console.log("message");
                          var isInitMsg;
                          if (e.payload.init) {
                            isInitMsg = true;
                            fetchStockQuote(symbol, isInitMsg);
                          }
                          else if (e.payload.fetch) {
                            isInitMsg = false;
                            fetchStockQuote(symbol, isInitMsg);
                          }
                          else if (e.payload.symbol) {
                            symbol = e.payload.symbol;
                            localStorage.setItem("symbol", symbol);
                            isInitMsg = false;
                            fetchStockQuote(symbol, isInitMsg);
                          }*/
                        });


// We use the fake "PBL" symbol as default
var defaultSymbol = "GOOG";
var symbol = defaultSymbol;

// Fetch stock data for a given stock symbol (NYSE or NASDAQ only) from markitondemand.com
// & send the stock price back to the watch via app message
// API documentation at http://dev.markitondemand.com/#doc
function fetchStockQuote(symbol) {
  var response;
  var req = new XMLHttpRequest();
  // build the GET request
  req.open('GET', "http://dev.markitondemand.com/Api/Quote/json?" +
    "symbol=" + symbol, true);
  console.log("fetchStockQuote 1");
  req.onload = function(e) {
	  console.log("fetchStockQuote 2");
    if (req.readyState == 4) {
		console.log("fetchStockQuote 5");
      // 200 - HTTP OK
      if(req.status == 200) {
		  console.log("fetchStockQuote 6");
        console.log(req.responseText);
        response = JSON.parse(req.responseText);
        var price;
        if (response.Message) {
          // the markitondemand API sends a response with a Message
          // field when the symbol is not found
          Pebble.sendAppMessage({
            "price": "Not Found"});
        }
        if (response.Data) {
			console.log("fetchStockQuote 7");
			Pebble.sendAppMessage({1: true, 2: "QUAL", 3: "62.50"});
//           // data found, look for LastPrice
//           price = response.Data.LastPrice;
//           console.log(price);
// 
//           var msg = {};
//           //if (isInitMsg) {
//             msg.init = true;
//             msg.symbol = symbol;
//          // }
//           msg.price = "$" + price.toString();
//           Pebble.sendAppMessage(msg);
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
