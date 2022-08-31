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
    constructor(width, height, color, numberOfTilesX, numberOfTilesY,user){
        this.width = width;
        this.height = height;
        this.color = color;
        this.numberOfTilesX = numberOfTilesX;
        this.numberOfTilesY = numberOfTilesY;
        this.user = user;
    }
    createCanvas(){
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style.backgroundColor = this.color;
        document.body.appendChild(canvas);
        this.canvas=canvas;
    }
    fillCanvasWithFramingLines(color){
        var ctx = this.canvas.getContext("2d");
        ctx.fillStyle = color;
        for(var i = 0; i < this.numberOfTilesX; i++){
            this.drawLine(i*this.width/this.numberOfTilesX,0,i*this.width/this.numberOfTilesX,this.height,color);
        }
        for(var i = 0; i < this.numberOfTilesY; i++){
            this.drawLine(0,i*this.height/this.numberOfTilesY,this.width,i*this.height/this.numberOfTilesY,color);
        }

    editZoom(zoom){
        this.canvas.height = this.height*zoom;
        this.canvas.width = this.width*zoom;
        this.canvas.save();

    }

    drawLine(x1, y1, x2, y2, color){
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



    whenCanvasIsClickedCallBackCoordinates(){
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
    screen.createCanvas();
    screen.fillCanvasWithFramingLines("#ad2929");
    screen.whenCanvasIsClickedCallBackCoordinates();
    
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
    menuBar.addButton("zoom", function(){

        screen.updateCanvas();
    }.bind(this));
    menuBar.addButton("dezoom", function(){
        screen.height = screen.height/2;
        screen.width = screen.width/2;
        screen.updateCanvas();
    }.bind(this));



}