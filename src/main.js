import {Screen} from './canvas.js';

function main (){
    //consolelog("Hello World");
    var screen = new Screen(1500,750,"#000000",200,10);
    screen.createCanvas();
    screen.fillCanvasWithFramingLines("#ad2929");
    screen.whenCanvasIsClickedCallBackCoordinates();

}

function consolelog(text){
    console.log(text);
}