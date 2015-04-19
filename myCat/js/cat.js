/**
 * Created by bob on 15-4-19.
 */
function Cat(){
    this.row;
    this.col;
//    this.bCatch;
    this.init();//获取猫的基本信息
//    this.setGridPos(4,4);
}
Cat.prototype = new createjs.Sprite();
Cat.prototype.init = function(){
    var data = {//纹理级动画
        framerate:15,//速率
        images:["./res/stay.png"],//图片位置
        frames:{width:61,height:93},//图片大小
        animations:{run:[0,15]}//动画效果
    }
    var spriteSheet = new createjs.SpriteSheet(data);
    createjs.Sprite.call(this,spriteSheet,'run');
}
//设置猫所在的行列
Cat.prototype.setGridPos = function(row,col){
    this.col=col;
    this.row=row;
}
/*
* 点击后猫的移动
* */
Cat.prototype.move = function(row,col,x,y){
    this.setGridPos(row,col);
    this.x=x-catOffsetX;
    this.y=y-catOffsetY;
}