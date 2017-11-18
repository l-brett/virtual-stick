export default class TouchHandler {
    constructor(options) {
        let defaults = {
            'element': document.body,
            'start': (ev) => {},
            'move': (ev) => {},
            'end': (ev) => {},
            'width': 100,
            'height': 100,
            'left': 0,
            'top':0,
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

    inRange(x, y) {
        let containerBounds = this.options.element.getBoundingClientRect();
        let width = containerBounds.width * (this.options.width / 100);
        let height = containerBounds.height * (this.options.height / 100);
        let xMin = containerBounds.width * (this.options.left / 100);
        let yMin = containerBounds.width * (this.options.top / 100);
        
        if( x < xMin || x > xMin + width) return false;
        if( y < yMin || y > yMin + height) return false;
        return true;
    }

    start(event) {
        if(event.targetTouches.length == 1) {
            let touch = event.targetTouches[0];

            if(!this.inRange(touch.pageX, touch.pageY)) {
                return false;
            }

            this.currentTouch = {
                identifier: touch.identifier,
                x:touch.pageX,
                y:touch.pageY
            };

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
        if(!this.currentTouch) return;
        this.currentTouch = null;
        this.options.end(event);
        return false; 
    }
}