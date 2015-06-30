"use strict";
// http://jsfiddle.net/m1erickson/n6U8D/
var canvas;
var ctx;
var canvasOffset;
var offsetX;
var offsetY;

var isDown = false;
var startX;
var startY;

var circle;
var rect;

var HEIGHT=500;
var WIDTH=500;

var mouseX;
var mouseY;

var rectangles=[];
var circles=[];

var numRect=3;
var numCirc=3;

var win=0;
function init(){

	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	canvas.height= HEIGHT;
	canvas.width= WIDTH;
	//ctx.strokeStyle = "black";
	canvasOffset = $("#canvas").offset();
	offsetX = canvasOffset.left;
	offsetY = canvasOffset.top;
	startX;
	startY;

	// circle = {
	//     x: 100,
	//     y: 290,
	//     r: 10
	// };
	// rect = {
	//     x: 100,
	//     y: 100,
	//     w: 40,
	//     h: 100
	// };
	$("#canvas").mousedown(function (e) {
    	handleMouseDown(e);
	});
	$("#canvas").mousemove(function (e) {
	    handleMouseMove(e);
	});
	$("#canvas").mouseup(function (e) {
	    handleMouseUp(e);
	});
	$("#canvas").mouseout(function (e) {
	    handleMouseOut(e);
	});

	for(var i=0; i<numRect;i++){
		var randNumX= Math.random()*WIDTH-10;
		var randNumY= Math.random()*HEIGHT-10;
		var obj= rectangle(i,randNumX,randNumY,100,100,"blue");
		rectangles.push(obj);
		// console.log("rectangle length:"+ rectangles);
	}
	for(var i=0; i<numCirc;i++){
		var randNumX= Math.random()*WIDTH-10;
		var randNumY= Math.random()*HEIGHT-10;
		var obj= makeCircle(i,randNumX,randNumY,20,"purple",false,false);
		circles.push(obj);
		// console.log("rectangle length:"+ rectangles);
	}
	update();
}

function update(){
	draw();

	if(circles.every(winCond)){
		console.log("winning");
	}
	
	// for(var i=0;i<numCirc;i++){
	// 	if(!circles[i].isCor){
	// 		return false;
			
	// 	}
	// 	else{
	// 		console.log("all true");
	// 		return true;
	// 	}
	// }
	// if(win==numRect){
	// 	console.log("WIN GAME");
	// }
	window.requestAnimationFrame(update);
	// console.log("updateing");
}

function winCond(value,index,ar){
	if(value.isCor==true){
		return true;
	}
	else{
		return false;
	}

}

function draw() {
	clear();
	// var randNumX= Math.random()*WIDTH-10
	for(var i=0; i<rectangles.length;i++){
		ctx.save();
		// ctx.fillStyle = "skyblue";
		ctx.fillStyle=rectangles[i].c;
		ctx.fillRect(rectangles[i].xPos, rectangles[i].yPos, rectangles[i].w, rectangles[i].h, rectangles[i].c);
		ctx.restore();
	}

	for(var i=0; i<circles.length;i++){
		ctx.fillStyle= circles[i].c;
		// ctx.fillStyle="orange";
		ctx.beginPath();
    	ctx.arc(circles[i].xPos, circles[i].yPos, circles[i].r, 0, Math.PI * 2);
    	ctx.closePath();
    	ctx.fill();
	}
}

// return true if the rectangle and circle are colliding
function RectCircleColliding(circle, rect) {

    var distX = Math.abs(circle.xPos - rect.xPos - rect.w / 2);
    var distY = Math.abs(circle.yPos - rect.yPos - rect.h / 2);

    if (distX > (rect.w / 2 + circle.r)) {
        return false;
    }
    if (distY > (rect.h / 2 + circle.r)) {
        return false;
    }

    if (distX <= (rect.w / 2)) {
        return true;
    }
    if (distY <= (rect.h / 2)) {
        return true;
    }

    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;

    if(dx * dx + dy * dy <= (circle.r * circle.r)){
    	//console.log("rect is touching circle");

    	return true;
    }
    else{
    	circle.c="green";
    }
}

function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);
    isDown=true;
	for(var i=0; i<circles.length;i++){
	    // Put your mousedown stuff here
	    var dx = startX - circles[i].xPos;
	    var dy = startY - circles[i].yPos;
	    if(dx * dx + dy * dy < circles[i].r * circles[i].r){
	    	circles[i].isDrag=true;
	    	//console.log*("circle is dragging");
	    }
	}
}

// EVENT HANDLERS
function handleMouseUp(e) {
    e.preventDefault();
    isDown = false;
    for(var i=0; i<circles.length;i++){
    	circles[i].isDrag=false;
    }

}

function handleMouseOut(e) {
    e.preventDefault();
    isDown = false;
}

function handleMouseMove(e) {
    e.preventDefault();
	// Put your mousemove stuff here
    if (!isDown) {
        return;
    }
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);
    var dx = mouseX - startX;
    var dy = mouseY - startY;
    startX = mouseX;
    startY = mouseY;
    for(var i=0; i<numCirc;i++){
	    if(circles[i].isDrag){

		    circles[i].xPos += dx;
		    circles[i].yPos += dy;
			for(var j=0; j<numRect;j++){
				// console.log(RectCircleColliding(circles[i], rectangles[j]));
				if (RectCircleColliding(circles[i], rectangles[j]) && conditionals(circles[i],rectangles[j])){
			        // console.log("Rect name: "+ rectangles[j].n + ", circ name: "+ circles[i].n);

			        break;
				}
				else{
					circles[i].isCor=false;
					circles[i].c="purple";
				}
			}
		}
	}
    draw();

    startX = mouseX;
    startY = mouseY;
}
function conditionals(a,b){
	if(a.n==b.n){
		a.c="skyblue";
		a.isCor=true;
		// console.log("yes");
		return true;
	}
	else if (a!=b){
		// a.c="red";
		// console.log("NO");
		return false;
	}
}
function rectangle(name,x,y,width,height, color){
	rect={
		n:name,
		xPos: x,
		yPos: y,
		w: width,
		h: height,
		c:color
	};

	return rect;
    // ctx.fillRect(rect.xPos, rect.yPos, rect.w, rect.h);
}

function makeCircle(name,x,y,radius,color,isDragging,isCorrect){
	circle={
		n:name,
		xPos: x,
		yPos:y,
		r:radius,
		c:color,
		isDrag:isDragging,
		isCor:isCorrect
	};

	return circle;
	// ctx.beginPath();
 //    ctx.arc(circle.xPos, circle.yPos, circle.r, 0, Math.PI * 2);
 //    ctx.closePath();
 //    ctx.fill();

}

function clear(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
// call init when window loads
window.onload=init;
