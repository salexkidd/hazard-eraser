(function () {
    "use strict";

    var Map = new (Skeleton.View.extends({
        template: [
            "div", { style: "position:relative; width:100%; height:100%;" }
        ]
        , events: {
            "rendered": "initialize"
        }
        , initialize: function () {
            var that = this;
            var w = this.element.offsetWidth
              , h = this.element.offsetHeight - 85
            this.map = new Microsoft.Maps.Map(this.element, {
                credentials: "AmykbqsWcQmLAUbcnEpFLeiAMn64hcnirYQ0JEb5xQwz4lhC1-qpYwU0YULXDVC_"
                , mapTypeId: Microsoft.Maps.MapTypeId.road
                , zoom: 1
                , width: w
                , height: h
            });
            Navigator.addEventListener("reloaded", function () {
                Map.focusTo(Navigator.position);
                that.pushPin(new Pin().pushpin());
            });
            Navigator.reload();
        }
        , resize: function () {
            var w = this.element.offsetWidth
              , h = this.element.offsetHeight - 85
            this.map.setOptions({
                width: w
                , height: h
            });
        }
        , focusTo: function (position, zoom) {
            this.map.setView({
                center: new Microsoft.Maps.Location(position.latitude, position.longitude)
                , zoom: zoom || 17
            });
        }
        , pushPin: function (pin) {
            this.map.entities.push(pin);
        }
    }))();

    var Pin = Skeleton.Eventable.extends({
        constructor: function (props) {
            if (!props) {
                props = {};
            }
            this.latitude = props.latitude || Navigator.position.latitude;
            this.longitude = props.longitude || Navigator.position.longitude;
            this.color = props.color || "red";
            this.draggable = props.draggable || false;
        }
        , location: function () {
            return new Microsoft.Maps.Location(this.latitude, this.longitude);
        }
        , pushpin: function () {
            var that = this;
            this.pin = new Microsoft.Maps.Pushpin(this.location(), {
                draggable: this.draggable
                , htmlContent: "<i class='glyphicon glyphicon-pushpin' style='color: " + this.color + "; font-size:40px;'></i>"
            });
            Microsoft.Maps.Events.addHandler(this.pin, 'click', function () {
                $(".main").addClass("active");
                that.dispatch("click");
            });
            return this.pin;
        }
    });

    var Navigator = new (Skeleton.Eventable.extends({
        reload: function () {
            var that = this;
            if (!!window.navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function () {
                    that.success.apply(that, arguments);
                }, function () {
                    that.error.apply(that, arguments);
                }, {
                    enableHighAccuracy: true
                    , timeout: 6000
                    , maximumAge: 60000
                });
            } else {
                alert("位置情報を利用できません");
            }
        }
        , success: function (position) {
            this.position = {
                latitude: position.coords.latitude
                , longitude: position.coords.longitude
            }
            this.dispatch("reloaded");
        }
        , error: function (error) {
            switch (error.code) {
                case 1:
                    console.log("位置情報の取得が許可されませんでした。");
                    break;
                case 2:
                    console.log("位置情報の取得に失敗しました。");
                    break;
                case 3:
                    console.log("タイムアウトしました。");
                    break;
            }
        }
    }))();

    var Camera = Skeleton.View.extends({
        constructor: function(){
            navigator.getMedia = (navigator.getUserMedia ||
                      navigator.webkitGetUserMedia ||
                      navigator.mozGetUserMedia ||
                      navigator.msGetUserMedia);
            this.enable = !!navigator.getMedia;
        }
        , template: [
            "div", { style: "position: relative; width: 350px; height: 350px;" }, [
                "button", { class: "btn btn-default capture", style: "position: absolute; font-size:40px;" }, [
                    "i", { class: "glyphicon glyphicon-camera" }
                ]
            ], [
                "video", { width: 350, height: 250, style: "position: absolute; z-index: -1" }
            ], [
                "canvas", { width: 640, height: 480, style: "display: none;" }
            ], [
                "img", { style: "position: absolute; z-index: -1; width: 100%;" }
            ]
        ]
        , events: {
            "rendered": "initialize"
            , "click button": "start"
            , "click video": "capture"
        }
        , initialize: function () {
            if(!this.enable){
                this.find("button").disabled = "disabled";
            }
            var w = this.element.offsetWidth
              , h = this.element.offsetHeight;
            this.video = this.find("video");
            this.canvas = this.find("canvas");
            this.context = this.canvas.getContext("2d");
            this.img = this.find("img");
        }
        , start: function () {
            var that = this;
            navigator.getMedia({
                video: true
            }
            , function (localMediaStream) {
                that.video.src = window.URL.createObjectURL(localMediaStream);
                that.video.play();
                that.stream = localMediaStream;
                that.find("button").style.zIndex = -1;
                that.video.style.zIndex = 0;
            }
            , function (err) {
                console.log("The following error occured: " + err);
            });
        }
        , capture: function () {
            if (this.stream) {
                this.context.drawImage(this.video, 0, 0);
                this.find("img").src = this.canvas.toDataURL('image/webp');
                this.video.style.zIndex = -1;
                this.img.style.zIndex = 1;
                this.stop();
            }
        }
        , stop: function () {
            this.stream.stop();
        }
        , retry: function () {
            this.find("button").style.zIndex = 0;
            this.video.style.zIndex = -1;
            this.img.style.zIndex = -1;
        }
    });

    $(function () {
        Map.renderTo($(".map").get(0));
        /*window.onresize = function () {
            Map.resize();
        }*/
	$(window).resize(function(){
		Map.resize();	
	})
        var camera = new Camera().renderTo($(".modal-body").get(0));
        $("#post-modal").on("show.bs.modal", function () {
            camera.retry();
        })
        $(".back-btn").click(function () {
            $(".main").removeClass("active");
        });
    });
}());
