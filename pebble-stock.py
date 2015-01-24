from flask import Flask, request    #original directory is flash
import random     #separate directories from flask requires a new line
#import JSON
app = Flask(__name__)

@app.route('/')
def get_stock():
    x = request.args.get('Symbol')  #Pass in a symbol as the argument
    return str(x)
    #return "Symbol" along with other details

@app.route('/pebblestocksettings.html')     #Trace the route to 'pebblestocksettings.html'
def getPebbleStockSettings():
    return "<html><body>Hello world</body></html>"

@app.route('/stockHashTable/')
def stockHashTable():
    input = request.args.get('input')
    dictStock = open('stocks.txt', 'r')
    print dictStock.read()
    #Give an error message if symbol is not in dictionary
    if input is not None:   #Check if the input is valid
        if dictStock.has_key(input):
            return str(dictStock[input])
        else:   #Give an error message if the Symbol is not in the dictionary
            return "Please enter a valid Symbol"
    else:   #Give an error message if there is no input or if input is incorrect
        return "Please input a Symbol"

@app.route('/random')
def generateRand():
    rand = (random.uniform(10.0, 100.0))    #Generate a random floating point number N such that a <= N <= b for a <= b and b <= N <= a for b < a.
    return str(format(rand, '.2f'))     #Return the rounded value of the 'rand' variable as a string
