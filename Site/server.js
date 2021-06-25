// (c) copyright CGSG summer practice 2021
// web paint by AC1 and FB4
const { Socket } = require('dgram');
let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server);

let allFrame= Array();
let top = 0, right = 0, left = 0, bottom = 0;
let width = 0, height = 0;
let first = true;

app.get('/', (req, res) => {
  res.sendFile(`Z:/WebPaint/Site/index.html`);
})

io.on('connection', socket => {
  socket.on('Am I first to create', (msg) => {
    width = msg.w;
    height = msg.h;
    if (first) {
      first = false;
      allFrame = new Array(width * height).fill("#FFFFFF");
      right = width;
      bottom = height;
    } 
    else {
      frame = Array(width * height);
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          frame[j * width + i] =  allFrame[(i - left) +  width * (j - top)];
        }
      }
      /* test filling works */
      for (i = 0; i < 100; i++) {
        for (j = 0; j < 100; j++) {
          frame[i + width * j] = "#00FF00";
        }
      }
      socket.emit('Your first massive', frame);      
    }
  })
  
  socket.on('Get my frame and coordinates', (msg) => {  
    /* Get data */
    frame = msg.frame;
    x_cli = msg.x_cli; 
    y_cli = msg.y_cli;
    w_cli = msg.w_cli;
    h_cli = msg.h_cli;
    let newFrame;
    let oldLeft = left, oldRight = right, 
      oldTop = top, oldBottom = bottom;
    let oldWidth = width, oldHeight = height;
  
    /* check if  frame must be bigger */
    /* -> change Right, Left, Top, Bottom or not */
    if (x_cli < left) {
      left = x_cli;
    }
    if (y_cli < top) {
      top = y_cli;
    }
    if (x_cli + w_cli > right) {
      right = x_cli + w_cli;
    }
    if (y_cli + h_cli > bottom) {
      bottom = y_cli + h_cli;
    }
    width = right - left;
    height = bottom - top;
    /* creating new frame (copying, merging) */
    newFrame = Array(width * height).fill("#FFFFFF");
    /* merging */
    for (i = 0; i < width; i++) {
      for (j = 0; j < height; j++) {
        x = i + top;
        y = j + left; 
        if (x > x_cli && y > y_cli && x < x_cli + w_cli && y < y_cli + h_cli) {
          newFrame[x - left + (y - top) * width] = frame[x - x_cli * (y - y_cli) * w_cli];
        }
        else if (x > oldLeft && x < oldRight && y < oldBottom && y > oldTop) {
          newFrame[x - left + (y - top) * width] = allFrame[x - oldLeft + (y - oldTop) * oldWidth];
        }
      }
    } 
    allFrame = newFrame;
    msg = {frame: allFrame, w: width, h: height};
    io.emit('Get new frame if you can', msg);
  })  
})


server.listen(8080, () => {
  console.log('listening on 8080')
});
