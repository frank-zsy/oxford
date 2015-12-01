module.exports = {

  validate: function (face) {
    var pose = face.attributes.headPose;
    for (var i in pose) {
      if (pose[i] >= 8) {
        return false;
      }
    }
    return true;
  },

  baseProcessor: function (face) {
    var detailInfo = {};
    var rec = face.faceRectangle;
    var landmarks = face.faceLandmarks;

    var scale = sails.config.faceStandardSize / rec.width;

    // 眉宽
    detailInfo.eyebrowWidth = Math.round((Utils.pointDis(landmarks.eyebrowLeftInner, landmarks.eyebrowLeftOuter) +
    Utils.pointDis(landmarks.eyebrowRightInner, landmarks.eyebrowRightOuter))* scale / 2);
    // 眉间距
    detailInfo.eyebrowDis = Math.round(Utils.pointDis(landmarks.eyebrowLeftInner, landmarks.eyebrowRightInner));
    // 眼高
    detailInfo.eyeWidth = Math.round((Utils.pointDis(landmarks.eyeLeftInner, landmarks.eyeLeftOuter) +
    Utils.pointDis(landmarks.eyeRightOuter, landmarks.eyeRightInner))* scale / 2);
    // 眼宽
    detailInfo.eyeHeight = Math.round((Utils.pointDis(landmarks.eyeLeftBottom, landmarks.eyeLeftTop) +
    Utils.pointDis(landmarks.eyeRightBottom, landmarks.eyeRightTop))* scale / 2);
    // 眼间距
    detailInfo.eyeDis = Math.round(Utils.pointDis(landmarks.eyeLeftInner, landmarks.eyeRightInner));
    // 嘴宽
    detailInfo.mouthWith = Math.round(Utils.pointDis(landmarks.mouthLeft, landmarks.mouthRight) * scale);
    // 上唇厚度
    detailInfo.upperLipThickness = Math.round(Utils.pointDis(landmarks.upperLipTop, landmarks.upperLipBottom) * scale);
    // 下唇厚度
    detailInfo.underLipThickness = Math.round(Utils.pointDis(landmarks.underLipTop, landmarks.underLipBottom) * scale);
    // 鼻翼宽
    detailInfo.noseAlarWidth = Math.round(Utils.pointDis(landmarks.noseLeftAlarOutTip, landmarks.noseRightAlarOutTip) *
      scale);
    // 鼻上翼宽
    detailInfo.noseAlarTopWidth = Math.round(Utils.pointDis(landmarks.noseLeftAlarTop, landmarks.noseRightAlarTop) *
      scale);
    // 鼻尖离鼻翼距离
    detailInfo.noseTipToAlarDis = Math.round(Utils.pointToLineDis(landmarks.noseTip, landmarks.noseLeftAlarOutTip,
      landmarks.noseRightAlarOutTip) * scale);
    // 上下唇间距
    detailInfo.lipDis = Math.round(Utils.pointDis(landmarks.upperLipBottom, landmarks.underLipTop) * scale);

    return detailInfo;
  },

  compare: function (uFace, sFace) {
    var compareRes = {};
    // 眉
    if (uFace.eyebrowWidth < sFace.eyebrowWidth) {
      if (uFace.eyebrowDis > sFace.eyebrowDis) {
        compareRes.eyebrow = "把眉毛往里画一画试试吧！";
      } else {
        compareRes.eyebrow = "把眉毛往外画一画试试吧！"
      }
    } else {
      compareRes.eyebrow = "你眉毛比TA好看多了好么！";
    }

    // 眼
    if (uFace.eyeWidth < sFace.eyeWidth) {
      if (uFace.eyeDis > sFace.eyeDis) {
        compareRes.eye = "嗯，可以尝试开一下内眼角~";
      } else {
        compareRes.eye = "嗯，可以尝试开一下外眼角~";
      }
      if (uFace.eyeHeight < sFace.eyeHeight) {
        compareRes.eye += "再睁大一些就更好了呢！";
      }
    } else {
      compareRes.eye = "你眼睛比TA的修长啊~";
      if (uFace.eyeHeight < sFace.eyeHeight) {
        compareRes.eye += "再睁大一些就更好了呢！";
      }
    }

    // 唇
    if (uFace.upperLipThickness < sFace.upperLipThickness || uFace.underLipThickness < sFace.underLipThickness) {
      compareRes.lip = "考虑一下丰唇吧，饱满的嘴唇看起来更好看！";
    } else {
      compareRes.lip = "你完美的嘴唇已经完爆了TA！";
    }

    // 嘴
    if (uFace.mouthWith < sFace.mouthWith) {
      compareRes.mouth = "你的樱桃小嘴明显更好看啊！";
    } else {
      compareRes.mouth = "TA的嘴太小了，真的想变成那样么？";
    }

    return compareRes;
  }

};
