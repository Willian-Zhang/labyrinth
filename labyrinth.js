'use strict';

function setup() {   
    let button =  new Button();
    let devices = [
        button,
        new CapasitiveSensor(),
        new CapasitiveSensor(),
        new CapasitiveSensor(),
        new CapasitiveSensor(),
        new CapasitiveSensor()
    ];
    let board = new Board(devices);
    let port = board.connect({baudrate: 9600});
    console.log(`Connecting on ${port}...`)
    board.on('connected', ()=>{
        console.log('connected');
        button.on('press', ()=>board.start_reset());
        button.on('release', ()=>board.finish_reset());
    });
    board.on('warning', (warning)=>{
        console.warn(warning);
    });
    board.on('ball-in', (which)=>{
        console.log('ball-in', which);
    });
    board.on('ball-out', ()=>{
        console.log('ball-out');
    });
}



function draw() {
  
}