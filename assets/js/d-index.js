var starIndex = "item-0";

$(function() {

  var maleList = [
    {
      name: "吴彦祖",
      path: "/images/Stars/wuyanzu.jpg"
    }, {
      name: "黄晓明",
      path: "/images/Stars/huangxiaoming.jpg"
    }, {
      name: "陈晓",
      path: "/images/Stars/chenxiao.jpg"
    }, {
      name: "杨洋",
      path: "/images/Stars/yangyang.jpg"
    }
  ];

  var femaleList = [
    {
      name: "范冰冰",
      path: "/images/Stars/fanbingbing.jpg"
    }, {
      name: "高圆圆",
      path: "/images/Stars/gaoyuanyuan.jpg"
    }, {
      name: "刘亦菲",
      path: "/images/Stars/liuyifei.jpg"
    }, {
      name: "Angelababy",
      path: "/images/Stars/yangying.jpg"
    }
  ];

  $("#resultPanel").hide();
  $("#processPanel").hide();

  var carouselChk = function() {
    var items = $(".carousel-inner").children(".item");
    if ($("input[name='gender']:checked").val() == "male") {
      for (var i = 0; i < maleList.length; i++) {
        $(items[i]).children(".carousel-caption").text(maleList[i].name);
        $(items[i]).children("img").attr("src", maleList[i].path);
      }
    } else {
      for (var i = 0; i < femaleList.length; i++) {
        $(items[i]).children(".carousel-caption").text(femaleList[i].name);
        $(items[i]).children("img").attr("src", femaleList[i].path);
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
      url: "http://oxford.frankzhao.org/compare?gender="
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
        $("#processPanel").hide();
        console.log(res);
        result.show();
      },
      error: function (data, status, e) {
        var res = data.msg.res;
        var index = 0;
        console.log(res);
        for(var i in res) {
          $(tds[index++]).text(res[i]);
        }
        $("#processPanel").hide();
        result.show();
      }
    });
  });

});
