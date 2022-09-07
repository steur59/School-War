//Variables
let canvas = document.createElement("canvas");

var numberOfTilesX = 192;
var numberOfTilesY = 108;
var cameraOffset = { x: window.innerWidth/2, y: window.innerHeight/2 }
var cameraZoom = 1;
var MAX_ZOOM = 100;
var MIN_ZOOM = 0.1;
var SCROLL_SENSITIVITY = 0.005;
var width = window.innerWidth;
var height = window.innerHeight;
var isDragging = false;
var dragStart = { x: 0, y: 0 };
var initialPinchDistance = null;
var lastZoom = cameraZoom;
var ctx = canvas.getContext("2d");

//Canvas



/*
canvas.addEventListener('mousedown', itself.onPointerDown(itself));
canvas.addEventListener('touchstart', (e) => itself.handleTouch(e, onPointerDown,itself));
canvas.addEventListener('mouseup', itself.onPointerUp);
canvas.addEventListener('touchend',  (e) => itself.handleTouch(e, onPointerUp,itself));
canvas.addEventListener('mousemove', itself.onPointerMove(itself));
canvas.addEventListener('touchmove', (e) => itself.handleTouch(e, onPointerMove(itself)));
*/
canvas.addEventListener( 'wheel', (e) => adjustZoom(e.deltaY*this.SCROLL_SENSITIVITY));
requestAnimationFrame( draw );

function draw(){
    canvas.width = width;
    canvas.height = height;
    fillCustom_CanvasWithFramingLines("#ad2929");
    whenCustom_CanvasIsClickedCallBackCoordinates();
    ctx.translate( window.innerWidth / 2, window.innerHeight / 2 );
    ctx.scale(cameraZoom, cameraZoom);
    ctx.translate( -window.innerWidth / 2 + cameraOffset.x, -window.innerHeight / 2 + cameraOffset.y );
    var x = 1;
    var y = 1;
    var coordinates = reverseTransformToCoordinates(x, y);
    var roundedCoordinates = roundLowCoordinates(coordinates);
    fillTile(roundedCoordinates[0], roundedCoordinates[1], user.getColor());
    requestAnimationFrame( draw );
}

function getEventLocation(e){
    if (e.touches && e.touches.length == 1){
        return { x:e.touches[0].clientX, y: e.touches[0].clientY };
    }
    else if (e.clientX && e.clientY){
        return { x: e.clientX, y: e.clientY };
    }
}

function adjustZoom(zoomAmount, zoomFactor) {
    if (!isDragging) {
        if (zoomAmount) {   
            cameraZoom += zoomAmount;
        }
        else if (zoomFactor) {
            cameraZoom = zoomFactor*lastZoom;
        }
        cameraZoom = Math.min( cameraZoom, MAX_ZOOM );
        cameraZoom = Math.max( cameraZoom, MIN_ZOOM );
    }
}

function fillCustom_CanvasWithFramingLines(color) {
    ctx.fillStyle = color;
    for(var i = 0; i < numberOfTilesX; i++){
        drawLine(i*width/numberOfTilesX,0,i*width/numberOfTilesX,height,color);
    }
    for(var i = 0; i < numberOfTilesY; i++){
        drawLine(0,i*height/numberOfTilesY,width,i*height/numberOfTilesY,color);
    }
}

function drawLine(x1, y1, x2, y2, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function fillTile(x, y, color){
    if(checkCoordinates(x, y)){
        ctx.fillStyle = color;
        ctx.fillRect(x*width/numberOfTilesX, y*height/numberOfTilesY, width/numberOfTilesX, height/numberOfTilesY);
    }
    else{
        console.log("Coordinates out of bounds");
    }
}

function checkCoordinates(x,y){
    if(x < numberOfTilesX && y < numberOfTilesY && x >= 0 && y >= 0){
        return true;
    }
    else{
        return false;
    }
}

function transformToCoordinates(x, y){
    return [x*width/numberOfTilesX, y*height/numberOfTilesY];
}

function reverseTransformToCoordinates(x, y){
    return [x/width*numberOfTilesX, y/height*numberOfTilesY];
}

function roundLowCoordinates([x, y]){
    return [Math.floor(x), Math.floor(y)];
}


function whenCustom_CanvasIsClickedCallBackCoordinates(){
    canvas.addEventListener("click", function(event){
        var x = event.offsetX;
        var y = event.offsetY;
        var coordinates = reverseTransformToCoordinates(x, y);
        var roundedCoordinates = roundLowCoordinates(coordinates);
        fillTile(roundedCoordinates[0], roundedCoordinates[1], user.getColor());
    }.bind(this));
}

    /*
    onPointerDown(e,itself) {
        itself.isDragging = true;
        console.log(itself);
        itself.dragStart.x = (itself.getEventLocation(e).x)/itself.cameraZoom - itself.cameraOffset.x;
        itself.dragStart.y = (itself.getEventLocation(e).y)/itself.cameraZoom - itself.cameraOffset.y;
    }
    
    onPointerUp(e,itself) {
        itself.isDragging = false
        itself.initialPinchDistance = null
        itself.lastZoom = itself.cameraZoom
    }
    
    onPointerMove(e,itself) {
        if (itself.isDragging) {
            itself.cameraOffset.x = itself.getEventLocation(e).x/itself.cameraZoom - itself.dragStart.x;
            itself.cameraOffset.y = itself.getEventLocation(e).y/itself.cameraZoom - itself.dragStart.y;
        }
    }
    
    handleTouch(e, singleTouchHandler,itself) {
        if ( e.touches.length == 1 ){
            itself.singleTouchHandler(e);
        }
        else if (e.type == "touchmove" && e.touches.length == 2){
            itself.isDragging = false;
            itself.handlePinch(e);
        }
    }
    

    
    handlePinch(e,itself) {
        e.preventDefault();
        var touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        var touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };
        var currentDistance = (touch1.x - touch2.x)**2 + (touch1.y - touch2.y)**2;
        if (itself.initialPinchDistance == null) {
            itself.initialPinchDistance = currentDistance;
        }
        else {
            itself.adjustZoom( null, currentDistance/itself.initialPinchDistance );
        }
    }
    */


class User {
    constructor(name, color){
        this.name = name;
        this.color = color;
    }


    colorAcceptedByCss(color){
        return color.startsWith('#') && color.length === 7;
    }

    editCustomColor(color){
        if(this.colorAcceptedByCss(color)){
            this.color = color;
        }
        else { 
            console.log( color + ' is not a valid color');
        }
    }

    editColor(color){
        this.color = color;
    }

    getColor(){
        return this.color;
    }
}

class MenuBar {
    constructor(){
        var menuBar = document.createElement("div");
        menuBar.style.backgroundColor = "grey";
        menuBar.style.width = "100%";
        menuBar.style.height = "20px";
        menuBar.style.position = "absolute";
        menuBar.style.bottom = "0px";
        menuBar.style.left = "0px";
        menuBar.style.zIndex = "1";
        document.body.appendChild(menuBar);
        this.menuBar = menuBar;
    }

    addButton(text, callback){
        var button = document.createElement("button");
        button.innerHTML = text;
        button.style.backgroundColor = "#ad2929";
        button.style.color = "#ffffff";
        button.style.width = "100px";
        button.style.height = "20px";
        //button.style.position = "absolute";
        button.style.top = "0px";
        button.style.left = "0px";
        button.style.zIndex = "1";
        button.addEventListener("click", callback);
        this.menuBar.appendChild(button);
    }
}

let user, menuBar;


function main (){
    console.log("Hello World");

    document.body.appendChild(canvas);



    user = new User("John", "white");


    
    menuBar = new MenuBar();
    menuBar.addButton("Custom Color", function(){
        var color = prompt("Enter a color");
        user.editCustomColor(color);
    }.bind(this));
    menuBar.addButton("white", function(){
        user.editColor("white");
    }.bind(this));
    menuBar.addButton("black", function(){
        user.editColor("black");
    }.bind(this));
    menuBar.addButton("blue", function(){
        user.editColor("blue");
    }.bind(this));
    menuBar.addButton("red", function(){
        user.editColor("red");
    }.bind(this));

}