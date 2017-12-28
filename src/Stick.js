import TouchHandler from './TouchHandler.js';

export default class Stick {
    /**
     * Creates an instance of VirtualJoyStick.
     * @param {any} options 
     * @memberof VirtualJoyStick
     */
    constructor(options) {
        let defaults = {
            'button-color': '#FF0000',
            'track-color': '#00FF0099',
            'button-size': 12.5,
            'button-stroke-size':0,
            'track-size': 15,
            'track-stroke-size':2,
            'track-stroke-color':'#FFFFFF',
            'track-stroke-size':2,
            'tracking-element': document.body,
        }
        this.options = Object.assign({}, defaults, options);
        this._isAttached = false;
        this.x = 0;
        this.y = 0;

        this.createCanvas();
    }
    /**
     * Creates the canvas
     * 
     * @memberof VirtualJoyStick
     */
    createCanvas() {
        this.ratio = window.devicePixelRatio;
        this.canvas = document.createElement('canvas');
        const dp1 = this.options['track-size'] + (this.options['track-stroke-size'] * 2);
        this.canvas.width = dp1 * this.ratio;
        this.canvas.height = dp1 * this.ratio;
        this.canvas.style.width = dp1 + 'px';
        this.canvas.style.height = dp1 + 'px';
        this.context = this.canvas.getContext('2d');
    }

    start(event) {
        if(!this._isAttached) return;

        this.x = 0;
        this.y = 0;
        this.px = 0;
        this.py = 0;
    }

    getAngle(x, y) {
        if(x == 0) {
            return 0;
        }
        return Math.atan(y/x);
    }

    getMultiplier(x) {
        return x < 0 ? -1 : 1;
    }

    getAxisDelta(x) {
        let multiplier = this.getMultiplier(x);
        return x * multiplier > 0.5 ? 1 * multiplier : 0
    }

    getAxis() {
        return {
            x: this.x,
            y: this.y,
            dx: this.getAxisDelta(this.x),
            dy: this.getAxisDelta(this.y)
        }
    }

    move(changeX, changeY) {
        
        if(!this._isAttached) return;
        this.px = this.px + changeX;
        this.py = this.py + changeY;

        let mag = Math.sqrt((this.px * this.px) + (this.py * this.py));

        let rads = this.getAngle(this.px, this.py);
        let maxX = Math.abs(Math.cos(rads));
        let maxY = Math.abs(Math.sin(rads));

        if(maxX == 1) {
            maxY = 1;
        }
        let trackRange = (this.options['track-size'] / (2 * this.ratio));
        let fx = Math.min(maxX, this.px / trackRange);
        let fy = Math.min(maxY, this.py / trackRange);
        this.x = Math.max(-maxX, fx);
        this.y = Math.max(-maxY, fy);
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

    setPosition(x, y) {
        this.canvas.style.position = 'absolute';
        let trackSize = (this.options['track-size'] / (2 * this.ratio));

        this.canvas.style.left = x - trackSize + 'px';
        this.canvas.style.top = y - trackSize + 'px';
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
        const trackSize = this.options['track-size'] / 2;
        this.drawCircle(
            trackSize + this.options['track-stroke-size'],
            trackSize + this.options['track-stroke-size'],
            trackSize,
            this.options['track-color'],
            this.options['track-stroke-size'] * this.ratio,
            this.options['track-stroke-color']
        );

        let trackRange = (this.options['track-size'] - this.options['button-size']) / 2;

        this.drawCircle(
            trackSize + (this.x * trackRange) + this.options['track-stroke-size'],
            trackSize + (this.y * trackRange) + this.options['track-stroke-size'],
            (this.options['button-size'] / 2),
            this.options['button-color'],
            this.options['button-stroke-size'] * this.ratio,
            this.options['button-stroke-color']
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
    drawCircle(x, y, radius, fillColor, strokeSize,strokeColor) {
        this.context.beginPath();
        this.context.arc(x,y,radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = fillColor;
        this.context.lineWidth = strokeSize;
        this.context.strokeStyle = strokeColor;
        this.context.fill();
        this.context.stroke();
    }
}