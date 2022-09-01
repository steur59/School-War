function consolelog(text){
    console.log(text);
}

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
            consolelog( color + ' is not a valid color');
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


class Screen {
    constructor(numberOfTilesX, numberOfTilesY,user){
        this.numberOfTilesX = numberOfTilesX;
        this.numberOfTilesY = numberOfTilesY;
        this.user = user;
        this.cameraOffset = { x: window.innerWidth/2, y: window.innerHeight/2 }
        this.cameraZoom = 1
        this.MAX_ZOOM = 5
        this.MIN_ZOOM = 0.1
        this.SCROLL_SENSITIVITY = 0.0005
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.initialPinchDistance = null;
        this.lastZoom = this.cameraZoom;

        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");


        canvas.addEventListener('mousedown', this.onPointerDown);
        canvas.addEventListener('touchstart', (e) => this.handleTouch(e, onPointerDown));
        canvas.addEventListener('mouseup', this.onPointerUp);
        canvas.addEventListener('touchend',  (e) => this.handleTouch(e, onPointerUp));
        canvas.addEventListener('mousemove', this.onPointerMove);
        canvas.addEventListener('touchmove', (e) => this.handleTouch(e, onPointerMove));
        canvas.addEventListener( 'wheel', (e) => this.adjustZoom(e.deltaY*this.SCROLL_SENSITIVITY));

        document.body.appendChild(canvas);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;



        ctx.translate( window.innerWidth / 2, window.innerHeight / 2 )
        ctx.scale(this.cameraZoom, this.cameraZoom)
        ctx.translate( -window.innerWidth / 2 + this.cameraOffset.x, -window.innerHeight / 2 + this.cameraOffset.y )

        this.canvas=canvas;
        this.ctx=ctx;
    }

    
    getEventLocation(e){
        if (e.touches && e.touches.length == 1){
            return { x:e.touches[0].clientX, y: e.touches[0].clientY };
        }
        else if (e.clientX && e.clientY){
            return { x: e.clientX, y: e.clientY };
        }
    }

    
    onPointerDown(e) {
        this.isDragging = true
        this.dragStart.x = this.getEventLocation(e).x/this.cameraZoom - this.cameraOffset.x;
        this.dragStart.y = this.getEventLocation(e).y/this.cameraZoom - this.cameraOffset.y;
    }
    
    onPointerUp(e) {
        this.isDragging = false
        this.initialPinchDistance = null
        this.lastZoom = this.cameraZoom
    }
    
    onPointerMove(e) {
        if (this.isDragging) {
            this.cameraOffset.x = this.getEventLocation(e).x/this.cameraZoom - this.dragStart.x;
            this.cameraOffset.y = this.getEventLocation(e).y/this.cameraZoom - this.dragStart.y;
        }
    }
    
    handleTouch(e, singleTouchHandler) {
        if ( e.touches.length == 1 ){
            this.singleTouchHandler(e);
        }
        else if (e.type == "touchmove" && e.touches.length == 2){
            this.isDragging = false;
            this.handlePinch(e);
        }
    }
    

    
    handlePinch(e) {
        e.preventDefault();
        var touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        var touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };
        var currentDistance = (touch1.x - touch2.x)**2 + (touch1.y - touch2.y)**2;
        if (this.initialPinchDistance == null) {
            this.initialPinchDistance = currentDistance;
        }
        else {
            this.adjustZoom( null, currentDistance/this.initialPinchDistance );
        }
    }
    
    adjustZoom(zoomAmount, zoomFactor) {
        if (!this.isDragging) {
            if (zoomAmount) {
                this.cameraZoom += zoomAmount;
            }
            else if (zoomFactor) {
                this.cameraZoom = zoomFactor*this.lastZoom;
            }
            this.cameraZoom = Math.min( this.cameraZoom, this.MAX_ZOOM );
            this.cameraZoom = Math.max( this.cameraZoom, this.MIN_ZOOM );
        }
    }


    fillScreenWithFramingLines(color) {
        var ctx = this.canvas.getContext("2d");
        ctx.fillStyle = color;
        for(var i = 0; i < this.numberOfTilesX; i++){
            this.drawLine(i*this.width/this.numberOfTilesX,0,i*this.width/this.numberOfTilesX,this.height,color);
        }
        for(var i = 0; i < this.numberOfTilesY; i++){
            this.drawLine(0,i*this.height/this.numberOfTilesY,this.width,i*this.height/this.numberOfTilesY,color);
        }
    }

    drawLine(x1, y1, x2, y2, color) {
        var ctx = this.canvas.getContext("2d");
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    fillTile(x, y, color){
        if(this.checkCoordinates(x, y)){
            var ctx = this.canvas.getContext("2d");
            ctx.fillStyle = color;
            ctx.fillRect(x*this.width/this.numberOfTilesX, y*this.height/this.numberOfTilesY, this.width/this.numberOfTilesX, this.height/this.numberOfTilesY);
        }
        else{
            consolelog("Coordinates out of bounds");
        }
    }

    checkCoordinates(x,y){
        if(x < this.numberOfTilesX && y < this.numberOfTilesY && x >= 0 && y >= 0){
            return true;
        }
        else{
            return false;
        }
    }

    transformToCoordinates(x, y){
        return [x*this.width/this.numberOfTilesX, y*this.height/this.numberOfTilesY];
    }

    reverseTransformToCoordinates(x, y){
        return [x/this.width*this.numberOfTilesX, y/this.height*this.numberOfTilesY];
    }

    roundLowCoordinates([x, y]){
        return [Math.floor(x), Math.floor(y)];
    }



    whenScreenIsClickedCallBackCoordinates(){
        this.canvas.addEventListener("click", function(event){
            var x = event.offsetX;
            var y = event.offsetY;
            var coordinates = this.reverseTransformToCoordinates(x, y);
            var roundedCoordinates = this.roundLowCoordinates(coordinates);
            this.fillTile(roundedCoordinates[0], roundedCoordinates[1], this.user.getColor());
        }.bind(this));
    }

}





function main (){
    consolelog("Hello World");


    var user = new User("John", "white");

    var screen = new Screen(1500,750,"#000000",20,10,user);
    screen.fillScreenWithFramingLines("#ad2929");
    screen.whenScreenIsClickedCallBackCoordinates();
    
    var menuBar = new MenuBar();
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