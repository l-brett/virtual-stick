# Virtual Stick
A virtual joystick for touch devices.


## Usage

Include the VirtualStick 

node:
```js
const VirtualStick = require('VirtualStick.js').VirtualStick;
```
es6:

```js
import {VirtualStick} from 'VirtualStick';
```

 Basic Usage:
```js
let controller = new VirtualStick(options);
```

Available Options:
```js
{
    'container': document.body, // The element to hook onto
    'left':0, // Touch Capture Area left offset as percentage
    'top':0, // Touch Capture Area top offset as percentage
    'width':100, // Touch Capture Area width as percentage
    'height':100, // Touch Capture Area Height as percentage
    'track-size':150, // The size of the area to move the button in
    'button-size': 80, // The size of the thumbstick
    'button-color':'#FFFFFF99',
    'button-stroke-color':'#FFFFFF',
    'button-stroke-size':2,
    'track-color':'#00000099',
    'track-stroke-color':'#FFFFFF',
    'track-stroke-size':2,
    'touch-handler': null // If not supplied, will create it's own. 
    //Used to define an external touch handler. Useful if you have more than 
    //one stick on the same element 
}
```

Getting data from the controller
```js
    let data = controller.getAxis();
```

This provides the following data:
```js
{
    x: 0.4, //position on x-axis (between -1 - 1)
    y: 0.4, //position on y-axis (between -1 - 1)
    dx: 1, // dpad x-axis (1,-1 or 0) 
    dy: 1, //dpad y-axis (1,-1 or 0)
}
```
Creating a twin stick controller:
```js

import {VirtualStick, TouchHandler} from 'VirtualStick';

let leftControl = new VirtualStick({
    container:document.getElementById('container'),
    width:50,
    'track-stroke-color':'#FF0000',
    'button-stroke-color':'#FF0000',
    'button-color':null
});

let rightControl = new VirtualStick({
    container:document.getElementById('container'),
    width:50,
    left:50,
    'track-stroke-color':'#0000FF',
    'button-stroke-color':'#0000FF',
    'button-color':null
});
```

Finally, drawing it:
```js
function gameLoop() {
    doOtherStuff();
    controller.draw();
}
```
Releasing touch events if no longer required
```js
controller.unbind();
```