/**
 * AddStarController
 *
 * @description :: Server-side logic for managing addstars
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	index: function(req, res) {
    var method = req.method;

    if (method == 'GET') {
      // not gonna pass if no admin param attached
      if (req.param('admin') != "msft") {
        return res.notFound();
      }
      // return add star page
      return res.view('addStar');

    } else if (method == 'POST') {
      var params = req.allParams();
      var starName = params.starName;
      req.file('starPhoto').upload({
        dirname: 'starPhoto/',
        maxBytes: 4000 * 1000
      }, function(err, files) {
        if (err || files.length == 0) {return res.badRequst();}
        var filePath = files[0].fd;

        var image = require('fs').readFileSync(filePath).toString('binary');
        var opt = {
          method: "POST",
          host: "api.projectoxford.ai",
          port: 443,
          path: "/face/v0/detections?analyzesFaceLandmarks=true&analyzesAge=true&analyzesGender=true&analyzesHeadPose=true",
          headers: {
            "Content-Type": 'application/octet-stream',
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
              Stars.findOne({name: starName}).exec(function(err, star) {
                if (err) {return res.jsonx(err);}
                if (star) {return res.jsonx({msg: starName + ' already exists.'});}
                Stars.create({
                  name: starName,
                  faceId: faceInfo.faceId,
                  faceRectangle: faceInfo.faceRectangle,
                  faceLandmarks: faceInfo.faceLandmarks,
                  attributes: faceInfo.attributes,
                  filePath: filePath
                }).exec(function (err, star) {
                  if (err || !star) {return res.jsonx(err);}
                  return res.jsonx(star);
                });
              });
            });
          } else {
            return res.jsonx(serverFeedback);
          }
        });

        oxReq.write(image + '\n', 'binary');
        oxReq.end();
      });

    } else {
      res.notFound();
    }
  },

  test: function(req, res) {
    var path = '/home/zhaoshengyu/Servers/oxford/.tmp/uploads/starPhoto/yangyang.png';
    var token = '4d39ef7c810a466ea5906677a0741bf6';

    var image = require('fs').readFileSync(path).toString('binary');
    //var image = JSON.stringify({url: "http://7xi4w1.com1.z0.glb.clouddn.com/yangying.png"});
    var opt = {
      method: "POST",
      host: "api.projectoxford.ai",
      port: 443,
      path: "/face/v0/detections?analyzesFaceLandmarks=true&analyzesAge=true&analyzesGender=true&analyzesHeadPose=true",
      headers: {
        "Content-Type": 'application/octet-stream',
        //"Content-Type": 'application/json',
        "Ocp-Apim-Subscription-Key": token,
        "Content-Length": image.length
      }
    };

    var body = "";
    var oxReq = require('https').request(opt, function (serverFeedback) {
      body = serverFeedback.statusCode;
      serverFeedback.on('data', function (data) {
        body += data;
      }).on('end', function () {
          res.jsonx(body);
        });
    });

    oxReq.write(image + '\n', 'binary');
    oxReq.end();
  },

  glimpse :function(req, res) {
    var sendBak = {};
    Stars.find({}, function (err, stars) {
      if (err || !stars) {return res.jsonx(err);}
      for(var star in stars) {
        sendBak[stars[star].name] = FaceProcessor.baseProcessor(stars[star]);
      }
      res.jsonx({data: sendBak});
    });
  }

};
