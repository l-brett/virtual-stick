export default class VirtualJoyStick {
    /**
     * Creates an instance of VirtualJoyStick.
     * @param {any} options 
     * @memberof VirtualJoyStick
     */
    constructor(options) {
        let defaults = {
            timeout: 250,
            'button-color': '#FFFFFF',
            'track-color': '#AAAAAA',
            'button-size': 30,
            'track-size': 50,
        }
        this.options = Object.assign({}, options, defaults);
        this.createCanvas();
    }

    createCanvas() {
        this.canvas = new Canvas();
        this.context = this.canvas.getContext('2D');
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
        document.body.appendChild(this.canvas);
    }

    draw() {
        if(!this._isAttached) return;

        this.drawCircle(
            this.options['track-size'] / 2,
            this.options['track-size'] / 2,
            this.options['track-size'],
            this.options['track-color']
        );

        this.drawCircle(
            this.options['track-size'] / 2,
            this.options['track-size'] / 2,
            this.options['button-size'],
            this.options['button-color']
        );
    }

    drawCircle(x, y, radius, fillColor) {
        this.context.arc(x,y,radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = fillColor;
        this.context.fill();
    }
}