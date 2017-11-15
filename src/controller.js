export default class VirtualJoyStick {
    /**
     * Creates an instance of VirtualJoyStick.
     * @param {any} options 
     * @memberof VirtualJoyStick
     */
    constructor(options) {
        let defaults = {
            timeout: 250,
            'button-color': '#FF0000',
            'track-color': '#00FF0099',
            'button-size': 100,
            'track-size': 150,
            'tracking-element': document.body,
            'factor': 0.01,
        }
        this.options = Object.assign({}, defaults, options);
        this._isAttached = false;
        this.x = 0;
        this.y = 0;
        this.createCanvas();
        this.bindEvents();
        this.show();
    }
    /**
     * Creates the canvas
     * 
     * @memberof VirtualJoyStick
     */
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.options['track-size'];
        this.canvas.height = this.options['track-size'];
        this.context = this.canvas.getContext('2d');
    }

    bindEvents() {
        let el = this.options['tracking-element'];
        el.addEventListener('touchstart', (ev) => this.start(ev), false);
        el.addEventListener('touchmove', (ev) => this.move(ev), false);
        el.addEventListener('touchend', (ev) => this.end(ev), false);
    }

    start(event) {
        if(!this._isAttached) return;

        if(event.targetTouches.length == 1) {
            var touch = event.targetTouches[0];
            this.currentTouch = {
                identifier: touch.identifier,
                x:touch.pageX,
                y:touch.pageY
            };

            this.x = 0;
            this.y = 0;
        }
        event.preventDefault();
        return false;
    }

    getAngle(x, y) {
        if(x == 0) {
            return 0;
        }
        return Math.atan(y/x);
    }
    findTouch(touches) {
        for(var index in touches) {
            if(touches[index].identifier == this.currentTouch.identifier) {
                return touches[index];
            }
        }
        return false;
    }
    move(event) {
        if(!this._isAttached) return;
        if(!this.currentTouch) return;
        let changedTouch = this.findTouch(event.changedTouches);
        
        if(changedTouch) {
            let changeX = changedTouch.pageX - this.currentTouch.x;
            let changeY = changedTouch.pageY - this.currentTouch.y;
            
            let fx = changeX * this.options['factor'];
            let fy = changeY * this.options['factor'];


            let px =  this.x + fx;
            let py = this.y + fy

            let rads = this.getAngle(px, py);
            let maxX = Math.abs(Math.cos(rads));
            let maxY = Math.abs(Math.sin(rads));

            this.x = Math.min(maxX, px);
            this.y = Math.min(maxY, py);
            this.x = Math.max(-maxX,this.x);
            this.y = Math.max(-maxY,this.y);

            this.currentTouch.x = changedTouch.pageX;
            this.currentTouch.y = changedTouch.pageY;
        }

        event.preventDefault();
        return false;
    }

    end(event) {
        this.currentTouch = null;
        this.x = 0;
        this.y = 0;
        return false; 
    }

    /**
     * Hides the joystick
     * 
     * @memberof VirtualJoyStick
     */
    hide() {
        this._isAttached = false;
        this.canvas.parentNode.removeChild(this.canvas);
    }

    /**
     * Shows the joystick
     * 
     * @memberof VirtualJoyStick
     */
    show() {
        this._isAttached = true;
        this.options['tracking-element'].appendChild(this.canvas);
    }
    /**
     * Renders a frame
     * 
     * @returns 
     * @memberof VirtualJoyStick
     */
    draw() {
        if(!this._isAttached) return;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCircle(
            this.options['track-size'] / 2,
            this.options['track-size'] / 2,
            this.options['track-size'] / 2,
            this.options['track-color']
        );

        let trackRange = (this.options['track-size'] - this.options['button-size']) / 2;

        this.drawCircle(
            (this.options['track-size'] / 2) + (this.x * trackRange),
            (this.options['track-size'] / 2) + (this.y * trackRange),
            this.options['button-size'] / 2,
            this.options['button-color']
        );
    }
    /**
     * Draws a circle
     * 
     * @param {any} x 
     * @param {any} y 
     * @param {any} radius 
     * @param {any} fillColor 
     * @memberof VirtualJoyStick
     */
    drawCircle(x, y, radius, fillColor) {
        this.context.beginPath();
        this.context.arc(x,y,radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = fillColor;
        this.context.lineWidth = 0;
        this.context.fill();
    }
}