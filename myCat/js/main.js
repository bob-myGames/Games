var stage;
var canvas;
var circlePath = 45;//小圆的半径
var arr = new Array();//定义数组，下面会定义二维数组
var gridOffsetX = 50;
var gridOffsetY = 300;
var catOffsetX = 30;
var catOffsetY =90;
var cat;
var gameState;//游戏状态
var step;//游戏走的步数
var DIR={
    LEFT:1,
    UP_LEFT:2,
    UP_RIGHT:3,
    RIGHT:4,
    DOWN_RIGHT:5,
    DOWN_LEFT:6
}
var STATE = {
    START:0,
    PLAY:1,
    END:2
}
game();//调用游戏主程
function game(){
    stage = new createjs.Stage("myCanvas");//创建画布
    createjs.Ticker.addEventListener('tick',handleTick);//主循环，回调函数在下面
    // createjs.Ticker.timingMode=createjs.Ticker.RAF_SYNCHED;
    // createjs.Ticker.framerate=30;
    canvas = document.getElementById('myCanvas');
    canvas.addEventListener("mousedown",handleMouseDown);
    startGame();
}
function handleTick(){
    stage.update();
}
function handleMouseDown(event){
    event.preventDefault();//防止连接打开URL
    //实际的坐标=点击事件鼠标所在-画布离盒子的距离-圈圈离原点的距离+半径
    var origX = event.pageX - canvas.offsetLeft - gridOffsetX + circlePath/2;
    var origY = event.pageY - canvas.offsetTop - gridOffsetY + circlePath/2;
    if(gameState == STATE.START){//游戏开始前点击，会进入游戏场景
        enterGame();
    }
    if(gameState == STATE.PLAY){//要游戏进行中才可以点击触发
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
                    step++;
                    stage.removeChild(circle);
                    addCircle(row,col,Circle.TYPE_SELECTED);
                    catMove();
                }
            }
        }
    }
    if(gameState == STATE.END){//游戏结束后点击，会重置游戏
        resetGame();
    }
}
/*
* 猫的移动过程
* */
function catMove(){
    var catCircle = arr[cat.row][cat.col];//猫所在的圈，所在的行列
    var walkableArr = [];//存载判断可不可以走
    for(var i=1;i<=6;i++){//遍历当前圈周围的6个圈
        var p = catCircle.getCloseCircleIndex(i);//得到当前的圈周围的圈的信息
        if(p){
            var closeCircle = arr[p[0]][p[1]];//把某个圈的信息排成行列
            if(closeCircle.type == Circle.TYPE_UNSELECTED){//如果没有被点击过的圈
                walkableArr.push(closeCircle);//插入到数组内部
            }
        }
    }
    if(walkableArr.length == 0){
        //游戏结束,win
        gameOver(true);
    }else{
        //代表可走，随机选择一个
        var randomIndex = parseInt(Math.random()*walkableArr.length);
        var finalCircle = walkableArr[randomIndex];
        //让猫移动到finalCircle的位置
        cat.move(finalCircle.row,finalCircle.col,finalCircle.x,finalCircle.y);
        if(Circle.isBoundry(finalCircle.row,finalCircle.col)){
            //游戏结束，lose
            gameOver(false);
        }
    }
}
function addCircle(row,col,type){
	var bitmap = new Circle(type,row,col);//初始化类
	stage.addChildAt(bitmap,0);
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
            if(i==4&&j==4){
                ranType = Circle.TYPE_UNSELECTED;
            }
			addCircle(i,j,ranType);
		}
	}
}

function createCat(){
	cat = new Cat();//实现效果
	cat.x=arr[4][4].x-catOffsetX;//猫的x轴位置
	cat.y=arr[4][4].y-catOffsetY;//猫的y轴位置
    console.log(cat.x,cat.y);
    cat.setGridPos(4,4);//设置猫所在的行列
	stage.addChild(cat);
}
/*
* 游戏的流程控制
*
* */
function startGame(){
//开始游戏
    gameState = STATE.START;
    //添加开始游戏画面
    var image = new createjs.Bitmap('./res/btn_start.png');
    stage.addChild(image);
    image.name='start';
    image.x = 50;
    image.y = 200;
}
function enterGame(){
    //进入游戏前先把进入游戏的画面去掉
    stage.removeChild(stage.getChildByName('start'));
    //进入游戏
    gameState = STATE.PLAY;
    step = 0;
    createMap();//调用地图主体
    createCat();//调用神经猫主体
}
function gameOver(is_win){
//判断游戏胜负
    var result = '';
    if(is_win){
        result = '你赢了，用了'+step+'步。';
    }else{
        result = '你输了！';
    }
    gameState = STATE.END;
    alert(result);
    //添加结束游戏画面
//    var pic;
//    if(is_win){
//        pic = './res/victory.png';
//    }else{
//        pic = './res/failed.png';
//    }
//    var image1 = new createjs.Bitmap(pic);
//    stage.addChild(image1);
//    var text =new createjs.Text('你用了'+step+'步','20px 华文彩云','black');
//    text.x = 200;
//    text.y = 200;
//    stage.addChild(image1);
}
function resetGame(){
//重置游戏,清空当前所有的子元素
    stage.removeAllChildren();
    enterGame();
}
/*
* 游戏流程
* game()=>游戏主体加载
* startGame()=>开始游戏加载
* handleMouseDown()=>点击后进入下一环节
* enterGame()=>进入
* .....handleMouseDown()游戏过程
* gameOver()=>游戏结束
* handleMouseDown()=>点击后重置
* resetGame()
*
* */