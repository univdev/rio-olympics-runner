var transY = 0;
var rush = false;
var loop;
var trapPos = Array(); // 함정이 설치된 위치와 트랙의 번호를 담는 배열.
$(function(){
	$(document).scrollLeft(0);
})
var runner = {
	way : 1, // 0 부터 시작함.
	target : $("#runner"),
	jump:true // 점프 가능여부
}
function onStart(){ // 게임 시작
	transY = 0;
	runner.way = 1;
	position();
	distance();
	$("#points section").removeClass("visible");
	$(".panel").removeClass("visible");
	$("#end").addClass("hide");
	$("#runner").css("left",0);
	$("#pyre").removeClass("show");
	$(document).scrollLeft(0);
	rush = true;
	runner.jump = true;
	onLoad();
	runner.target.addClass("rush");
	runner.target.removeClass("jump");
	runner.target.removeClass("last");
	setTrap();
}
function onLoad(){
	transY = $("#runner").css("transform","translateY()");
	console.log(transY);
	if(rush){
		loop = setInterval(function(){
			$(document).scrollLeft(runner.target.offset().left-500);
			runner.target.css("left",runner.target.offset().left+2);
			
			if($("#runner").offset().left >= 4760 && $("#runner").offset().left <= 4950){
				$("#runner").addClass("last");
			}
			
			visibleBuild(); // 조형물 보이기
			fail();
			if(runner.target.offset().left >= $("#pyre").offset().left-100)
			onEnd();
			
			if(rush == false){
				console.log("Stop !");
				clearInterval(loop);
			}
		},1)
	}
}
function onEnd(){ // 도착
	$("#pyre").addClass("show");
	$("#end").removeClass("hide");
	$("#end .box > div").addClass("hide");
	$("#end .success").removeClass("hide");
	runner.jump = false;
	runner.target.removeClass("rush");
	rush = false;
	clearInterval(loop);
}
$(document).on("keyup",function(e){
	var code = e.keyCode;
	switch(code){
		case 32:
		onJump();
		break;
		
		case 38:
		runner.way = runner.way == 0 ? 0 : runner.way-1;
		break;
		
		case 40:
		runner.way = runner.way == 2 ? 2 : runner.way+1;
		break;
	}
	distance(); // 원근감 표현
	position(); // 달리는 트랙 변경
})

function distance(){
	switch(runner.way){
		case 0:
		var width = 70;
		break;
		
		case 1:
		var width = 100;
		break;
		
		case 2:
		var width = 130;
		break;
	}
	runner.target.children("svg").css("width",width);
}
function position(){
	switch(runner.way){
		case 0:
		var track = 95;
		break;
		
		case 1:
		var track = 90;
		break;
		
		case 2:
		var track = 65;
		break;
	}
	runner.target.css("bottom",track);
	runner.target.css("z-index",10+(10*runner.way)-1);
}
function onJump(){
	if(runner.jump && rush){
		runner.jump = false;
		$("#runner").addClass("jump");
		setTimeout(function(){
			runner.jump = true;
			$("#runner").removeClass("jump");
		},1000)
	}
}
function setTrap(){ // 허들 설치
	trapPos = Array();
	var count = 15;
	var track = $(".runway") // 레인
	track.children("span").remove();
	for(var i=0; i<count; i++){
		var setPos;
		switch(i){
			case 0:
			case 1:
			case 2:
			setPos = i;
			break;
			
			default:
			setPos = Math.round(Math.random()*2);
			break;
		}
		var left = Math.round(Math.random()*2500);
		var trap = $("<span class='obstacle' data-track='"+setPos+"'></span>").css("transform","translateX("+left+"px)");
		$(track[setPos]).append(trap);
	}
	
	$(track).children(".obstacle").each(function(index, element) {
		var track = $(this).attr("data-track");
        trapPos.push($(this).offset().left+"_"+track);
    });
}
function fail(){ // 장애물에 걸렸을 시.
	$(trapPos).each(function(index, element) {
        var val = element.split("_");
		var miter = parseInt(val[0]);
		var track = parseInt(val[1]);
		var x = $("#runner").offset().left;
		
		if(runner.way == track && (x >= miter-30 && x<= miter+5) && runner.jump){
			$("#end").removeClass("hide");
			$("#end .box > div").addClass("hide");
			$("#end .error").removeClass("hide");
			rush = false;
			$("#runner").removeClass("rush");
		}
    });
}
function unduk(){ // 언덕길 심볼
	var simbol = $("<div id='unduk'></div>");
}

function visibleBuild(){
	var x = $("#runner").offset().left;
	var build = $("#game #points section");
	var title = $("#panels .panel");
	
	build.each(function(index, element) {
        var build_x = $(this).offset().left;
		
		if(x >= build_x){
			$(this).addClass("visible");
			$(title[index-1]).addClass("visible");
		}
    });
}