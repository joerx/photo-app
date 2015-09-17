'use strict';

var PORT = process.env.port || 3000;

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var moment = require('moment');
var path = require('path');
var fs = require('fs');

var app = express();

app.use(morgan('combined'));

// app.use(bodyParser.raw({limit: '10mb'}));
app.post('/images', function(req, res, next) {

  var bufs = [], data = null;

  req.on('data', function(chunk) { bufs.push(chunk); });
  req.on('end', function() {

    data = Buffer.concat(bufs);
    var strData = data.toString('utf-8');
    var baseBuffer = new Buffer(strData, 'base64');

    console.log(data.length + ' bytes received');

    var fileName = path.normalize(__dirname + '/incoming/') 
      + moment().format('YYYYMMDD-hhmmss') + '.png';

    console.log('saving to ' + fileName);

    fs.writeFile(fileName, baseBuffer, function(err) {
      if (err) console.error(err);
      else {
        console.log(data.length + ' bytes written to ' + fileName);
        res.status(202).json({message: 'alright'});
      }
    });
  });

  
});

app.use(express.static('public'));

app.use(function(req, res, next) {
  res.status(404).send('<h1>Document Not Found!</h1>')
});

app.listen(PORT, function() { 
  console.log('Try http://localhost:' + PORT + '/') 
});
