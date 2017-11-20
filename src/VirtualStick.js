import handler from './TouchHandler.js';
import TouchContainer from './TouchContainer.js';
import Stick from './Stick.js';

export const TouchHandler = handler;

export class VirtualStick {
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
            'track-stroke-size':2,
            'touch-handler': null
        }
        this.options = Object.assign({}, defaults, options);
        
        if(!this.options['touch-handler']) {
            this.options['touch-handler'] = new TouchHandler({'element': this.options.container});
        }

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

        this.options['touch-handler'].addStick(this);
    }

    start(touch) {
        this.stick.setPosition(touch.pageX, touch.pageY);
        this.stick.show();
        this.stick.start();
    }
    move(x, y) {
        this.stick.move(x, y);
    }
    end() {
        this.stick.hide();
        this.stick.end();
    }
    
    draw() {
        this.stick.draw();
    }
    
    unbind() {
        this.options['touch-handler'].removeStick(this);
    }

    getAxis() {
        return this.stick.getAxis();
    }
}

export default VirtualStick;