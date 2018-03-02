'use strict';

Array.prototype.argmax = function() {
    return this.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

class Board extends EventEmitter2{

    constructor(devices = []){
        super();
        this.serial = new p5.SerialPort();
        this.buffer = [];
        this.on('line', this.processLine.bind(this));
        this.on('point', this.processPoint.bind(this));
        this.devices = devices;
        // devices.map(c=>{
        //     if(c == Button || c == CapasitiveSensor){
        //         return c()
        //     }
        // });
        this.capacitors = this.devices.filter(d=>d instanceof CapasitiveSensor)
        this.buttons    = this.devices.filter(d=>d instanceof Button)
        this.last_some_capacitors_activated = false;
        this.collectedValues = null;
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
            this.buffer.push(code);
        }
    }
    processLine(buffer){
        this.emit('point', String.fromCharCode(...buffer).split('\t').map(s=>+s));
    }
    __collect_capacitor_values__(point){
        this.devices.map((device, i)=>{
            if(device instanceof CapasitiveSensor){
                this.collectedValues[i].push(point[i+1]);
            }
        });
    }
    start_reset(){
        this.collectedValues = this.devices.map((_)=>[]);
        this.on('point', this.__collect_capacitor_values__);
    }
    finish_reset(){
        this.off('point', this.__collect_capacitor_values__);
        console.log("reset values", this.collectedValues);
        this.devices.map((device, i)=>{
            if(device instanceof CapasitiveSensor){
                device.reset(this.collectedValues)
            }
        });
        this.collectedValues = this.devices.map((_)=>[]);
    }
    processPoint(point){
        this.devices.map((device, i)=>{
            if(device instanceof CapasitiveSensor||
               device instanceof Button){
                device.tick(point[i+1]);
            }
        });
        let someoneActivated = this.capacitors.some(capacitor => capacitor.state);
        console.log('someoneActivated', someoneActivated)
        // console.log('activated', this.capacitors.map(capacitor => capacitor.state))
        if(this.last_some_capacitors_activated != someoneActivated){
            if(someoneActivated){
                let which = this.capacitors.map(c=>c.value).argmax();
                this.emit('ball-in', which);
            }else{
                this.emit('ball-out');
            }
            this.last_some_capacitors_activated = someoneActivated;
        }
    }
    disconnect(){
        // TODO:
        // server.removeListener('get', callback);
    }
}