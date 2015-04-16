var stage;
var canvas;
var circlePath = 45;//小圆的半径
var arr = new Array();//定义数组，下面会定义二维数组
var gridOffsetX = 50;
var gridOffsetY = 300;
game();//调用游戏主程
function game(){
	stage = new createjs.Stage("myCanvas");//创建画布
	createjs.Ticker.addEventListener('tick',handleTick);//主循环，回调函数在下面
	// createjs.Ticker.timingMode=createjs.Ticker.RAF_SYNCHED;
	// createjs.Ticker.framerate=30;
	canvas = document.getElementById('myCanvas');
	canvas.addEventListener("mousedown",handleMouseDown);
	createMap();//调用地图主体
	createCat();//调用神经猫主体
}
function handleTick(){
	stage.update();
}
function handleMouseDown(event){
	event.preventDefault();//防止连接打开URL
	//实际的坐标=点击事件鼠标所在-画布离盒子的距离-圈圈离原点的距离+半径
	var origX = event.pageX - canvas.offsetLeft - gridOffsetX + circlePath/2;
	var origY = event.pageY - canvas.offsetTop - gridOffsetY + circlePath/2;
						//直径*9=总长度
	if(origX>0 && origX<circlePath*9){
		var row = parseInt(origY/circlePath);//点击位置的高度/直径=行
		var offset = row%2?circlePath/2:0;//计算有一个半径的偏移量
		if(origY>0 && origY<circlePath*9+offset){//直径*9+半径=总长
			//先算行，再通过行算出偏移，再通过偏移算出列，得到所在列与行
			//而且这个是用框框法，所在位置为一个矩形（正方形）
			var col = parseInt((origX-offset)/circlePath);
			console.log(row,col);
			var circle = arr[row][col];
			if(circle.type == Circle.TYPE_UNSELECTED){
				stage.removeChild(circle);
				addCircle(row,col,Circle.TYPE_SELECTED);
			}
		}
	}
}
function addCircle(row,col,type){
	var bitmap = new Circle(type,row,col);//初始化类
	stage.addChild(bitmap);
	offset=row%2?circlePath/2:0;//偏移量
	bitmap.regX=circlePath/2;
	bitmap.regY=circlePath/2;
	bitmap.x=gridOffsetX+circlePath*col+offset;//每一个小圆圈位置
	bitmap.y=gridOffsetY+circlePath*row;
	arr[row][col] = bitmap;//把圈圈赋给数组里面的元素
}
function createMap(){
	for(var i=0;i<9;i++){
		arr[i] = new Array();//定义二维数组
		for(var j=0;j<9;j++){
			//设定随机算法,小于0.3为被选中的
			var ranType = Math.random()<0.3?Circle.TYPE_SELECTED:Circle.TYPE_UNSELECTED;
			// var bitmap = new createjs.Bitmap("./res/pot1.png");
			addCircle(i,j,ranType);
		}
	}
}

function createCat(){
	//神经猫的动画效果
	var data = {//纹理级动画
		framerate:15,//速率
		images:["./res/stay.png"],//图片位置
		frames:{width:61,height:93},//图片大小
		animations:{run:[0,15]}//动画效果
	}
	var spriteSheet = new createjs.SpriteSheet(data);
	var cat = new createjs.Sprite(spriteSheet,"run");//实现效果
	cat.x=arr[3][3].x;//猫的x轴位置
	cat.y=arr[2][2].y;//猫的y轴位置
	stage.addChild(cat);
}