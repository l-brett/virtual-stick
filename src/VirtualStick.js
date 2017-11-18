import TouchHandler from './TouchHandler.js';
import TouchContainer from './TouchContainer.js';
import Stick from './Stick.js';

export default class VirtualStick {
    constructor(options) {
        const defaults = {
            'container': document.body,
            'left':0,
            'top':0,
            'width':100,
            'height':100,
            'track-size':150,
            'button-size': 80,
            'button-color':'#FFFFFF99',
            'button-stroke-color':'#FFFFFF',
            'button-stroke-size':2,
            'track-color':'#00000099',
            'track-stroke-color':'#FFFFFF',
            'track-stroke-size':2
        }
        this.options = Object.assign({}, defaults, options);

        this.container = new TouchContainer();
        this.stick = new Stick({
            'tracking-element':this.options.container,
            'button-size':this.options['button-size'],
            'button-color':this.options['button-color'],
            'track-color':this.options['track-color'],
            'track-size':this.options['track-size'],
            'track-stroke-color':this.options['track-stroke-color'],
            'track-stroke-size':this.options['track-stroke-size']
        });

        this.touchHandler = new TouchHandler({
            'element': this.options.container,
            'left':this.options.left,
            'top':this.options.top,
            'width':this.options.width,
            'height':this.options.height,
            'start': (ev) => this.start(ev),
            'move': (x,y) => this.stick.move(x,y),
            'end': (ev) => this.end()
        });
    }

    start(ev) {
        this.stick.setPosition(ev.touches[0].pageX,ev.touches[0].pageY);
        this.stick.show();
        this.stick.start();
    }

    end() {
        this.stick.hide();
        this.stick.end();
    }
    
    draw() {
        this.stick.draw();
    }

    getAxis() {
        return this.stick.getAxis();
    }
}