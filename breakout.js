var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var ballRadius = 10

//stating point of ball
var x = canvas.width / 2;
var y = canvas.height - 30;

//add frames to x and y to make the ball appear like it's moving
var dx = 2;
var dy = -2;

var padHeight = 10;
var padWidth = 75;
var padX = (canvas.width-padWidth)/2;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status:1 };
    }
}

var score = 0;
var lives = 3;

var rightPress = false;
var leftPress = false;

document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        padX = relativeX - padWidth/2;
    }
}

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPress = true;
    }
    else if(e.keyCode == 37) {
        leftPress = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPress = false;
    }
    else if(e.keyCode == 37) {
        leftPress = false;
    }
}

function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
	            if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
	                dy = -dy;
	                b.status = 0;
	                score ++;
	                if (score == brickRowCount * brickColumnCount) {
	                	alert("YOU WIN, YAY!!!");
	                	document.location.reload();
	                }
	            }    
            }
        }
    }
}

function drawScore() {
	ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawBall() {
  ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = '#0095DD';
	ctx.fill();
	ctx.closePath();
}

function ballColor(){
	var col = ["#ff0000", "#ff4000", "#ff6600", "#ff8000", "#ffbf00", "#ffff00", "bfff00", "#80ff00", "#40ff00", "#00ff00", "#00ff80", "#00ffbf", "#00ffff", "#00bfff", "#0080ff", "#0040ff", "#0000ff", "#4000ff", "#8000ff", "#bf00ff", "#ff00ff", "#ff00bf", "#ff0080", "#ff0040", "#ff0000"];
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(padX, canvas.height-padHeight, padWidth, padHeight);
  ctx.fillstyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
        	if(bricks[c][r].status == 1) {
	            var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
	            var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
	            bricks[c][r].x = brickX;
	            bricks[c][r].y = brickY;
	            ctx.beginPath();
	            ctx.rect(brickX, brickY, brickWidth, brickHeight);
	            ctx.fillStyle = "#0095DD";
	            ctx.fill();
	            ctx.closePath();
	        }    
        }
    }
}

function draw() {
  //erase previous frames, so no trail is left
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  
  //makes ball bounce off all walls except the bottom 
	if(x + dx < ballRadius || x + dx > canvas.width-ballRadius) {
	  dx = -dx;
	} 
	if(y + dy < ballRadius) {
		dy = -dy;
	} else if (y + dy > canvas.height-ballRadius) {
		if (x > padX && x < padX + padWidth) {
			dy = -dy * 1.1;
		} else {
			lives--;
			if(!lives) {
				alert("GAME OVER");
	  			document.location.reload();
	  		} else {
	  			x = canvas.width/2;
			    y = canvas.height-30;
			    dx = 2;
			    dy = -2;
			    padX = (canvas.width-padWidth)/2;
			}
		}
	}
	
	//stops paddle going aff the edge of the canvas
	if(rightPress && padX < canvas.width-padWidth) {
	  padX += 7;
	} 
	else if (leftPress && padX > 0) {
	  padX -= 7;
	}
	
	x += dx;
	y += dy;

	requestAnimationFrame(draw);
}

draw();
//setInterval(draw, 10);
