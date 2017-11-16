import TouchHandler from './TouchHandler.js';
import TouchContainer from './TouchContainer.js';
import Stick from './Stick.js';

export default class VirtualStick {
    constructor() {
        this.container = new TouchContainer();
        this.stick = new Stick({
            'tracking-element': this.container.el
        });
        this.touchHandler = new TouchHandler({
            'element': this.container.el,
            'start': (ev) => this.start(ev),
            'move': (x,y) => this.stick.move(x,y),
            'end': (ev) => this.end()
        });
    }

    start() {
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
}