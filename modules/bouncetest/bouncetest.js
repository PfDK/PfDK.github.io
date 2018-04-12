"use strict"

var canvas = document.createElement("canvas");
canvas.style.border = "2px solid black";
canvas.style.width = "100%";

var CANVAS_WIDTH = canvas.width;
var CANVAS_HEIGHT = canvas.height;

document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

resize();

// Handle inputs ------------------------------------------------------------
var keydown = {};
var keypress = {};
var mouse = {x: 0, y: 0};
var mousepress = {};
var mousedown = {};

document.addEventListener("keydown", function(event) {
    keydown[event.code] = true;

    if(!event.repeat) {
        keypress[event.code] = true;
    } else {
        keypress[event.code] = false;
    }
});

document.addEventListener("keyup", function(event) {
    keydown[event.code] = false;
    keypress[event.code] = false;
});

document.addEventListener('mousemove', function(event) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});

function sendResizeMessageToParent()
{
    var h =  document.documentElement.offsetHeight;
    console.log("pfdkautoresize:" + h);
    console.log("canvas.clientheight:" + canvas.clientHeight);
    console.log("canvas.height:" + canvas.height);
    console.log("canvas.offsetHeight:" + canvas.offsetHeight);
    console.log("canvas.scrollHeight:" + canvas.scrollHeight);
    console.log("document.body.offsetHeight:" + document.body.offsetHeight);
    console.log("document.documentElement.offsetHeight:" + document.documentElement.offsetHeight);
    
	var obj = { "Sender":"pfdkautoresize", "Height":h};
 	var myJSON = JSON.stringify(obj);
	window.parent.postMessage(myJSON, '*');
};

window.addEventListener('resize', function() {
	sendResizeMessageToParent();
});

function resize() {
  // Lookup the size the browser is displaying the canvas.
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;
 
  // Check if the canvas is not the same size.
  if (canvas.width  != displayWidth ||
      canvas.height != displayHeight) {
 
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
    CANVAS_WIDTH = canvas.width;
    CANVAS_HEIGHT = canvas.height;
  }
  sendResizeMessageToParent();
}

function keyPressed(str) {
    var result = keypress[str];
    if(result) {
        keypress[str] = false;
        return true;
    } 
    return false;
}

function keyDown(str) {
    if(keydown[str]) return true;
    else return false;
}

function mouseDown(str) {

}

function mousePressed(str) {
    
}


// 2D Primitives ------------------------------------------------------------
function rect(x,y,w,h) {
    ctx.fillRect(x,y,w,h);
}

function line(x0,y0, x1,y1) {

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1,y1);
    ctx.stroke();
}

function triangle(x0,y0, x1,y1, x2,y2) {

}

function quad(x0,y0, x1,y1, x2,y2, x3,y3) {

}

// Sprites ------------------------------------------------------------------
function Sprite(filepath) {
    this.x = 0;
    this.y = 0;
    this.img = new Image();
    this.img.src = filepath;
}

Sprite.prototype.draw = function() {
    ctx.drawImage(this.img, this.x, this.y);
};

Sprite.prototype.collide = function(sprite) {
    return !(this.x > sprite.x + sprite.img.width ||
             this.x + this.img.width < sprite.x ||
             this.y > sprite.y + sprite.img.height ||
             this.y + this.img.height < sprite.y);
}

//---------------------------------------------------------------------------
var x = 0;
var y = 100;

var vy = -350;
var vx = 150;

var ay = 800;


//---------------------------------------------------------------------------

function update(dt) {
    vy += ay*dt;

    x += vx*dt;
    y += vy*dt;

    if(y >= CANVAS_HEIGHT - 25) {
        y = CANVAS_HEIGHT - 25;
        vy = -vy*0.6;
    }

    if(x >= CANVAS_WIDTH) {
        x = 0;
        y = 100;
        vy = -350;
    }
}

function render() {
    ctx.fillRect(x,y,25,25);
}

if(typeof(update) == "function" && typeof(render) == "function") {
    var oldtime = window.performance.now()
    var dt;
    var step = 1/60;
    var acc = 0;
    function mainLoop(){
        var newtime = window.performance.now();
        dt = Math.min(1, (newtime - oldtime) / 1000);

        acc += dt;

        while(acc >= step) {
            acc -= step;
            update(step);
        }
        
        ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
        render();

        oldtime = newtime;
        window.requestAnimationFrame(mainLoop);
    };
    window.requestAnimationFrame(mainLoop);
}  
