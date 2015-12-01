/**
 * CompareController
 *
 * @description :: Server-side logic for managing compares
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  index: function(req, res) {
    var method = req.method;
    var msg = "服务器太火被打爆了，等会儿再试吧！";
    if (method == 'GET') {
      return res.notFound();
    } else if (method == 'POST') {
      var params = req.allParams();
      console.log(params);
      req.file('userPhoto').upload({
        dirname: 'userPhoto/',
        maxBytes: 4000 * 1000
      }, function(err, files) {
        if (err || files.length == 0) {return res.badRequst();}
        var filePath = files[0].fd;
        Utils.oxfordRequest(filePath, function (err, data) {
          if (err) {
            res.status(err);
            return res.down(msg);
          } else {
            var starName = sails.config.starNames[params.gender][params.starIndex];
            var userFace = data;
            Stars.find({name: starName}, function (err, stars) {
              if (err || !stars) {return res.down(msg);}
              var star = stars[0];
              var starDetail = FaceProcessor.baseProcessor(star);
              if (!FaceProcessor.validate(userFace)) {
                return res.ok({res: {text: "来张正脸的好么！"}});
              }
              var userDetail = FaceProcessor.baseProcessor(userFace);
              var compareRes = FaceProcessor.compare(userDetail, starDetail);
              res.ok({res: compareRes});
            });
          }
        });
      })

    } else {
      res.notFound();
    }
  }

};
