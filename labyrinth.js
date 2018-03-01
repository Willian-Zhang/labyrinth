'use strict';
function setup() {    
    let board = new Board();
    board.connect({baudrate: 9600});
    board.on('connected', e=>console.log(e))
    board.on('point', (point)=>{
        console.log(point[6]);
    });
}



function draw() {
  
}