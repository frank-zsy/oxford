module.exports = {

  faceStandardSize: 1000,

  oxfordHost: "api.projectoxford.ai",
  oxfordPort: 443,
  oxfordUri: "/face/v0/detections?analyzesFaceLandmarks=true&analyzesAge=true&analyzesGender=true&analyzesHeadPose=true",
  oxfordType: "application/octet-stream",
  oxfordToken: "4d39ef7c810a466ea5906677a0741bf6",

  starNames: {
    male: {
      'item-0': "吴彦祖",
      'item-1': "黄晓明",
      'item-2': "陈晓",
      'item-3': "杨洋"
    },
    female: {
      'item-0': "赵丽颖",
      'item-1': "高圆圆",
      'item-2': "刘亦菲",
      'item-3': "Angelababy"
    }
  },

  starMarkedDomain: "http://cdn.frankzhao.org/static/stars/",
  starMarkedPhoto: {
    "吴彦祖": "wuyanzu.marked.png",
    "黄晓明": "huangxiaoming.marked.png",
    "陈晓": "chenxiao.marked.png",
    "杨洋": "yangyang.marked.png",
    "赵丽颖": "zhaoliying.marked.png",
    "高圆圆": "gaoyuanyuan.marked.png",
    "刘亦菲": "liuyifei.marked.png",
    "Angelababy": "yangying.marked.png"
  }

};
