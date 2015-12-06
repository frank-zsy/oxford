module.exports = {

  pointDis: function(p1, p2) {
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
  },

  pointToLineDis: function(p, p1, p2) {
    return Math.abs((p.y - p1.y) * (p2.x - p1.x) - (p.x - p1.x) * (p2.y - p1.y)) / Utils.pointDis(p1, p2);
  },

  oxfordRequest: function(filePath, cb) {

    var image = require('fs').readFileSync(filePath).toString('binary');
    var opt = {
      method: "POST",
      host: sails.config.oxfordHost,
      port: sails.config.oxfordPort,
      path: sails.config.oxfordUri,
      headers: {
        "Content-Type": sails.config.oxfordType,
        "Ocp-Apim-Subscription-Key": sails.config.oxfordToken,
        "Content-Length": image.length
      }
    };

    var data = "";
    var oxReq = require('https').request(opt, function (serverFeedback) {
      if (serverFeedback.statusCode == 200) {
        serverFeedback.on('data', function (chunck) {
          data += chunck;
        }).on('end', function () {
          // Receive face data from oxford server
          var faceInfo = JSON.parse(data)[0];
          return cb(null, faceInfo);
        });
      } else {
        serverFeedback.on('data', function (chunck) {
          data += chunck;
        }).on('end', function () {
          return cb(serverFeedback.statusCode, data);
        });
      }
    });

    oxReq.write(image + '\n', 'binary');
    oxReq.end();
  }

};
