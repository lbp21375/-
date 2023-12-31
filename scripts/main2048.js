// 2048 棋盘
var board = []
// 合并过的数字方格
var hasConflicted = []
// 分数
var score = 0

// 位置
var startX = 0
var startY = 0
var endX = 0
var endY = 0

$(document).ready(function(){
    prepareForMobile()
    newGame()
})

// 移动端适配
var prepareForMobile = function() {
    if (documentWidth > 500) {
        gridContainerWidth = 500
        cellSideLength = 100
        cellSpace = 20

        return
    }
    // 在操作页面阻止滑动
    document.ontouchmove = function(event) {
        if (!event.elementIsEnabled) {
            event.preventDefault()
        }
    }
    // 监听 touchstart
    document.addEventListener('touchstart', function(event){
        // event.preventDefault()
        startX = event.touches[0].pageX
        startY = event.touches[0].pageY
        // console.log(startx);
    })
    // 监听 touchend
    document.addEventListener('touchend', function(event){
        // event.preventDefault()
        endX = event.changedTouches[0].pageX
        endY = event.changedTouches[0].pageY
        var deltaX = endX - startX
        var deltaY = endY - startY
        // 容错
        if (Math.abs(deltaX) < documentWidth * 0.1 && Math.abs(deltaY) < documentWidth * 0.1) {
            return
        }
        // 滑动操作
        if (Math.abs(deltaX) >= Math.abs(deltaY)) {
            if (deltaX > 0) {
                // right
                if (moveRight()) {
                    setTimeout("generateOneNumber()", 210)
                    setTimeout("isGameOver()", 300)
                }
            } else {
                // left
                if (moveLeft()) {
                    setTimeout("generateOneNumber()", 210)
                    setTimeout("isGameOver()", 300)
                }
            }
        } else {
            if (deltaY > 0) {
                // down
                if (moveDown()) {
                    setTimeout("generateOneNumber()", 210)
                    setTimeout("isGameOver()", 300)
                }
            } else {
                // up
                if (moveUp()) {
                    setTimeout("generateOneNumber()", 210)
                    setTimeout("isGameOver()", 300)
                }
            }
        }
        // console.log(endx);
    })

    // 调整大小
    $('header').css('height', documentHeight * 0.15)

    $('#grid-container').css('width', gridContainerWidth - cellSpace * 2)
    $('#grid-container').css('height', gridContainerWidth -  cellSpace * 2)
    $('#grid-container').css('padding', cellSpace)
    $('#grid-container').css('border-radius', gridContainerWidth * 0.02)

    $('.grid-cell').css('width', cellSideLength)
    $('.grid-cell').css('height', cellSideLength)
    $('.grid-cell').css('border-radius', cellSideLength * 0.05)
}

// 创建新游戏
var newGame = function() {
    //初始化棋盘
    init()
    //在随机的两个格子生成数字
    generateOneNumber()
    generateOneNumber()
    // console.log('new game');
}

var init = function() {
    score = 0
    // 界面初始化
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            var gridCell = $(`#grid-cell-${i}-${j}`)
            gridCell.css('top', getPosTop(i, j))
            gridCell.css('left', getPosLeft(i, j))
        }
    }
    // 数据初始化
    for (let i = 0; i < 4; i++) {
        board[i] = []
        hasConflicted[i] = []
        for (let j = 0; j < 4; j++) {
            board[i][j] = 0
            hasConflicted[i][j] = false
        }
    }

    updateBoardView()
}

// 更新界面
var updateBoardView = function() {
    updateScore(score)
    $(".number-cell").remove()
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $('#grid-container').append(`<div class="number-cell" id="number-cell-${i}-${j}"></div>`)
            var theNemberCell = $(`#number-cell-${i}-${j}`)
            if (board[i][j] === 0) {
                theNemberCell.css('height', '0px')
                theNemberCell.css('width', '0px')
                theNemberCell.css('top', getPosTop(i, j) + cellSideLength / 2)
                theNemberCell.css('left', getPosLeft(i, j) + cellSideLength / 2)
            } else {
                theNemberCell.text(board[i][j])
                theNemberCell.css('height', cellSideLength)
                theNemberCell.css('width', cellSideLength)
                theNemberCell.css('top', getPosTop(i, j))
                theNemberCell.css('left', getPosLeft(i, j))
                theNemberCell.css('font-size', getNumberSize(board[i][j]))
                theNemberCell.css('background-image', getNumberBackgroundImage(board[i][j]))
                theNemberCell.css('color', getNumberColor(board[i][j]))
            }
            hasConflicted[i][j] = false
        }
    }
    // $('.number-cell').css('line-height', cellSideLength + 'px')
    $('.number-cell').css('border-radius', cellSideLength * 0.05)
}

// 生成数字方格
var generateOneNumber = function() {
    if (noSpace(board)) {
        return false
    }
    // 生成随机位置
    var randx = parseInt(Math.floor(Math.random() * 4))
    var randy = parseInt(Math.floor(Math.random() * 4))
    // 优化随机算法
    while (true) {
        if (board[randx][randy] === 0) {
            break;
        }
        randx = parseInt(Math.floor(Math.random() * 4))
        randy = parseInt(Math.floor(Math.random() * 4))
    }

    // 随机生成 2 和 4
    var randNumber = Math.random() < 0.5 ? 16 : 32
    // console.log('randNumber :', randNumber);
    // 显示数字
    board[randx][randy] = randNumber
    showNumberWithAnimation(randx, randy, randNumber)
    // console.log('generateOneNumber');
    return true
}

$(document).keydown(function(event){
    // 阻止按键默认效果
    event.preventDefault()

    switch (event.keyCode) {
        case 37:
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210)
                setTimeout("isGameOver()", 300)
            }
            // console.log('left');
            break;
        case 38:
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210)
                setTimeout("isGameOver()", 300)
            }
            // console.log('up');
            break;
        case 39:
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210)
                setTimeout("isGameOver()", 300)
            }
            // console.log('right');
            break;
        case 40:
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210)
                setTimeout("isGameOver()", 300)
            }
            // console.log('down');
            break;
    }
})

// 游戏结束
var isGameOver = function() {
    if (noSpace(board) && noMove(board)) {
        gameOver()
    }
}

// sweetalert game over
var gameOver = function() {
    swal('Game Over! ')
}

// 方格移动的实现
var moveLeft = function() {
    if (!canMoveLeft(board)) {
        return false
    }
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] !== 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] === 0 && noBlockHorizontal(i, k, j, board)) {
                        showMoveAnimation(i, j, i, k)
                        board[i][k] = board[i][j]
                        board[i][j] = 0
                        continue
                    } else if (board[i][k] === board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        showMoveAnimation(i, j, i, k)
                        board[i][k] += board[i][j]
                        board[i][j] = 0
                        score += board[i][k]
                        updateScore(score)
                        hasConflicted[i][k] = true
                        continue
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200)
    return true
}

var moveRight = function() {
    if (!canMoveRight(board)) {
        return false
    }
    for (var i = 0; i < 4; i++) {
        for(var j = 2; j >= 0; j--) {
            if (board[i][j] !== 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] === 0 && noBlockHorizontal(i, j, k, board)) {
                        showMoveAnimation(i, j, i, k)
                        board[i][k] = board[i][j]
                        board[i][j] = 0
                        continue
                    } else if (board[i][k] === board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        showMoveAnimation(i, j, i, k)
                        board[i][k] += board[i][j]
                        board[i][j] = 0
                        score += board[i][k]
                        updateScore(score)
                        hasConflicted[i][k] = true
                        continue
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200)
    return true
}

var moveUp = function() {
    if (!canMoveUp(board)) {
        return false
    }
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j] !== 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] === 0 && noBlockVertical(j, k, i, board)) {
                        showMoveAnimation(i, j, k, j)
                        board[k][j] = board[i][j]
                        board[i][j] = 0
                        continue
                    } else if (board[k][j] === board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j)
                        board[k][j] += board[i][j]
                        board[i][j] = 0
                        score += board[k][j]
                        updateScore(score)
                        hasConflicted[k][j] = true
                        continue
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200)
    return true
}

var moveDown = function() {
    if (!canMoveDown(board)) {
        return false
    }
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] !== 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] === 0 && noBlockVertical(j, i, k, board)) {
                        showMoveAnimation(i, j, k, j)
                        board[k][j] = board[i][j]
                        board[i][j] = 0
                        continue
                    } else if (board[k][j] === board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j)
                        board[k][j] += board[i][j]
                        board[i][j] = 0
                        score += board[k][j]
                        updateScore(score)
                        hasConflicted[k][j] = true
                        continue
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 200)
    return true
}
