import TouchHandler from './TouchHandler.js';
import TouchContainer from './TouchContainer.js';
import Stick from './Stick.js';

export default class VirtualStick {
    constructor() {
        this.container = new TouchContainer();
        this.stick = new Stick({
        });
        this.touchHandler = new TouchHandler({
            'element': document.body,
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