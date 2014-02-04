/*
 * ColorGradient.js
 * Defines the Color and ColorGradient classes along with a couple of utility
 * functions for doing decimal/hexadecimal conversions with small numbers
 */

//Convert hex numbers 0-255 to decimal
var hexToDec = function(hex) 
{
    var hexDigitToDec = function(hexDigit) 
    {
	var map = {0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,
		   "A":10,"B":11,"C":12,"D":13,"E":14,"F":15};
	return +map[hexDigit];
    }
    return hexDigitToDec(hex[1]) + 16*hexDigitToDec(hex[0]);
}

//Convert decimal numbers 0-255 to hexadecimal
var decToHex = function(dec) 
{
    var map = {0:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9",
	       10:"A",11:"B",12:"C",13:"D",14:"E",15:"F"};
    var d1 = map[Math.floor(dec/16)];
    var d2 = map[dec%16];
    return d1+d2;
}

//Convert a hexadecimal color code to an object containing its constituent
//colors in decimal form
var getColors = function(colorCode) 
{
    var colors = {};
    
    colors["red"] = hexToDec(colorCode.substr(1,3));
    colors["green"] = hexToDec(colorCode.substr(3,5));
    colors["blue"] = hexToDec(colorCode.substr(5));
    return colors;
}

//Color Class
//constructed from HTML color code with color values in decimal form (0-255).
//Values will be automatically rounded to the nearest integer.
//Alternatively, construct from a single string:
//an HTML color code string ("#00FF4B"), or
//one of the following colors: 
//white, silver, gray, black, red, maroon, yellow, green, 
//aqua, teal, blue, navy, purple, violet, indigo, orange, or pink.
//inputting invalid arguments results in the creation of a black Color object,
//no warnings/exceptions
//input is not case sensitive
function Color()
{
    var colors = {
	"white":"#FFFFFF",
	"silver":"#C0C0C0",
	"gray":"#808080",
	"black":"#000000",
	"red":"#FF0000",
	"maroon":"#800000",
	"yellow":"#FFFF00",
	"lime":"#00FF00",
	"green":"#00FF00",
	"aqua":"#00FFFF",
	"teal":"#008080",
	"blue":"#0000FF",
	"navy":"#000080",
	"purple":"#800080",
	"violet":"#8F00FF",
	"indigo":"#4B0082",
	"orange":"#FF7F00",
	"pink":"#F660AB",
    }
    //In case RGB values entered seperately, in decimal form
    var r = Math.round(arguments[0]);
    var g = Math.round(arguments[1]);
    var b = Math.round(arguments[2]);
    var colorCodePattern = /^#[ABCDEF0-9]{6}$/;
    if(typeof arguments[0]==="string" && arguments[0].toLowerCase() in colors)
    {
	arguments[0] = colors[arguments[0]];
    }
    if(typeof arguments[0]==="string" && arguments[0].charAt(0)==="#" &&
      arguments[0].length==7 && arguments[0].match(colorCodePattern))
    {
	this.red = hexToDec(arguments[0].substr(1,3).toUpperCase());
	this.green = hexToDec(arguments[0].substr(3,5).toUpperCase());
	this.blue = hexToDec(arguments[0].substr(5).toUpperCase());
	return;
    }
    else if(typeof r==="number" && typeof g==="number" &&
	    typeof g==="number" && Math.min(r,g,b)>=0 && Math.max(r,g,b)<=255)
    {
	this.red = r;
	this.green = g;
	this.blue = b;
    }
    else { this.red=0; this.green=0; this.blue=0; }
}

//Returns HTML color code
Color.prototype.toString = function()
{
    var str="#";
    str += decToHex(this.red);
    str += decToHex(this.green);
    str += decToHex(this.blue);
    return str;
}

/*
//Sets red color to closest integer to the argument
Color.prototype.setRed(val)
{
    this.red = Math.round(val);
}

//Sets green color to closest integer to the argument
Color.prototype.setGreen(val)
{
    this.green = Math.round(val);
}

//Sets blue color to closest integer to the argument
Color.prototype.setBlue(val)
{
    this.blue = Math.round(val);
}
*/

//Creates a color gradient from this color and a second color
//Arguments: steps: number of colors in the gradient (at least 2),
//   color: color at the "end" of the gradient
//Returns: array of colors in the gradient
Color.prototype.twoColorGradientArray = function(steps, color) 
{
    var gradient=[];
    var r = this.red; var g = this.green; var b = this.blue;
    var step = [(color.red-this.red)/(steps-1), 
		(color.green-this.green)/(steps-1),
		(color.blue-this.blue)/(steps-1)];
    var latestColor = new Color(r,g,b);
    for(var i=0; i<steps; i++)
	{
	    gradient.push(latestColor);
	    r+=step[0]; g+=step[1]; b+=step[2];
	    latestColor = new Color(r,g,b);
	}
    return gradient;
}

//Create a ColorGradient data structure with the specified range of colors and
//the specified number of steps between each pair of colors in the sequence.
//The number of steps should be an integer greater than one
//The colors specified as an array of Colors (of at least length two)
function ColorGradient(steps, arrayOfColors)
{
    this.gradient=[];
    this.position=0;
    this.gradientSize=0;
    var l = arrayOfColors.length;
    var addNewColors = function(gradient,c1,c2)
    {
	var newColors = c1.twoColorGradientArray(steps,c2);
	newColors.pop();
	while(newColors.length>0)
	{
	    gradient.push(newColors.shift());
	}
    }
    for(var i=0; i<(l-1); i++)
    {
	addNewColors(this.gradient,arrayOfColors[i],arrayOfColors[i+1]);
    }
    addNewColors(this.gradient,arrayOfColors[l-1],arrayOfColors[0]);
}

//resets the gradient sequence to the first Color in the sequence
ColorGradient.prototype.resetGradient = function() { this.position=0; }

//Returns the next Color in the gradient sequence
ColorGradient.prototype.next = function()
{
    var ret = this.gradient[this.position];
    if(++this.position>=this.gradient.length) this.resetGradient();
    return ret;
}

//Skip to some position in the gradient sequence
//Specifying an invalid position has no effect
ColorGradient.prototype.skipToPosition = function(n) {
    if(this.gradient[n]) this.position=n;
}
