export default class TouchContainer {
    constructor(options) {
        let defaults = {
            'container': document.body,
            'width': 100,
            'height': 100,
            'left': 0,
            'top':0
        };
        this.options = Object.assign({}, defaults, options);
        this.createElement();
    }
    createElement() {
        this.el = document.createElement('div');
        var rect = this.options.container.getBoundingClientRect();
        this.el.style.position='absolute';
        this.el.style.width = this.options.width + 'vw';
        this.el.style.height = this.options.height + 'vh';
        this.el.style.left = this.options.left + 'vw';
        this.el.style.top = this.options.top + 'vh';
        this.el.style.background= "#999999AA";
        this.options.container.appendChild(this.el);
    }
}