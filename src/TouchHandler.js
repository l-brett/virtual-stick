
export default class TouchHandler {
    constructor(options) {
        let defaults = {
            'element': document.body,
            'start': (ev) => {},
            'move': (ev) => {},
            'end': (ev) => {}
        };
        this.options = Object.assign({}, defaults, options);

        this.startFn = (ev) => this.start(ev);
        this.moveFn = (ev) => this.move(ev);
        this.endFn = (ev) => this.end(ev);

        this.bindEvents();
    }

    bindEvents() {
        let el = this.options['element'];
        el.addEventListener('touchstart', this.startFn, false);
        el.addEventListener('touchmove', this.moveFn, false);
        el.addEventListener('touchend', this.endFn, false);
    }

    unbindEvents() {
        let el = this.options['element'];
        el.removeEventListener('touchstart', this.startFn);
        el.removeEventListener('touchmove', this.moveFn);
        el.removeEventListener('touchend', this.endFn);
    }

    start(event) {
        if(event.targetTouches.length == 1) {
            var touch = event.targetTouches[0];
            this.currentTouch = {
                identifier: touch.identifier,
                x:touch.pageX,
                y:touch.pageY
            };

            this.x = 0;
            this.y = 0;
            this.options.start(event);
        }
        event.preventDefault();
        return false;
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
        if(!this.currentTouch) return;
        let changedTouch = this.findTouch(event.changedTouches);
        
        if(changedTouch) {
            let changeX = changedTouch.pageX - this.currentTouch.x;
            let changeY = changedTouch.pageY - this.currentTouch.y;
            this.options.move(changeX, changeY);
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
        this.options.end(event);
        return false; 
    }
}