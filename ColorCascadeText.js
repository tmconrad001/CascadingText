/* Defintion of Color Schemes */
var rainbowColorArray = [new Color("red"), new Color("orange"), 
			 new Color("yellow"), new Color("green"),
			 new Color("blue"), new Color("indigo"),
			 new Color("violet")];
var redWhiteBlue = [new Color("red"), new Color("red"),
		    new Color("white"), new Color("white"),
		    new Color("blue"), new Color("blue")];
var blackwhite = [new Color("black"), new Color("white")];
var halloween = [new Color("orange"), new Color("black"),
		 new Color("black")];
var seaside = [new Color("blue"), new Color("teal"),
	       new Color("aqua")];
var rgb = [new Color("red"), new Color("green"),
	      new Color("blue")];

/* Default Settings */
var colorScheme = blackwhite;
//flatness:
//100 adjacent letters are nearly same color
//5 adjacent letters are further apart in the gradient
var flatness = 20; 
var stepSize=15;
//speed: seconds between color changes
var speed = 50;


var g; //array of ColorGradients
var c; //array of current Colors
var ID=["#letter1","#letter2","#letter3","#letter4",
	"#letter5","#letter6","#letter7"];

var changeColor = function() {
    for(var i=0; i<7; i++) {
	c[i]=g[i].next();
	$(ID[i]).css('color', c[i].toString());
    }
}

var changeScheme = function(colorScheme) {
    g=[];
    c=[]
    for(var i=0; i<7; i++) {
	var newGrad = new ColorGradient(stepSize,colorScheme);
	//newGrad.skipToPosition(((stepSize-1)*i)%newGrad.gradient.length);
	newGrad.skipToPosition(Math.floor(
	    newGrad.gradient.length*(i/flatness)));
	c.unshift(newGrad.next());
	g.unshift(newGrad);
    }
}

window.onload = function() {
    $("#options td").mouseover(function(){
	$(this).css('background-color','#DDDDDD');
    });
    $("#options td").mouseout(function(){
	$(this).css('background-color','white');
    });
    $("#white").click(function(){
	$("body").css('background-color','white');
    });
    $("#black").click(function(){
	$("body").css('background-color','black');
    });
    $("#gray").click(function(){
	$("body").css('background-color','#EEEEEE');
    });
    $("#red").click(function(){
	$("body").css('background-color','red');
    });
    $("#blue").click(function(){
	$("body").css('background-color','blue');
    });
    $("#green").click(function(){
	$("body").css('background-color','green');
    });
    $("#rainbow").click(function() {
	changeScheme(rainbowColorArray);
    });
    $("#patriotic").click(function() {
	changeScheme(redWhiteBlue);
    });
    $("#halloween").click(function() {
	changeScheme(halloween);
    });
    $("#seaside").click(function() {
	changeScheme(seaside)
    });
    $("#blackwhite").click(function() {
	changeScheme(blackwhite);
    });
    $("#rgb").click(function() {
	changeScheme(rgb);
    });
    changeScheme(rainbowColorArray);
    setInterval(function() {changeColor()}, speed);
}
