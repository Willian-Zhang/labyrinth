'use strict';
class Board extends EventEmitter2{

    constructor(){
        super();
        this.serial = new p5.SerialPort();
        this.buffer = [];
        this.on('line', this.processLine.bind(this));
        this.on('point', this.processPoint.bind(this));
    }
    connect(options){
        // serial.on('data', serialEvent);  // callback for when new data arrives
        // serial.on('error', serialError); // callback for errors
        this.serial.on('connected', event=>this.emit('connected', event));
        this.serial.on('list', (portList)=>{
            let filtered = portList.filter(name=>name.startsWith('/dev/cu.usbmodem'));
            if(filtered.length == 0){
                throw new PositionError('No port found!');
            }else if(filtered.length == 1){
                this.serial.open(filtered[0], options);
                return filtered[0];
            }else{
                throw new PositionError('Mutiple ports found:'+string(filtered));
            }
        }); 
        this.serial.on('data', this.processData.bind(this));
        
        // I don't know why but this runs for deault 
        // this.list(); 
    }
    processData(){
        let code = this.serial.read();
        if(code==10){
            let buffer = this.buffer;
            this.buffer = [];
            this.emit('line', buffer);
        }else{
            this.buffer.push(code)
        }
    }
    processLine(buffer){
        this.emit('point', String.fromCharCode(...buffer).split('\t').map(s=>+s));
    }
    processPoint(point){
        // TODO:
    }
    disconnect(){
        // TODO:
        // server.removeListener('get', callback);
    }
}