function main (){
    //consolelog("Hello World");
    var screen = new Screen(1500,750,"#000000",20,10);
    screen.createCanvas();
    screen.fillCanvasWithFramingLines("#ad2929");
    screen.whenCanvasIsClickedCallBackCoordinates();

}

function consolelog(text){
    console.log(text);
}


class Screen {
    constructor(width, height, color, numberOfTilesX, numberOfTilesY){
        this.width = width;
        this.height = height;
        this.color = color;
        this.numberOfTilesX = numberOfTilesX;
        this.numberOfTilesY = numberOfTilesY;
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




    whenCanvasIsClickedCallBackCoordinates(){
        this.canvas.addEventListener("click", function(event){
            var x = event.offsetX;
            var y = event.offsetY;
            var coordinates = this.transformToCoordinates(x, y);
            consolelog(coordinates);
            this.fillTile(coordinates[0],coordinates[1],"ad2929");
            consolelog(this);
        }.bind(this));
    }

}