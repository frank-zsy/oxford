/**
 * CompareController
 *
 * @description :: Server-side logic for managing compares
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  index: function(req, res) {
    var method = req.method;
    var msg = {res: {text: "服务器太火被打爆了，等会儿再试吧！"}};
    if (method == 'GET') {
      return res.notFound();
    } else if (method == 'POST') {
      var params = req.allParams();
      if (!params.gender || !params.starIndex) {
        res.badRequest();
      }
      req.file('userPhoto').upload({
        dirname: 'userPhoto/',
        maxBytes: 4000 * 1000
      }, function(err, files) {
        if (err || files.length == 0) {return res.badRequst();}
        var filePath = files[0].fd;
        Utils.oxfordRequest(filePath, function (err, data) {
          if (err) {
            console.err(data);
            return res.down(msg + 1);
          } else {
            var userFace = data;
            // console.log(userFace);
            var validRes = FaceProcessor.validate(userFace);
            if (validRes.error != 0) {
              console.log("validate failed!");
              return res.ok({res: {text: validRes.msg}});
            }
            var starName = sails.config.starNames[params.gender][params.starIndex];
            Stars.find({name: starName}, function (err, stars) {
              if (err || !stars) {
                console.err(err);
                return res.down(msg + 2);
              }
              var star = stars[0];
              var starDetail = FaceProcessor.baseProcessor(star);
              var userDetail = FaceProcessor.baseProcessor(userFace);
              var compareRes = FaceProcessor.compare(userDetail, starDetail);
              var dir = process.env.PWD;
              var params = {
                filePath: filePath,
                faceLandmarks: userFace.faceLandmarks,
                faceRectangle: userFace.faceRectangle
              };
              console.log(JSON.stringify(params));
              var cmd = dir + "/script/imageProcess.sh '" + JSON.stringify(params) + "'";
              require('child_process').exec(cmd, {cwd: dir + "/script"}, function (err, stdout) {
                console.log(stdout);
                if (err) {
                  return res.down(msg + 3);
                }
                var out = JSON.parse(stdout);
                if (out.error == 1) {
                  return res.down(msg + 4);
                }
                var error = out.error;
                if (error != 0) {
                  return res.ok({res: "文件处理出了点小问题啊，目前只支持jpeg和png两种格式哦！"});
                }
                var newFile = JSON.parse(stdout).newPath;
                var returnMsg = {
                  res: compareRes,
                  userPath: newFile,
                  starPath: sails.config.starMarkedDomain + sails.config.starMarkedPhoto[starName],
                  similarity: Math.floor(75 + (Math.random() * 25))
                };
                console.log(returnMsg);
                res.ok(returnMsg);
              });
            });
          }
        });
      });
    } else {
      res.notFound();
    }
  },

  testImageProcess: function(req, res) {
    var msg = "";
    Stars.find({}, function (err, stars) {
      if (err || !stars) {return res.down(msg);}
      for (var i in stars) {
        var star = stars[i];

        var dir = process.env.PWD;
        var cmd = dir + "/script/imageProcess.sh '" + JSON.stringify(params) + "'";
        require('child_process').exec(cmd, {cwd: dir + "/script"}, function (err, stdout, stdin) {
          console.log(err);
          console.log(stdout);
        });
      }
      res.ok({res: ""});
    });
  }

};
