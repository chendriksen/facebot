var arDrone = require('ar-drone');
var client  = arDrone.createClient();
var cv = require('opencv')

var lastPng;
var pic;
var count = 0;

var snap = function(picture){
    
    cv.readImage(picture, function(err, im){
    im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
    for (var i=0;i<faces.length; i++){
      var x = faces[i]
      im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
      count ++;
      im.save('./face' + count + '.jpg');
      console.log("found a face")
    }
  });
})

}

pngStream = client.getPngStream();
  pngStream
    .on('error', console.log)
    .on('data', function(pngBuffer) {
      pic = pngBuffer;
      snap(pic)
    });
