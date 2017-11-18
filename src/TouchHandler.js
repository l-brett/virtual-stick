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

    inRange(x, y, stick) {
        let containerBounds = this.options.element.getBoundingClientRect();
        let width = containerBounds.width * (stick.width / 100);
        let height = containerBounds.height * (stick.height / 100);
        let xMin = containerBounds.width * (stick.left / 100);
        let yMin = containerBounds.width * (stick.top / 100);
        
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
        
        for(let index in event.targetTouches) {
            let touch = event.targetTouches[index];
            this.addTouchToStick(touch);
        };
    }

    addTouchToStick(touch) {
        let stick = this.findStick(touch.pageX, touch.pageY);
        if(stick){
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
        for(var index in touches) {
            if(touches[index].identifier == touchIdentifier) {
                return touches[index];
            }
        }
        return false;
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
            } else {
                this.addTouchToStick(changedTouch);
            }
        }
    }

    end(event) {
        if(!this.currentTouches.length) return;
        this.currentTouches.forEach(ct => ct.stick.end(event));
        this.currentTouches = [];
        return false; 
    }
}