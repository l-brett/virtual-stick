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
            'start': (ev) => this.stick.start(ev),
            'move': (x,y) => this.stick.move(x,y),
            'end': (ev) => this.stick.end(ev)
        });
    }
    
    draw() {
        this.stick.draw();
    }
}