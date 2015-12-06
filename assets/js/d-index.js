var starIndex = "item-0";

$(function() {

  var starDomain = "http://cdn.frankzhao.org/static/stars/";

  var maleList = [
    {
      name: "吴彦祖",
      path: "wuyanzu.jpg"
    }, {
      name: "黄晓明",
      path: "huangxiaoming.jpg"
    }, {
      name: "陈晓",
      path: "chenxiao.jpg"
    }, {
      name: "杨洋",
      path: "yangyang.jpg"
    }
  ];

  var femaleList = [
    {
      name: "赵丽颖",
      path: "zhaoliying.jpg"
    }, {
      name: "高圆圆",
      path: "gaoyuanyuan.jpg"
    }, {
      name: "刘亦菲",
      path: "liuyifei.jpg"
    }, {
      name: "Angelababy",
      path: "yangying.jpg"
    }
  ];

  $("#resultPanel").hide();
  $("#processPanel").hide();

  var carouselChk = function() {
    var items = $(".carousel-inner").children(".item");
    if ($("input[name='gender']:checked").val() == "male") {
      for (var i = 0; i < maleList.length; i++) {
        $(items[i]).children(".carousel-caption").text(maleList[i].name);
        $(items[i]).children("img").attr("src", starDomain + maleList[i].path);
      }
    } else {
      for (var i = 0; i < femaleList.length; i++) {
        $(items[i]).children(".carousel-caption").text(femaleList[i].name);
        $(items[i]).children("img").attr("src", starDomain + femaleList[i].path);
      }
    }
    // 停在第一帧
    $("#starCarousel").on('slide.bs.carousel',function(e){
      console.log(e.relatedTarget.id);
      starIndex = e.relatedTarget.id;
    });
    $("#starCarousel").carousel(0);
    $("#starCarousel").carousel('pause');
  };

  var startX = 0, startY = 0;

  //touchstart事件
  function touchSatrtFunc(evt) {
    try {
      evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等

      var touch = evt.touches[0]; //获取第一个触点
      var x = Number(touch.pageX); //页面触点X坐标
      var y = Number(touch.pageY); //页面触点Y坐标
      //记录触点初始位置
      startX = x;
      startY = y;
    }
    catch (e) {
      console.err(e.message);
    }
  }

  //touchmove事件，这个事件无法获取坐标
  function touchMoveFunc(evt) {
    try {
      evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
      var touch = evt.touches[0]; //获取第一个触点
      var x = Number(touch.pageX); //页面触点X坐标
      var y = Number(touch.pageY); //页面触点Y坐标

      var threshold = 30;
      //判断滑动方向
      if (x - startX > threshold) {
        $("#starCarousel").carousel("next");
      } else if (startX - x > threshold) {
        $("#starCarousel").carousel("prev");
      }
    }
    catch (e) {
      console.err(e.message);
    }
  }

  function bindEvent() {
    document.getElementById("starCarousel").addEventListener('touchstart', touchSatrtFunc, false);
    document.getElementById("starCarousel").addEventListener('touchmove', touchMoveFunc, false);
  }

  bindEvent();


  $("#male").change(carouselChk);
  $("#female").change(carouselChk);

  carouselChk();

  $("#userPhotoBtn").click(function() {
    $("#userPhotoFile").click();
  });

  $("#userPhotoImg").hide();

  $("#userPhotoFile").change(function() {
    var src = document.getElementById("userPhotoFile").files.item(0);
    $("#userPhotoImg").attr("src", window.URL.createObjectURL(src));
    $("#userPhotoImg").show();
  });

  $("#compareSubmit").click(function() {
    var files = document.getElementById("userPhotoFile").files;
    if (files.length == 0) {
      return alert("请添加一张照片");
    }
    var result = $("#resultPanel");
    var tds = $(".result-td");
    $("#choosePhotoPanel").hide();
    $("#chooseGenderPanel").hide();
    $("#chooseStarPanel").hide();
    $(this).hide();
    $("#processPanel").show();
    $.ajaxFileUpload({
      url: window.location + "/compare?gender="
        + $("input[name='gender']:checked").val() + "&starIndex=" + starIndex,
      method: "POST",
      secureuri: false,
      fileElementId: "userPhotoFile",
      dataType: "json",
      success: function (data, status) {
        var res = data.msg.res;
        var index = 0;
        for(var i in res) {
          $(tds[index++]).text(res[i]);
        }
        if (data.msg.userPath && data.msg.starPath) {
          $("#userResult").attr("src", data.msg.userPath);
          $("#starResult").attr("src", data.msg.starPath);
        }
        if (data.msg.similarity != undefined) {
          $("#similarityResult").text("相似度：" + data.msg.similarity + "%");
        }
        $("#processPanel").hide();
        console.log(res);
        result.show();
      },
      error: function (data, status, e) {
        var res = data.msg.res;
        var index = 0;
        for(var i in res) {
          $(tds[index++]).text(res[i]);
        }
        $("#processPanel").hide();
        result.show();
      }
    });
  });

});
