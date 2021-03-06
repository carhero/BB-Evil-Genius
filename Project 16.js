var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var b = require('bonescript');

app.listen(1000);
// socket.io options go here
io.set('log level', 2);   // reduce logging - set 1 for warn, 2 for info,3 for debug
io.set('browser client minification', true);  // send minified client
io.set('browser client etag', true);  // apply etag caching logic basedon version number

console.log('Server running on: http://' + getIPAddress() + ':1000');
//pwm pin
var pwmPin1 = "P9_14";
var pwmPin2 = "P8_19";

//motor 1
var ain1Pin = "P9_13";
var ain2Pin = "P9_15";

//motor 2
var ain1Pin2 = "P8_10";
var ain2Pin2 = "P8_12";

// configure pins
b.pinMode(pwmPin1, b.OUTPUT);
b.pinMode(pwmPin2, b.OUTPUT);
b.pinMode(ain1Pin, b.OUTPUT);
b.pinMode(ain2Pin, b.OUTPUT);
b.pinMode(ain1Pin2, b.OUTPUT);
b.pinMode(ain2Pin2, b.OUTPUT);

function handler (req, res) {
  fs.readFile('Project 16.html',    // load html file
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}
 
io.sockets.on('connection', function (socket) {
  // listen to sockets and write analog values to PWM pins
  socket.on('pwmPin', function (data) {
      console.log(data);
      if (data.value >50){
          forwards((data/100 - 0.5) * 2);
          console.log("Forwards");
      }
      else {
          backwards ((0.5 - data/100) * 2);
          console.log("backwards");
      }
    });
});
     
function forwards(duty) {
    var value = duty;
   //Arm motors
    b.analogWrite(pwmPin1, value); 
    b.analogWrite(pwmPin2, value); 
   //Write values 
    b.digitalWrite(ain1Pin, 1);
    b.digitalWrite(ain2Pin, 0);
    b.digitalWrite(ain1Pin2, 1);
    b.digitalWrite(ain2Pin2, 0);
}

function backwards(duty) {
    var value = duty;
    //Arm motors
    b.analogWrite(pwmPin1, value); 
    b.analogWrite(pwmPin2, value);
    //Write values
    b.digitalWrite(ain1Pin, 0);
    b.digitalWrite(ain2Pin, 1);
    b.digitalWrite(ain1Pin2, 0);
    b.digitalWrite(ain2Pin2, 1);
}
// Get server IP address on LAN
function getIPAddress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' &&
      !alias.internal)
        return alias.address;
    }
  }
  return '0.0.0.0';
}
