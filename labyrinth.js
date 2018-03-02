'use strict';
function setup() {  
    createCanvas(windowWidth,windowHeight);
   let board = new Board();
    board.connect({baudrate: 9600});
    board.on('connected', e=>console.log(e))
    board.on('point', (point)=>{
        console.log(point[6]);
    });
}



function draw() {
    rect(100,100,windowWidth-200,windowHeight-200); //full board
    rect(155,140,windowWidth/2.7,windowHeight/3.5); //top left
    rect(155,385,windowWidth/2.7,windowHeight/3.5); //bottom left
    rect(665,140,windowWidth/2.7,windowHeight/3.5); //top right
    rect(665,385,windowWidth/2.7,windowHeight/3.5); //bottom right
    
    //holes

    push();
    fill("green");
ellipse(125,125,50,50); //top left 
    pop();
    
    push();
    fill("red");
    ellipse(125,600,50,50); //bottom left
    ellipse(1160,600,50,50); //bottom right
    ellipse(1160,125,50,50);    //top right
    pop();
    
    push();
    fill("black");
    ellipse(650,365,50,50)
    pop();
}
