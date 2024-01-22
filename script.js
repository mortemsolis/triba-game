const canvasElement = document.querySelector('#mainCanvas')
const ctx = canvasElement.getContext('2d')

// canvasElement.style.border = '1px solid black';

let currentPlayer
let layout

function startGame() {
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    document.getElementById('gridSelect').style = 'display: none';
    document.getElementById('playAgain').style = 'display: none';
    document.getElementById('gameGrid').style = 'display: block';

    gameState.dots = []
    gameState.usedDots = []
    gameState.drawnLines = []


    if(currentPlayer % 2 == 0) {
        document.getElementById('player').innerHTML = 'Igrač B je na potezu!'
    } else {
        document.getElementById('player').innerHTML = 'Igrač A je na potezu!'
    }
    

    switch (layout) {

        case 0:
            for (let i = 3; i < 9; i++) {
                for (let j = 1; j < 7; j++) {
                    let a = 50 + 100 * i
                    let b = 50 + 100 * j
                    drawCircle({ x: a, y: b}, '#8BD09A')
                    gameState.dots.push({ a, b });
                }
            }
            break

        case 1:
            for (let i = 2; i < 10; i++) {
                for (let j = 0; j < 8; j++) {
                    let a = 50 + 100 * i
                    let b = 50 + 100 * j
                    drawCircle({ x: a, y: b}, '#8BD09A')
                    gameState.dots.push({ a, b });
                }
            }
            break
            
        case 2:
            for (let i = 0; i < 12; i++) {
                for (let j = 0; j < 8; j++) {
                    let a = 50 + 100 * i
                    let b = 50 + 100 * j
                    drawCircle({ x: a, y: b}, '#8BD09A')
                    gameState.dots.push({ a, b });
                }
            }
            break

        case 3:
            for (let i = 2; i < 10; i++) {

                if (i == 2 || i == 9) {
                    for (let j = 2; j < 6; j++) {
                        let a = 50 + 100 * i
                        let b = 50 + 100 * j
                        drawCircle({ x: a, y: b}, '#8BD09A')
                        gameState.dots.push({ a, b });
                    }
                } else if (i == 3 || i == 8) {
                    for (let j = 1; j < 7; j++) {
                        let a = 50 + 100 * i
                        let b = 50 + 100 * j
                        drawCircle({ x: a, y: b}, '#8BD09A')
                        gameState.dots.push({ a, b });
                    }
                } else {
                    for (let j = 0; j < 8; j++) {
                        let a = 50 + 100 * i
                        let b = 50 + 100 * j
                        drawCircle({ x: a, y: b}, '#8BD09A')
                        gameState.dots.push({ a, b });
                    }
                }
            }
            break

        

    }
}

function playerSelect() {
    document.getElementById('mainMenu').style = 'display: none';
    document.getElementById('playerSelect').style = 'display: block';
}

function gridSelect() {
    document.getElementById('playerSelect').style = 'display: none';
    document.getElementById('gridSelect').style = 'display: block';
}

function instructionsPage() {
    document.getElementById('mainMenu').style = 'display: none';
    document.getElementById('instructions').style = 'display: block';
}

function aboutPage() {
    document.getElementById('mainMenu').style = 'display: none';
    document.getElementById('about').style = 'display: block';
}

const gameState = {
    dots: [],
    usedDots: [],
    drawnLines: []
}

function drawLine({ startX, startY, endX, endY }, color) {

    ctx.lineWidth = 6

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
}

function drawCircle({ x, y }, color) {

    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}



window.addEventListener('mousedown', handleClick);

let points = []

let tempA = 0
let tempB = 0
let tempX = 0
let tempY = 0
let diffX = 0
let diffY = 0


let counter = 0

function handleClick(event) {
    const { offsetX: x, offsetY: y } = event;

    let roundX = 0
    let roundY = 0
    let currentCircle = -1
    let dotClicked = false

    if(currentPlayer % 2 == 0) {
        playerColor = '#85B79D'
    } else {
        playerColor = '#694873'
    }



    // detects if (and which) dot is clicked

    gameState.dots.forEach( (value, index) => {
        if (x > value.a - 20 && x < value.a + 20 && y > value.b - 20 && y < value.b + 20) {
            roundX = value.a
            roundY = value.b
            currentCircle = index
            dotClicked = true
        }
    })

    if (dotClicked) {
        counter++
        points.push(currentCircle)
        drawCircle({
            x: gameState.dots.at(currentCircle).a,
            y: gameState.dots.at(currentCircle).b
        }, 'white')
        
    }

    if (counter == 3 && validMove()) {
        counter = 0
        drawTriangle()
        if(gameEnded()) {
            endGame()
        }
        currentPlayer++
        if(currentPlayer % 2 == 0) {
            document.getElementById('player').innerHTML = 'Igrač B je na potezu!'
        } else {
            document.getElementById('player').innerHTML = 'Igrač A je na potezu!'
        }
        points = []
    } else if (counter == 3) {
        points.forEach( (value) => {
            drawCircle({
                x: gameState.dots.at(value).a,
                y: gameState.dots.at(value).b
            }, '#8BD09A')
        })
        counter = 0
        points = []
    }

    
}

function drawTriangle() {

    
    triangleSide(0, 1)
    triangleSide(1, 2)
    triangleSide(2, 0)
    

    //console.log(gameState.usedDots)

    gameState.usedDots.forEach((value) => {
        gameState.dots.forEach((value2, index) => {
            if(value.tempA == value2.a && value.tempB == value2.b) {
                drawCircle({
                    x: value2.a,
                    y: value2.b
                }, 'white')
                delete gameState.dots[index]
            }
            })
        })  
}

function triangleSide(startIndex, endIndex) {
    drawLine({
        startX: gameState.dots.at(points.at(startIndex)).a,
        startY: gameState.dots.at(points.at(startIndex)).b,
        endX: gameState.dots.at(points.at(endIndex)).a,
        endY: gameState.dots.at(points.at(endIndex)).b
    }, playerColor)

    gameState.drawnLines.push({
        startX: gameState.dots.at(points.at(startIndex)).a,
        startY: gameState.dots.at(points.at(startIndex)).b,
        endX: gameState.dots.at(points.at(endIndex)).a,
        endY: gameState.dots.at(points.at(endIndex)).b
    })

    //console.log(gameState.drawnLines)

    diffX = (gameState.dots.at(points.at(startIndex)).a - gameState.dots.at(points.at(endIndex)).a) / 100
    diffY = (gameState.dots.at(points.at(startIndex)).b - gameState.dots.at(points.at(endIndex)).b) / 100

    //console.log(diffX, diffY)



    gameState.dots.forEach((value, index) => {
        tempX = gameState.dots.at(points.at(startIndex)).a
        tempY = gameState.dots.at(points.at(startIndex)).b
        for (let i = 0; i < 100; i++) {
            //console.log(tempX, tempY, diffX, diffY)
            tempX = tempX - diffX 
            tempY = tempY - diffY 
            
            if (tempX > value.a - 16 && tempX < value.a + 16 && tempY > value.b - 16 && tempY < value.b + 16) {
                tempA = value.a
                tempB = value.b
                gameState.usedDots.push({ tempA, tempB })
            }
        }
    })
}

// hvala Dan Fox na stackoverflow za ovu funkciju :) https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function

function linesIntersect(a,b,c,d,p,q,r,s) {
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
  }


// hvala AmitDiwan na tutorialspoint za ovu funkciju :) https://www.tutorialspoint.com/finding-if-three-points-are-collinear-javascript

function collinear(a,b,c,d,p,q) {
    const a1 = {x: a, y: b};
    const b1 = {x: c, y: d};
    const c1 = {x: p, y: q};
    const slope = (coor1, coor2) => (coor2.y - coor1.y) / (coor2.x - coor1.x);
    const areCollinear = (a1, b1, c1) => {
       return slope(a1, b1) === slope(b1, c1) && slope(b1, c1) === slope(c1, a1);
    }

    if (a == c && c == p) {
        return true
    }
    return areCollinear(a1, b1, c1)
}


function validMove() {
    let state = true

    if(
        gameState.dots.at(points.at(0)) == gameState.dots.at(points.at(1)) || 
        gameState.dots.at(points.at(1)) == gameState.dots.at(points.at(2)) ||
        gameState.dots.at(points.at(2)) == gameState.dots.at(points.at(0))
        ) {state = false}

    points.forEach((value1, index1) => {
        gameState.drawnLines.forEach((value, index) => {
            
            if (linesIntersect(
                value.startX,
                value.startY,
                value.endX,
                value.endY,
                gameState.dots.at(points.at(index1)).a, 
                gameState.dots.at(points.at(index1)).b, 
                gameState.dots.at(points.at(index1 - 1)).a, 
                gameState.dots.at(points.at(index1 - 1)).b, 
            ))
            state = false            
        })
    })

    if (collinear(
        gameState.dots.at(points.at(0)).a, 
        gameState.dots.at(points.at(0)).b, 
        gameState.dots.at(points.at(- 1)).a, 
        gameState.dots.at(points.at(- 1)).b, 
        gameState.dots.at(points.at(- 2)).a, 
        gameState.dots.at(points.at(- 2)).b
    )) {state = false}
    
        //console.log(state)
        return state
}

function gameEnded() {
    let ended = true
    gameState.dots.forEach((valueA, indexA) => {
        gameState.dots.forEach((valueB, indexB) => {
            gameState.dots.forEach((valueC, indexC) => {
                points = []
                points.push(indexA)
                points.push(indexB)
                points.push(indexC)
                if(validMove()) {
                    ended = false
                }
            })
        })
    })
    return ended
}

function endGame() {
    document.getElementById('gameGrid').style = 'display: none';
    document.getElementById('playAgain').style = 'display: block';

    currentPlayer++

    if (currentPlayer % 2 == 0) { 
        document.getElementById('winner').innerHTML = 'Igrač A je pobijedio!';
    } else {
        document.getElementById('winner').innerHTML = 'Igrač B je pobijedio!';
    }

}


//console.log(gameState.dots)