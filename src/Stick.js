import TouchHandler from './TouchHandler.js';

export default class Stick {
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
            'factor': 0.02,
        }
        this.options = Object.assign({}, defaults, options);
        this._isAttached = false;
        this.x = 0;
        this.y = 0;

        this.startFn = (ev) => this.start(ev);
        this.moveFn = (x, y) => this.move(x, y);
        this.endFn = (ev) => this.end(ev);

        this.touchHandler = new TouchHandler({
            element: this.options['tracking-element'],
            start: this.startFn,
            move: this.moveFn,
            end: this.endFn
        });

        this.createCanvas();
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

    start(event) {
        if(!this._isAttached) return;

        this.x = 0;
        this.y = 0;
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
    move(changeX, changeY) {
        if(!this._isAttached) return;
            
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
    }

    end(event) {
        this.x = 0;
        this.y = 0;
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