'use strict';

function setup() {   
    let button =  new Button()
    let devices = [
        button,
        new CapasitiveSensor(),
        new CapasitiveSensor(),
        new CapasitiveSensor(),
        new CapasitiveSensor(),
        new CapasitiveSensor()
    ]
    let board = new Board(devices);
    board.connect({baudrate: 9600});
    board.on('connected', e=>console.log(e))
    // board.on('point', (point)=>{
    //     console.log(point);
    // });
    board.on('ball-in', (which)=>{
        console.log('ball-in', which);
    });
    board.on('ball-out', ()=>{
        console.log('ball-out');
    });
    button.on('press', ()=>board.start_reset());
    button.on('release', ()=>board.finish_reset());
}



function draw() {
  
}