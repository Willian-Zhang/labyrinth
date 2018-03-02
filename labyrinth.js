'use strict';

// var circle_img;
// var board_img;
function preload() {
    // circle_img = loadImage('image/sample-circle.png');
    // board_img = loadImage('image/sample-board.jpeg');
}

var margin = 0.1;
var board_ratio = 16/9;
var hole_to_board = 0.03;

var capacitors_to_view = {
    0: 0,
    1: 1,
    2: 2,
    3: 3
};
var capacitors = Object.keys(capacitors_to_view);

var hole_views = [];

let board_width;
let board_height;
let y0;

var on_hole = null; // i of capacitor
var target_hole = null;// i of capacitor

function setup() {   
    let button =  new Button();
    let devices = [
        button,
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
        button.on('press', ()=>{
            console.log('reseting...');
            board.start_reset();
        });
        button.on('release', ()=>{
            board.finish_reset();
            console.log('resetted.');
        });
        selectDifficulty()
    });
    board.on('warning', (warning)=>{
        console.warn(warning);
    });
    board.on('ball-in', (which)=>{
        console.log('ball-in', which);
        let view = capacitor_to_view(which);
        view.on();
        hit_hole(which);
        on_hole = which;
    });
    board.on('ball-out', ()=>{
        console.log('ball-out');
        if(on_hole !== null){
            let view = capacitor_to_view(on_hole);
            view.off();
        }
        on_hole = null;
    });

    createCanvas(windowWidth, windowHeight);
    {
        

        let x0 = margin*windowWidth;
        board_width = windowWidth - 2*x0;
        board_height = board_width /board_ratio;
        y0 = (windowHeight - board_height)/2;

        let button_size = hole_to_board * board_width;
        // orders here
        hole_views.push(new HoleView(x0, y0 , button_size))
        hole_views.push(new HoleView(x0, y0+board_height, button_size))
        hole_views.push(new HoleView(x0+board_width, y0, button_size))
        hole_views.push(new HoleView(x0+board_width, y0+board_height, button_size))
    }
}

function hit_hole(which){
    if(target_hole !== null){
        if(target_hole == which){
            next_round();
        }else{
            lose("Wrong hole!");
        }
    }
}
var blood_timeout = null;
var blood_interval = null;
var target_left = [];
var current_sec_spent = 0;
function next_round(){
    if(blood_timeout){
        clearTimeout(blood_timeout);
        blood_timeout = null;
    }
    if(blood_interval){
        clearInterval(blood_interval);
        blood_interval = null;
    }
    current_sec_spent = 0;

    let next_target = target_left.pop();
    if(next_target){
        target_hole = next_target;
        blood_timeout = setTimeout(function(){
            lose("Timeout!");
        }, total_timeout* 1000);
        blood_interval = setInterval(function(){
            current_sec_spent += 1;
            if(current_sec_spent > total_timeout){
                clearInterval(blood_interval);
                blood_interval = null;
            }else{
                set_blood((total_timeout - current_sec_spent)* 100/total_timeout)
            }
        }, 1000);
    }else{
        win()
    }
}
function capacitor_to_view(i){
    let which_view = capacitors_to_view[i];
    return hole_views[which_view];
}
function draw() {
    background(1);
    hole_views.forEach((hole, i)=>{
        if(hole === capacitor_to_view(target_hole)){
            hole.activate();
        }
        hole.show();
    })
}
function selectDifficulty(){
    swal("What do you want the difficulty to be?", {
        buttons: {
          hard: "Hard",
          normal: "Normal",
          easy: true,
        },
      })
      .then((value) => {
        switch (value) {
          case "hard":
            start(5, 10);
            break;
       
          case "normal":
            start(3, 30);
            break;
       
          default:
            start(2, 60);
        }
      });
}
var total_timeout = 30;

function start(rounds=3, timeout=30){
    console.warn(`Game started at ${rounds} rounds, each ${timeout}s timeout.`);
    total_timeout = timeout;
    target_left = []
    for (let index = 0; index < rounds; index++) {
        target_left.push(random(capacitors));
    }
    swal(`You will have ${rounds} rounds to win this game`, {
        icon: "info",
        button: "Go!",
        dangerMode: true
    }).then((value) => {
        next_round();
    });
}

function start_round(){

}
function win(){
    swal({
        title: "Win!",
        text: "You win the game!",
        icon: "success",
        button: "Restart",
    }).then((value) => {
        selectDifficulty()
    });
}
function lose(reason = 'Timeout'){
    swal({
        title: reason,
        text: "You fail the game!",
        icon: "warning",
        button: "Restart",
    }).then((value) => {
        selectDifficulty()
    });
}
function set_blood(value){
    $('#blood')[0].ldBar.set(value);
}


