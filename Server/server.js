// (c) copyright CGSG summer practice 2021
// web paint by AC1 and FB4
const express = require('express');
//const bodyParser= require('body-parser')
const app = express();

//app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  // console.log();
  // res.sendFile(`Z:/WebPaint/Site/index.css`);
  res.sendFile(`Z:/WebPaint/Site/index.html`);
  })

app.listen(8080, function() {
  console.log('listening on 8080');
}); 
