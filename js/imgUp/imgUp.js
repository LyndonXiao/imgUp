$(function(){
	var delParent;
	var max_num;
	var defaults = {
		fileType         : ["jpg","png","bmp","jpeg"],   // 上传文件的类型
		fileSize         : 1024 * 1024 * 10                  // 上传文件的大小 10M
	};
		/*点击图片的文本框*/
	$(document).on('change', '.file', function () {
        var $this = $(this);
        max_num = $this.data('max') || 5;
        var dir = $this.data('dir') || 'img';
        var width = $this.data('width') || 150;
        var height = $this.data('height') || 100;
        var input_name = $this.data('name');
        var ajaxURI = $this.data('url');

        var idFile = $this.attr("id");
        var file = document.getElementById(idFile);
        var imgContainer = $this.parents(".z_photo"); //存放图片的父亲元素
        var fileList = file.files; //获取的图片文件
        var input = $this.parent();//文本框的父亲元素
        var imgArr = [];
        //遍历得到的图片文件
        var numUp = imgContainer.find(".up-section").length;
        var totalNum = numUp + fileList.length;  //总的数量
        if(fileList.length > max_num || totalNum > max_num ){
            alert("上传图片数目不可以超过" + max_num + "个，请重新选择");  //一次选择上传超过5个 或者是已经上传和这次上传的到的总数也不可以超过5个
        }
        else if(numUp < max_num){
            fileList = validateUp(fileList);
            for(var i = 0;i<fileList.length;i++){
				upload_img(fileList[i], i, imgContainer, input_name, imgArr, dir, width, height, ajaxURI);
            }
        }
        // setTimeout(function(){
        //     $(".up-section").removeClass("loading");
        //     $(".up-img").removeClass("up-opcity");
        // }, 450);
        numUp = imgContainer.find(".up-section").length;
        if(numUp >= max_num - 1){
            $this.parent().hide();
        }

        //input内容清空
        $this.val("");
    });

	//删除图片
    $(".z_photo").delegate(".close-upimg","click",function(){
     	  $(".works-mask").show();
     	  delParent = $(this).parent();
	});

    //预览图片
    $('.z_photo').on('click', '.up-span', function () {
        var fullWidth = document.body.clientWidth;
        var innerWidth = window.innerWidth;
        var fullHeight = document.body.clientHeight;
        var innerHeight = window.innerHeight;
        var imgBox = document.createElement("div");
        imgBox.style.cssText = 'position: absolute; top: 0px; left: 0;width: '+fullWidth+'px; height: '+fullHeight+'px; z-index: 99999; background-color: #000; opacity: 0.6';
        imgBox.id = 'imgBox';
        imgBox.onclick = function () {
            this.remove();
            document.getElementById('imgPrev').remove();
        };
        document.body.appendChild(imgBox);
        // console.log(window.scrollTop);
        var imgPrev = document.createElement("img");
        imgPrev.style.cssText = 'clear:both; z-index: 100000; position:absolute; top: ' + ((innerHeight - 500)/2 + document.body.scrollTop) + 'px; left: ' + (innerWidth - 750)/2 + 'px; width: 750px; background-color: #fff;opacity: 1';
        imgPrev.src = $(this).next().next().attr('src');
        imgPrev.id = 'imgPrev';
        imgPrev.onclick = function () {
            this.remove();
            document.getElementById('imgBox').remove();
        };
        document.body.appendChild(imgPrev);
    });


		
	$(".wsdel-ok").click(function(){
		$(".works-mask").hide();
		var numUp = delParent.siblings().length;
		if(numUp < (max_num + 1)){
			delParent.parent().find(".z_file").show();
		}
		 delParent.remove();
	});
	
	$(".wsdel-no").click(function(){
		$(".works-mask").hide();
	});

    function validateUp(files) {
        var arrFiles = [];//替换的文件数组
        for (var i = 0, file; file = files[i]; i++) {
            //获取文件上传的后缀名
            var newStr = file.name.split("").reverse().join("");
            if (newStr.split(".")[0] != null) {
                var type = newStr.split(".")[0].split("").reverse().join("");
                // console.log(type + "===type===");
                if (jQuery.inArray(type.toLowerCase(), defaults.fileType) > -1) {
                    // 类型符合，可以上传
                    if (file.size >= defaults.fileSize) {
                        alert(file.size);
                        alert(file.name + '"文件大小过大');
                    } else {
                        // 在这里需要判断当前所有文件中
                        arrFiles.push(file);
                    }
                } else {
                    alert(file.name + '"上传类型不符合');
                }
            } else {
                alert(file.name + '"没有类型, 无法识别');
            }
        }
        return arrFiles;
    }

    function append_img(file, i, imgContainer, input_name, imgArr, img_info) {
        // var imgUrl = window.URL.createObjectURL(file);
        var imgUrl = '/' + img_info.src;
        imgArr.push(imgUrl);
        var $section = $("<section class='up-section fl loading'>");
        imgContainer.prepend($section);
        var $span = $("<span class='up-span'>");
        $span.appendTo($section);
        var $img0 = $("<img class='close-upimg'>");
        $img0.attr("src","/static/plugins/imgUp/img/a7.png").appendTo($section);
        var $img = $("<img class='up-img up-opcity'>");
        $img.attr("src",imgArr[i]);
        $img.appendTo($section);
        // var $p = $("<p class='img-name-p'>");
        // $p.html(fileList[i].name).appendTo($section);
        var $input2 = $("<input name='" + input_name + "' value='" + img_info.id + "' type='hidden'/>");
        $input2.appendTo($section);
        setTimeout(function(){
            $(".up-section").removeClass("loading");
            $(".up-img").removeClass("up-opcity");
        }, 450);
    }

    $('#team_form').on("click", '.close-upimg', function(event){
        event.preventDefault();
        event.stopPropagation();
        $(".works-mask").show();
        delParent = $(this).parent();
    });

    function upload_img(file, i, imgContainer, input_name, imgArr, dir, width, height, ajaxURI) {
        var reader = new FileReader();
        var formdata = new FormData();
        var info = false;
        reader.readAsDataURL(file);
        reader.onloadend = function (e) {
            formdata.append('file', e.target.result);
            formdata.append('height', height);
            formdata.append('width', width);
            formdata.append('dir', dir);
            info = $.ajax({
                url: ajaxURI,
                type: 'POST',
                cache: false,
                data: formdata,
                processData: false,
                contentType: false,
                success: function (data) {
                    data = $.parseJSON(data);
                    if (data.error) {
                        alert(data.msg);
                         return false;
                    } else {
                        append_img(file, i, imgContainer, input_name, imgArr, data.data);
                    }
                },
                error: function () {
                    alert('连接错误');
                    return false;
                }
            });
        };
    }
});