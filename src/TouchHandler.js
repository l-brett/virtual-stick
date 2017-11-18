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
            'sticks':[]
        };
        this.currentTouches = [];
        this.options = Object.assign({}, defaults, options);

        this.startFn = (ev) => this.start(ev);
        this.moveFn = (ev) => this.move(ev);
        this.endFn = (ev) => this.end(ev);

        this.bindEvents();
    }

    addStick(stick) {
        this.options.sticks.push(stick);
    }

    removeStick(stick) {
        let index = this.options.sticks.indexOf(stick);
        if(index >= -1) {
            this.options.sticks.splice(index, 1);
        }
    }

    bindEvents() {
        let el = this.options['element'];
        el.addEventListener('touchstart', this.startFn, {passive: false});
        el.addEventListener('touchmove', this.moveFn, {passive: false});
        el.addEventListener('touchend', this.endFn, {passive: false});
    }

    unbindEvents() {
        let el = this.options['element'];
        el.removeEventListener('touchstart', this.startFn);
        el.removeEventListener('touchmove', this.moveFn);
        el.removeEventListener('touchend', this.endFn);
    }

    inRange(x, y, stick) {
        let containerBounds = this.options.element.getBoundingClientRect();
        let width = containerBounds.width * (stick.options.width / 100);
        let height = containerBounds.height * (stick.options.height / 100);
        let xMin = containerBounds.width * (stick.options.left / 100);
        let yMin = containerBounds.width * (stick.options.top / 100);
        
        if( x < xMin || x > xMin + width) return false;
        if( y < yMin || y > yMin + height) return false;
        return true;
    }

    findStick(x, y) {
        let result = false;
        this.options.sticks.forEach(stick => {
            if(this.inRange(x, y, stick)) {
                result = stick;
            }
        });

        return result;
    }

    start(event) {
        console.log('Touch Started');
        
        for(let index = 0; index < event.targetTouches.length; index++) {
            let touch = event.targetTouches[index];
            this.addTouchToStick(touch);
        };
        event.preventDefault();
        return false;
    }

    addTouchToStick(touch) {
        let stick = this.findStick(touch.pageX, touch.pageY);
        if(stick && !this.findTouch(this.currentTouches, touch.identifier)){
            this.currentTouches.push({
                identifier: touch.identifier,
                stick: stick,
                x:touch.pageX,
                y:touch.pageY
            });
            stick.start(touch);
        }
    }

    findTouch(touches, touchIdentifier) {
        for(let index = 0; index < touches.length; index++) {
            if(touches[index].identifier == touchIdentifier) {
                return touches[index];
            }
        }
        return false;
    }

    endOldTouches(touches) {
        for(let i = 0; i  < this.currentTouches.length; i++) {
            if(!this.findTouch(touches, this.currentTouches[i].identifier)) {
                this.currentTouches[i].stick.end();
                this.currentTouches.splice(i,1);
            }
        }
    }

    move(event) {
        if(!this.currentTouches.length) return;
        for(let i = 0; i  < event.changedTouches.length; i++) {
            let changedTouch = event.changedTouches[i];
            let existingTouch = this.findTouch(this.currentTouches, changedTouch.identifier);
            if(existingTouch) {
                let changeX = changedTouch.pageX - existingTouch.x;
                let changeY = changedTouch.pageY - existingTouch.y;
                
                existingTouch.stick.move(changeX, changeY);
                existingTouch.x = changedTouch.pageX;
                existingTouch.y = changedTouch.pageY;
            }
        }
        event.preventDefault();
        return false;
    }

    end(event) {
        if(!this.currentTouches.length) return;
        this.endOldTouches(event.targetTouches);
        event.preventDefault();

        return false; 
    }
}