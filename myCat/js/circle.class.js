/*
*js的类，与php的不太一样
*功能：封装某个圈圈的属性
*/

function Circle(type,row,col){
	this.row=row;//行
	this.col=col;//列
	this.type;
	this.setType(type);
}
Circle.TYPE_UNSELECTED=0;
Circle.TYPE_SELECTED=1;
Circle.prototype = new createjs.Bitmap();
Circle.prototype.setType=function(type){
	this.type=type;
	switch(type){
		case Circle.TYPE_UNSELECTED://如果是0，调用图片pot1
		createjs.Bitmap.call(this,"./res/pot1.png");
		break;
		case Circle.TYPE_SELECTED://如果是1，调用图片pot2
		createjs.Bitmap.call(this,"./res/pot2.png");
		break;
	}
}