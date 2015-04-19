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
/*
* 得到当前圆圈，周围的圆圈的数组的序号
* */
Circle.prototype.getCloseCircleIndex=function(dir){
    var res = null;
    var r = this.row;
    var c = this.col;
    switch(dir){
        case DIR.LEFT:
            res = [r,c-1];
            break;
        case DIR.UP_LEFT:
            var nc=r%2?c:c-1;
            res = [r-1,nc];
            break;
        case DIR.UP_RIGHT:
            var nc=r%2?c+1:c;
            res = [r-1,nc];
            break;
        case DIR.RIGHT:
            res = [r+1,c];
            break;
        case DIR.DOWN_RIGHT:
            var nc=r%2?c:c-1;
            res=[r+1,nc];
            break;
        case DIR.DOWN_LEFT:
            var nc=r%2?c:c-1;
            res = [r+1,nc];
            break;
    }
    //对res进行边界的判断，避免出界
    if(res&&(res[0]<0||res[0]>8||res[1]<0||res[1]>8)){
        res=null;
    }
    return res;
}
/*
* 判断是否为游戏边界
* */
Circle.isBoundry = function(row,col){
    var r =false;
    if(row ==0||col==0||row==8||col==8){
        r=true;
    }
    return r;
}