class HoleView{
    constructor(x, y, r_default=5, deacitivated = false, r_min=0.5, r_max=1.5, grow_speed=0.5) {
        this.x = x;
        this.y = y;
        this.r_default = r_default;
        this.r = this.r_default;
        this.r_max = r_default*r_max;
        this.r_min = r_default*r_min;
        this.color_base = '86,180,80';
        this.brightness = `rgba(${this.color_base}, 1)`
        if(deacitivated){
            this.color_base = '255,255,255';
        }
        this.grow = false;
        this.grow_speed = grow_speed;
        this.zoom = 1;
    }
    reset(){
        this.r =  this.r_default;

    }
    on(){
        this.color_base = '107,209,234';
        // this.brightness = 'rgba(107,209,234, 1)';
        this.zoom = 1.5;
    }
    off(){
        this.color_base = '86,180,80';
        // this.brightness = `rgba(${this.color_base}, 1)`
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
        stroke(`rgba(${this.color_base}, 0.5)`);
        strokeWeight(6);
        fill(`rgba(${this.color_base}, 1)`);
        ellipse(this.x, this.y, this.r * 2 * this.zoom);
    }
}