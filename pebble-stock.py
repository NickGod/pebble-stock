from flask import Flask, request    #original directory is flash
import random, json     #separate directories from flask requires a new line
app = Flask(__name__)

dictStock = {}

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

    global dictStock
    dictStock = {'MMM': '3M Co', 'AXP': 'American Express Co', 'T': 'AT&T Inc', 'BA': 'Boeing Co', 'CAT': 'Caterpillar Inc', 'CVX': 'Chevron Corp',
    'CSCO': 'Cisco Systems Inc', 'KO': 'The Coca-Cola Co', 'DIS': 'Walt Disney Co', 'DD': 'E I du Pont de Nemours and Co', 'XON': 'Exxon Mobil Corp',
    'GE': 'General Electric Co', 'GS': 'Goldman Sachs Group Inc', 'HD': 'Home Depot Inc', 'IBM': 'International Business Machines Corp', 'INTC': 'Intel Corp',
    'JNJ': 'Johnson & Johnson', 'JPM': 'JPMorgan Chase and Co', 'MCD': "McDonald's Corp", 'MRK': 'Merck & Co Inc', 'MSFT': 'Microsoft Corp', 'NKE': 'Nike Inc',
    'PFE': 'Pfizer Inc', 'PG': 'Procter & Gamble Co', 'TRV': 'Travelers Companies Inc', 'UTX': 'United Technologies Corp', 'UNH': 'UnitedHealth Group Inc',
    'VZ': 'Verizon Communications Inc', 'V': 'Visa Inc', 'WMT': 'Wal-Mart Stores Inc', 'GOOG': 'Google Inc', 'AAPL': 'Apple Inc'}

    #Give an error message if symbol is not in dictionary
    if getKey is not None:   #Check if the input is valid
        if dictStock.has_key(getKey):
            return str(dictStock[getKey])
        else:   #Give an error message if the Symbol is not in the dictionary
            return "Please enter a valid Symbol"
    else:   #Give an error message if there is no input or if input is incorrect
        return "Please input a Symbol"


@app.route('/random')
def generateRand():
    rand = (random.uniform(10.0, 100.0))    #Generate a random floating point number N such that a <= N <= b for a <= b and b <= N <= a for b < a.
    return str(format(rand, '.2f'))

@app.route('/json')
def display():
    symbol = request.args.get('symbol')
    struct = {"Data":{"Status":"SUCCESS","Name":"[dictStock[:symbol]]","Symbol":"[symbol]","LastPrice":541.98,"Change":4.68000000000006,"ChangePercent":0.871021775544401,"Timestamp":"Fri Jan 23 15:59:00 UTC-05:00 2015","MarketCap":183745311480,"Volume":215950,"ChangeYTD":530.66,"ChangePercentYTD":2.1331926280481,"High":545.2,"Low":536.82,"Open":538.6}}
    return json.dumps(struct)

def main():
    display()

if __name__ == "__main__":
    main()
