var startHeight =[];
var startWidth =[];
var endHeight =[];
var endWidth =[];
var limit;
var height;
var width;
var numPages=4;
function getRandValueOnGrid(max) {
	var grids = 20;
	return (max/(grids*2))+(Math.floor(Math.random()*grids) * Math.floor(max/grids));
}

function getRandValuesOnSphere(width, height) {
	var size = 200;
	var dist = 1; //Math.sqrt(Math.random());
	var angle = Math.random() * 2 * Math.PI;
	var type = Math.floor(Math.random()*6);
	var percentage = 0;
	if(type==4)
		return [width/2 + (Math.random()*2-1)*size*0.85, height/2 + 100];
	if(type==5)
		return [width/2 + (Math.random()*2-1)*size*0.85, height/2 - 100];
	if(type==3)
		return [width/2 + (Math.random()*2-1)*size, height/2];
	if(type==0)
		percentage = 0;
	if(type==1)
		percentage = 0.5;
	if(type==2)
		percentage = 1;
	return [width/2 + Math.cos(angle)*(dist * size)*percentage, height/2 + (Math.sin(angle)*(dist * size))];
}

function drawDots() {
	var bookPage = 1;
	var start = limit/(numPages-1) * (bookPage-0.5);
	var mid = limit/(numPages-1) * bookPage;
	var end = limit/(numPages-1) * (bookPage+0.5);
	var ctx =document.getElementById("drawing").getContext("2d");
	ctx.fillStyle = "#4e7988";//"#403C4A";
	ctx.fillRect(0, 0, width, height);
	ctx.fillStyle = "#005066";//"#B08572";
	let value = document.getElementById("container").scrollTop;

	var newPosition = ((value-start)/(mid-start));
	
	if(value < mid)
		newPosition = ((value-start)/(mid-start));
	if(value >= mid)
		newPosition = 1-((value-mid)/(end-mid));
	if(value < start)
		newPosition = 0;
	if(value > end)
		newPosition = 0;
	for(var i=0;i<1500;i++) {
		
		//console.log(value+" "+limit);
		var height1 = startHeight[i] + (endHeight[i] - startHeight[i])*newPosition;
		var width1 = startWidth[i] + (endWidth[i] - startWidth[i])*newPosition;
		ctx.beginPath();
		ctx.arc(width1, height1, 4, 0, 2 * Math.PI);
		ctx.fill();
	}
}

function drawPicture() {
	var bookPage = 4;
	let value = document.getElementById("container").scrollTop ;
	var aux = document.getElementById("me");
	var size;
	var start = limit/(numPages-1)*(bookPage-0.5);
	if(value < start)
		size = 0;
	else
		size = 15 + (value - start)/((limit/(numPages-1))*0.5) * 100;
	aux.style.clipPath = "circle("+size+"% at 50% 10%)";
}

function spinBook() {
	let value = document.getElementById("container").scrollTop ;
	var bookPage = 3;
	var start = limit/(numPages-1) * (bookPage-1);
	var mid = limit/(numPages-1) * bookPage;
	var end = limit/(numPages-1) * (bookPage+1);
	var maxSpin = -80;
	var minSpin = -25;
	
	if(value < start)
		return;
	if(value > end)
		return;
	
	var book = document.getElementById("book");
	console.log(">>"+start+" "+mid+" "+end+" "+value);
	var newValue;
	if(value<=mid)
		newValue = maxSpin + (value-start)/(mid-start) * (minSpin-maxSpin);
	else
		newValue = minSpin - (value-mid)/(end-mid) * (minSpin-maxSpin);
	
	console.log(newValue);
	book.style.transform = "rotateY("+newValue+"deg)";
	if(mid-30<value && value<mid+30)
		book.style.transition = "transform 0.5s ease";
	else
		book.style.transition = "transform 0s";
}

var timeoutHandle;
var inAutoScroll = false;
async function scrollToPage() {
	inAutoScroll=true;
	var steps = 30;
	var pageSize = limit/(numPages-1);
	var scrollPosition = document.getElementById("container").scrollTop;
	var aux = Math.round(scrollPosition/(pageSize))*(pageSize);
	console.log("ACTIVATED");
	console.log(" "+document.getElementById("container").scrollTop+" "+aux+" "+pageSize +" "+pageSize/4+" "+Math.abs(scrollPosition - aux));
	if(Math.abs(scrollPosition - aux) < pageSize/4) {
		var stepSize = (aux-document.getElementById("container").scrollTop+0.0)/steps;
		var desired = document.getElementById("container").scrollTop; // HERE BE DRAGONS
		for(var i=0;i<steps;i++) {
			console.log(i+" "+document.getElementById("container").scrollTop+" "+aux+" "+stepSize);
			desired += stepSize;
			document.getElementById("container").scrollTop = desired;
			await new Promise(r => setTimeout(r, 1));
		}
	}
	inAutoScroll=false;
}

$(function() {
	height = window.innerHeight; // document.getElementById('drawing').clientHeight;
	width = window.innerWidth; //document.getElementById('drawing').clientWidth;
	document.getElementById("drawing").width = width
	document.getElementById("drawing").height = height
	for(var i=0;i<2500;i++) {
		startHeight[i] = getRandValueOnGrid(height);
		startWidth[i] = getRandValueOnGrid(width);
		[endWidth[i], endHeight[i]] = getRandValuesOnSphere(width, height);
	}

	limit = document.body.offsetHeight - window.innerHeight;
	//alert(limit+" "+limit/4);
	drawDots(0);
	document.getElementById("container").addEventListener('scroll', function(){
		//alert("sasa");
		if(!inAutoScroll) {
			window.clearTimeout(timeoutHandle);
			timeoutHandle = window.setTimeout(scrollToPage, 200);
		}
		
		
		drawDots();
		drawPicture();
		spinBook();
	})

});