from flask import Flask, request    #original directory is flash
import random, json, time     #separate directories from flask requires a new line
app = Flask(__name__)

dictStock = {'MMM': '3M Co', 'AXP': 'American Express Co', 'T': 'AT&T Inc', 'BA': 'Boeing Co', 'CAT': 'Caterpillar Inc', 'CVX': 'Chevron Corp',
    'CSCO': 'Cisco Systems Inc', 'KO': 'The Coca-Cola Co', 'DIS': 'Walt Disney Co', 'DD': 'E I du Pont de Nemours and Co', 'XON': 'Exxon Mobil Corp',
    'GE': 'General Electric Co', 'GS': 'Goldman Sachs Group Inc', 'HD': 'Home Depot Inc', 'IBM': 'International Business Machines Corp', 'INTC': 'Intel Corp',
    'JNJ': 'Johnson & Johnson', 'JPM': 'JPMorgan Chase and Co', 'MCD': "McDonald's Corp", 'MRK': 'Merck & Co Inc', 'MSFT': 'Microsoft Corp', 'NKE': 'Nike Inc',
    'PFE': 'Pfizer Inc', 'PG': 'Procter & Gamble Co', 'TRV': 'Travelers Companies Inc', 'UTX': 'United Technologies Corp', 'UNH': 'UnitedHealth Group Inc',
    'VZ': 'Verizon Communications Inc', 'V': 'Visa Inc', 'WMT': 'Wal-Mart Stores Inc', 'GOOG': 'Google Inc', 'AAPL': 'Apple Inc'}

@app.route('/checkSymbol')
def checkSymbol():
    x = request.args.get('symbol')  #Pass in a symbol as the argument
    if x is not None:
        if x in dictStock:
            return dictStock[x]
        else:
            return "Not found"
    else:
        return ""
	
@app.route('/')
def get_stock():
    x = request.args.get('Symbol')  #Pass in a symbol as the argument
    return str(x)
    #return "Symbol" along with other details

@app.route('/pebblestocksettings.html')     #Trace the route to 'pebblestocksettings.html'
def getPebbleStockSettings():
    return "<html><body>Hello world</body></html>"

@app.route('/stockHashTable')
def stockHashTable():
    getKey = request.args.get('input')

    #Give an error message if symbol is not in dictionary
    if getKey is not None:   #Check if the input is valid
        if dictStock.has_key(getKey):
            return str(dictStock[getKey])
        else:   #Give an error message if the Symbol is not in the dictionary
            return "Please enter a valid Symbol"
    else:   #Give an error message if there is no input or if input is incorrect
        return "Please input a Symbol"


@app.route('/randomPrice')
def generateRand():
    rand = (random.uniform(10.00, 100.00))    #Generate a random floating point number N such that a <= N <= b for a <= b and b <= N <= a for b < a.
    return round(rand, 2)

@app.route('/change')
def change():
    r_change = (random.uniform(-100.00, 100.00))
    return round(r_change, 2)

def changePercent():
    r_changePercent = (random.uniform(-7.00, 7.00))
    return round(r_changePercent, 2)

def marketCap():
    r_marketCap = (random.uniform(100000000000, 200000000000))
    return round(r_marketCap, 2)

def additionalChanges():
    r_additional_changes = random.uniform(500, 550)
    return round(r_additional_changes, 2)

def low():
    r_low = random.uniform(500, 525)
    return round(r_low, 2)

def high():
    r_high = random.uniform(525, 550)
    return round(r_high, 2)

def changePercentYTD():
    r_change_percent_YTD = random.uniform(-5, 5)
    return round(r_change_percent_YTD, 2)

def volume():
    r_volume = (random.uniform(200000, 250000))
    return round(r_volume, 2)

def timestamp():
    now = time.strftime("%c")
    return ("%s"  % now )

@app.route('/json')
def display():
    symbol = request.args.get('symbol')
    struct = {"Data":{"Status":"SUCCESS","Name": dictStock[symbol],"Symbol": symbol,"LastPrice": generateRand(),"Change": change(),
        "ChangePercent": changePercent(),"Timestamp": timestamp(),"MarketCap": marketCap(),"Volume": volume(),"ChangeYTD": additionalChanges(),
        "ChangePercentYTD": changePercentYTD(),"High": high(),"Low": low(),"Open":additionalChanges()}}
    return json.dumps(struct)

def main():
    display()

if __name__ == "__main__":
    main()
