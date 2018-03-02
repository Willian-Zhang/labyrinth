class HoleView{
    constructor(x, y, r_default=5, r_min=0.5, r_max=1.5, grow_speed=0.5) {
        this.x = x;
        this.y = y;
        this.r_default = r_default;
        this.r = this.r_default;
        this.r_max = r_default*r_max;
        this.r_min = r_default*r_min;
        this.brightness = 'rgba(255,255,255, 0.2)';
        this.grow = false;
        this.grow_speed = grow_speed;
        this.zoom = 1;
    }
    reset(){
        this.r =  this.r_default;

    }
    on(){
        this.brightness = 'rgba(0,255,0, 0.25)';
        this.zoom = 1.5;
    }
    off(){
        this.brightness = 'rgba(255,255,255, 0.2)';
        this.zoom = 1;
    }
    activate(){
        if(this.grow){
            // this.r += this.grow_speed;
            // if(this.r >= this.r_max){
            //     // this.grow = false;
                
            // }
        }else{
            this.r -= this.grow_speed;
            if(this.r <= this.r_min){
                // this.grow = true;
                this.r = this.r_max;
            }
        }
    }
    show(){
        stroke(255);
        strokeWeight(4);
        fill(this.brightness);
        ellipse(this.x, this.y, this.r * 2 * this.zoom);
    }
}