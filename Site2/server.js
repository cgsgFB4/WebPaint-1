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
let color;

/* Geometry module */
 /* Put pixel to screen function */
function setPixel(x, y) {
  allFrame[x + y * width] = color
}

/* draw line to canvas function */
function line(x0, y0, x1, y1) {
  var dx = Math.abs(x1 - x0);
  var dy = Math.abs(y1 - y0);
  var sx = (x0 < x1) ? 1 : -1;
  var sy = (y0 < y1) ? 1 : -1;
  var err = dx - dy;
  while(true) {
      setPixel(x0, y0);
      if ((x0 === x1) && (y0 === y1)) { break };

      var e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0  += sx; }
      if (e2 < dx) { err += dx; y0  += sy; }
  }
}
/* End of geometry module */

app.get('/', (req, res) => {
  res.sendFile(`Z:/WebPaint/Site2/index.html`);
})

io.on('connection', socket => {
  socket.on('Am I first to create', (msg) => {
    width = msg.w;
    height = msg.h;
    if (first) {
      first = false;
      x = {r: 255, g:255, b:255, a:255}
      allFrame = new Array(width * height);
      for (i = 0; i < width * height; i++) {
        allFrame[i] = {...x};
      }
      right = width;
      bottom = height;
    } 
    else {
      frame = Array(width * height);
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          frame[j * width + i] = allFrame[(i - left) +  width * (j - top)];
        }
      }
      /* test filling works */
      /*for (i = 0; i < 25; i++) {
        for (j = 0; j < 25; j++) {
          frame[j * width + i].r = 0;
        }
      }
      */
      // frame[100 + 100 * width].b = 0;
      socket.emit('Your first massive', allFrame);      
    }
  });

  socket.on('line', msg => {
    color = msg.color;
    line(msg.x0, msg.y0, msg.x1, msg.y1);
    msg = {
      x0: msg.x0, 
      y0: msg.y0, 
      x1: msg.x1, 
      y1: msg.y1
    }
    io.emit('Draw line', msg);
  })
  // socket.on
});


server.listen(8080, () => {
  console.log('listening on 8080')
});
