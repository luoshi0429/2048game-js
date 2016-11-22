/**
 * Created by liumin on 16/9/30.
 */

documentWidth = window.screen.availWidth ;
var containerWidth = documentWidth * 0.92 ;
var padding = documentWidth * 0.04 ;
var cellWH = documentWidth * 0.18 ;
var cellBorderRadius = cellWH * 0.03 ;


$(document).ready(function () {

    prepareForWidth();
    startnewgame();
});

function prepareForWidth() {
    if(documentWidth > 500) {
        documentWidth = 500 ;
        containerWidth = 500 ;
        padding = 20 ;
        cellWH = 100;
    }
    var game_container =  $('.game_container');
    game_container.css('width',(containerWidth - 2 * padding));
    game_container.css('height',(containerWidth - 2 * padding));
    game_container.css('padding',padding);

    var gridcell = $('.grid_cell');
    gridcell.css('width',cellWH);
    gridcell.css('height',cellWH);
    gridcell.css('line-height',cellWH);
    gridcell.css('border-radius',cellBorderRadius);
}




function startnewgame() {
    // 排列小方块
    var i,j ;
    for(i=0;i<4;i++){
        for(j=0;j<4;j++){
            var gridcell = $('#grid_cell_'+i+'_'+j);
            gridcell.css('top',getPostionTop(i));
            gridcell.css('left',getPostionLeft(j));
        }
    }

    //初始化gridnumberes数组 -> 初始化为0
    for(i = 0 ; i < 4; i ++){
        gridnumbers[i] = new Array(4) ;
        for(j = 0;j < 4 ; j ++) {
            gridnumbers[i][j] = 0 ;
        }
    }

    getRandomNumber();
    getRandomNumber();

    updateGrid();
    score = 0 ;
}

// -------- 操作相关 --------
$(document).keydown(function (event) {
    // console.log(event.keyCode);
    switch (event.keyCode){
        case 37:  // 左
            event.preventDefault();
            moveLeft();
            break;
        case 38: // 上
            event.preventDefault();
            moveTop();
            break;
        case 39:  // 右
            event.preventDefault();
            moveRight();
            break;
        case 40:  //  下
            event.preventDefault();
            moveBottom();
            break;
        default:
            break;
    }
});

var startx ,starty , endx , endy ;

document.addEventListener('touchstart',function (event) {
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchend',function (event) {
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltaX = endx - startx;
    var deltaY = endy - starty ;

    if(Math.abs(deltaX) < 5 && Math.abs(deltaY) < 5) {
        return ;
    }

    if(Math.abs(deltaX) > Math.abs(deltaY)) {  // x轴移动
        if(deltaX > 0) {
            // 右移
            moveRight() ;
        } else{
            // 左移
            moveLeft() ;
        }

    } else {
        // y轴移动
        if(deltaY > 0) {
            // 下移
            moveBottom() ;
        } else {
            // 上移
            moveTop();
        }
    }
});


function isgameover() {
    if(nospace() && nomove()){
        alert('gameover');
        // startnewgame();
    }
}

function nospace() {
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if(gridnumbers[i][j] == 0) {
                return false ;
            }
        }
    }
    return true ;
}

function nomove() {
    if(canMoveLeft() || canMoveRight() || canMoveUp() || canMoveDown()) {
        return false ;
    }

    return true ;
}


function canMoveLeft(){
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 1; j < 4 ; j ++ )
            if( gridnumbers[i][j] != 0 )
                if( gridnumbers[i][j-1] == 0 || gridnumbers[i][j-1] == gridnumbers[i][j] )
                    return true;

    return false;
}

function canMoveRight(){
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 2; j >= 0 ; j -- )
            if( gridnumbers[i][j] != 0 )
                if( gridnumbers[i][j+1] == 0 || gridnumbers[i][j+1] == gridnumbers[i][j] )
                    return true;

    return false;
}

function canMoveUp(){
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 1 ; i < 4 ; i ++ )
            if( gridnumbers[i][j] != 0 )
                if( gridnumbers[i-1][j] == 0 || gridnumbers[i-1][j] == gridnumbers[i][j] )
                    return true;

    return false;
}

function canMoveDown(){
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 2 ; i >= 0 ; i -- )
            if( gridnumbers[i][j] != 0 )
                if( gridnumbers[i+1][j] == 0 || gridnumbers[i+1][j] == gridnumbers[i][j] )
                    return true;

    return false;
}

// 左移 -> 判断第二行开始 要求:  1.左边有空格子 2.  左边离自己最近的格子上的数字相同
function moveLeft() {
    var hasmoved = false ;
    for(var i=0;i<4;i++){
        for(var j=1;j<4;j++){
            var num = gridnumbers[i][j];
            if(num !== 0){
                for(var k=0;k<j;k++){
                    if( gridnumbers[i][k] == 0 && horizontalWithNoBlock(i,k,j)) {
                        showMoveAnimation(i,j,i,k);
                        gridnumbers[i][k] = gridnumbers[i][j];
                        gridnumbers[i][j] = 0 ;
                        hasmoved = true;
                        continue;
                    } else if (num === gridnumbers[i][k] && horizontalWithNoBlock(i,k,j)) {
                        showMoveAnimation(i,j,i,k);
                        gridnumbers[i][k] += num ;
                        gridnumbers[i][j] = 0 ;
                        hasmoved = true;
                        score += gridnumbers[i][k];
                        updateScore();
                        continue ;
                    }
                }
            }
        }
    }

    if(hasmoved) {
        setTimeout("updateGrid()",200) ;
        setTimeout("getRandomNumber()",210);
        setTimeout("isgameover()",250);
        // getRandomNumber() ;
    }
}

function moveRight() {
    var hasmoved = false ;
    for(var i=0;i<4;i++){
        for(var j=2;j>=0;j--){
            var num = gridnumbers[i][j];
            if(num != 0){
                for(var k=3;k>j;k--){

                    if( gridnumbers[i][k] == 0 && horizontalWithNoBlock(i,j,k)) {
                        showMoveAnimation(i,j,i,k);
                        gridnumbers[i][k] = gridnumbers[i][j];
                        gridnumbers[i][j] = 0 ;
                        hasmoved = true;
                        continue;
                    } else if (num === gridnumbers[i][k] && horizontalWithNoBlock(i,j,k)) {
                        showMoveAnimation(i,j,i,k);
                        gridnumbers[i][k] += num ;
                        gridnumbers[i][j] = 0 ;
                        score += gridnumbers[i][k];
                        updateScore();
                        hasmoved = true;
                        continue ;
                    }
                }
            }
        }
    }

    if(hasmoved) {
        // updateGrid();
        setTimeout("updateGrid()",200) ;
        setTimeout("getRandomNumber()",210);
        setTimeout("isgameover()",250);
    }
}

function moveTop() {

    var hasmoved = false ;
    for(var i=1;i<4;i++) {
        for(var j=0;j<4;j++){
            var num = gridnumbers[i][j];
            if(num != 0){
                for(var k=0;k<i;k++){
                    // debugger
                    if( gridnumbers[k][j] == 0 && verticalWithNoBlock(j,k,i)) {
                        showMoveAnimation(i,j,k,j);
                        gridnumbers[k][j] = gridnumbers[i][j];
                        gridnumbers[i][j] = 0 ;
                        hasmoved = true;
                        continue;
                    } else if (num == gridnumbers[k][j] && verticalWithNoBlock(j,k,i)) {
                        // debugger
                        showMoveAnimation(i,j,k,j);
                        gridnumbers[k][j] += num ;
                        gridnumbers[i][j] = 0 ;
                        hasmoved = true;
                        score += gridnumbers[k][j];
                        updateScore();
                        continue ;
                    }
                }
            }
        }
    }

    if(hasmoved) {
        // updateGrid();
        setTimeout("updateGrid()",200) ;
        setTimeout("getRandomNumber()",210);
        setTimeout("isgameover()",250);
    }
}

function moveBottom() {
    var hasmoved = false ;
    for(var i=2;i>=0;i--){
        for(var j=0;j<4;j++){
            var num = gridnumbers[i][j];
            if(num != 0){
                for(var k=3;k>i;k--){
                    if( gridnumbers[k][j] == 0 && verticalWithNoBlock(j,i,k)) {
                        showMoveAnimation(i,j,k,j);
                        gridnumbers[k][j] = gridnumbers[i][j];
                        gridnumbers[i][j] = 0 ;
                        hasmoved = true;
                        continue;
                    } else if (num === gridnumbers[k][j] && verticalWithNoBlock(j,i,k)) {
                        showMoveAnimation(i,j,k,j);
                        gridnumbers[k][j] += num ;
                        gridnumbers[i][j] = 0 ;
                        hasmoved = true;
                        score += gridnumbers[k][j];
                        updateScore();
                        continue ;
                    }
                }
            }
        }
    }

    if(hasmoved) {
        // updateGrid();
        setTimeout("updateGrid()",200) ;
        setTimeout("getRandomNumber()",210);
        setTimeout("isgameover()",250);
    }
}

function horizontalWithNoBlock(row,col1,col2) {
    for(var i = col1+1 ; i < col2;i++){
        if(gridnumbers[row][i] != 0) {
            return false ;
        }
    }
     return true ;
}

function verticalWithNoBlock(col,row1,row2) {
    for(var i = row1+1 ; i < row2;i++){
        if(gridnumbers[i][col] != 0) {
            return false ;
        }
    }
    return true ;
}


// -------- 数据相关 --------
// 二维数组 用来存放对应格子里的数字.
var gridnumbers = [];
// 分数
var score = 0 ;

// 生成随机数  2 or 4
function getRandomNumber(){

    var ranNum = Math.random() < 0.5 ? 2 : 4 ;

    // 显示在随机的格子上  格子要为空
    var ranRow = parseInt(Math.floor(Math.random() * 4 ));
    var ranCol = parseInt(Math.floor(Math.random() * 4 ));

    while (gridnumbers[ranRow][ranCol] !== 0) {
        ranRow = parseInt(Math.floor(Math.random() * 4 ));
        ranCol = parseInt(Math.floor(Math.random() * 4 ));
    }

    gridnumbers[ranRow][ranCol] = ranNum ;
    // updateGrid();
    showNumberWithAnimation(ranRow,ranCol,ranNum);
}

//-------- 显示相关 --------
// 刷新表格
function updateGrid() {

    $('.number_cell').remove();
    for(var i = 0 ;i < 4 ; i ++) {
        for (var j = 0; j < 4 ; j ++) {
            // 创建numbercell
            var idstr = 'number_cell_'+i+'_'+j;
            $('.game_container').append('<div class="number_cell" id='+idstr+'></div>');

            var num = gridnumbers[i][j];
            var numbercell = $('#number_cell_'+i+'_'+j);
            if (num !== 0) {
                numbercell.text(num);
                numbercell.css('width',cellWH);
                numbercell.css('height',cellWH);
                numbercell.css('top',getPostionLeft(i));
                numbercell.css('left',getPostionTop(j));
                numbercell.css('background',getNumberCellBgColor(num));
                numbercell.css('color',getNumberColor(num));
                if(num < 1000){
                    numbercell.css('font-size','40px');
                }else if(num < 10000){
                    numbercell.css('font-size','20px');
                }
            } else {
                numbercell.css('width','0px');
                numbercell.css('height','0px');
                numbercell.css('top',getPostionLeft(i)+cellWH / 2);
                numbercell.css('left',getPostionTop(j)+cellWH / 2);
            }
        }
    }


    var numberCell = $('.number_cell');
    numberCell.css('line-height',cellWH + 'px');
    numberCell.css('font-size',0.6 * cellWH + 'px');

}

// 不同的分数对应不同的背景颜色 字体颜色
function getNumberColor(num){
    if( num <= 4 ) {
        return "#776e65";
    }
    return "white";
}

function getNumberCellBgColor(num) {
    switch (num){
        case 2:return "#eee4da";break;
        case 4:return "#ede0c8";break;
        case 8:return "#f2b179";break;
        case 16:return "#f59563";break;
        case 32:return "#f67c5f";break;
        case 64:return "#f65e3b";break;
        case 128:return "#edcf72";break;
        case 256:return "#edcc61";break;
        case 512:return "#9c0";break;
        case 1024:return "#33b5e5";break;
        case 2048:return "#09c";break;
        case 4096:return "#a6c";break;
        case 8192:return "#93c";break;
        default: return 'black' ;
    }
}

// -------- 位置相关 --------
function getPostionTop(row) {
    return padding+row*(padding+cellWH) ;
}

function getPostionLeft(col) {
    return padding+col*(padding+cellWH) ;
}

// -------- 动画相关 --------
function showMoveAnimation(fromx,fromy,tox,toy) {
    console.log('fromx : ',fromx,'fromy:',fromy);
    console.log('tox : ',tox,'toy:',toy);
    var numbercell = $('#number_cell_'+fromx+'_'+fromy);
    numbercell.animate({
        top: getPostionTop(tox),
        left: getPostionLeft(toy)
    },200);
}

function showNumberWithAnimation(i,j, num) {
    var numbercell = $('#number_cell_'+i+'_'+j);
    numbercell.css('background-color',getNumberCellBgColor(num));
    numbercell.css('color',getNumberColor(num));
    numbercell.text(num);

    numbercell.animate({
        width:cellWH,
        height:cellWH,
        top:getPostionTop(i),
        left:getPostionLeft(j)
    },50);
}

function updateScore() {
    $('#score').text(score);
}