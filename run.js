var arDrone = require('ar-drone');
var client  = arDrone.createClient();
var cv = require('opencv')

var lastPng;
var pic;
var count = 0;

// find the faces, save the jpgs.
var snap = function(picture){   
  cv.readImage(picture, function(err, im){
    im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
    for (var i=0;i<faces.length; i++){
        var x = faces[i]
        im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
        // if the face is too small, don't save it.
        if (x.height > 80) {
          count ++;
          im.save('./face' + count + '.jpg');
          console.log("found face");
        } else {
          console.log("face too small");
        }
      }
    });
  })
} 

// Here we go...
client.takeoff();
console.log("takeoff complete");

// Start the picture stream
pngStream = client.getPngStream();

// Start using those pictures
pngStream
  .on('error', console.log)
  .on('data', function(pngBuffer) {
    pic = pngBuffer;
    snap(pic);
  });

// Get the nodebot moving while this is going on!
client
  .after(5000, function() {
    // rise up
    this.up(0.4);
  })
  .after(2500, function() {
    // stop rising, start turning
    this.stop();
    this.clockwise(0.1);
  })
  .after(45000, function() {
    // ok, stop and land now
    this.stop();
    this.land();
  });