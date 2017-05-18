var c = document.getElementById("myCanvas");
c.onclick = handleClick;
var ctx = c.getContext("2d");
var SQ_SIZE = 50;
var GRID_SIZE = 8;
var NUM_COLORS = 7;
var score = 0;

var array = [[],[],[],[],[],[],[],[]];
var matchBuffer = [];
drawSquares(array,true);
updateScore();

function autoPlay(){
	setInterval(clickNext,10);
}

function clickNext(){
	var e = {x: randInt(400)+8, y: randInt(400)+8};
	handleClick(e);
}

function handleClick(e){
	var i = Math.floor((e.x - 8)/SQ_SIZE);
	var j = Math.floor((e.y - 8)/SQ_SIZE);
	if(i >= GRID_SIZE || j >= GRID_SIZE){
		return;
	}
	if(isMatchingSquareAdjacent(i,j)){
		clearMatches(i,j, array[i][j]);
		fillIn();
		matchBuffer = [];
		drawSquares(array,false);
		updateScore();
	}
	checkLoss();
}

function updateScore(){
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.rect(SQ_SIZE * GRID_SIZE + 10,0,100,50);
	ctx.fill();
	ctx.font = "12px Arial";
	ctx.fillStyle = "green";
	ctx.fillText("Score:",SQ_SIZE * GRID_SIZE + 10,20);
	ctx.fillText(score,SQ_SIZE * GRID_SIZE + 10,40);
}

function checkLoss(){
	for(i = 0; i < GRID_SIZE; i++){
		for(j = 0; j < GRID_SIZE; j++){
			if(isMatchingSquareAdjacent(i,j)){
				return;
			}
		}
	}
	lose();
}

function lose(){
	ctx.font = "30px Arial";
	ctx.fillStyle = "black";
	ctx.fillText("GAME OVER",window.innerWidth / 2 - 90,window.innerHeight / 2 - 15);
}

function isMatchingSquareAdjacent(i,j){
	var left = false;
	var right = false;
	var up = false;
	var down = false;
	if(j>0){
		left = array[i][j-1] == array[i][j];
	}
	if(j<GRID_SIZE - 1){
		right = array[i][j+1] == array[i][j];
	}
	if(i>0){
		up = array[i-1][j] == array[i][j];
	}
	if(i<GRID_SIZE - 1){
		down = array[i+1][j] == array[i][j];
	}
	return left || right || up || down;
}

function clearMatches(i, j, color){
	if(!bufferHasValue(i,j)){
		if(array[i][j] == color){
			score += 10;
			matchBuffer.push([i,j]);
			array[i][j] = -1;
			if(i>0){
				clearMatches(i-1,j,color);
			}
			if(i<GRID_SIZE - 1){
				clearMatches(i+1,j,color);
			}
			if(j>0){
				clearMatches(i,j-1,color);
			}
			if(j<GRID_SIZE - 1){
				clearMatches(i,j+1,color);
			}
		}
	}
}

function fillIn(){
	for(i = GRID_SIZE - 1; i >= 0; i--){
		for(j = GRID_SIZE - 1; j > 0; j--){
			if(array[i][j] == -1){
				for(k = j-1; k >= 0; k--){
					if(array[i][k] != -1){
						array[i][j] = array[i][k];
						array[i][k] = -1;
						break;
					}
				}
			}
		}
	}
}

function bufferHasValue(i,j){
	for(k = 0; k < matchBuffer.length; k++){
		if(matchBuffer[k][0] == i){
			if(matchBuffer[k][1] == j){
				return true;
			}
		}
	}
	return false;
}

function drawSquares(array, random){
	for(i = 0; i < GRID_SIZE; i ++) {
		for(j = 0; j < GRID_SIZE; j++){
			if(random == true){
				array[i].push(randInt(NUM_COLORS));
			}
			if(array[i][j] == -1){
				array[i][j] = randInt(NUM_COLORS);
			}
			var drawMethod = getDrawMethodForNumber(array[i][j]);
			drawSquare(i,j,-1); // Clear square before drawing
			drawMethod(i,j,array[i][j]);
		}
	}
}

function getDrawMethodForNumber(n){
	switch(n){
		case 0:
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
			return drawSquare;
		case 6:
			return drawCircle;
		default:
			return drawSquare;
	}
}

function drawSquare(i,j,num){
	ctx.beginPath();
	ctx.rect(i * SQ_SIZE + 1, j * SQ_SIZE + 1, SQ_SIZE - 2, SQ_SIZE - 2);
	ctx.fillStyle = numToColorString(num);
	ctx.fill();
}

function drawCircle(i,j,num) {
	ctx.beginPath();
	ctx.arc(i * SQ_SIZE + 0.5 * SQ_SIZE, j * SQ_SIZE + 0.5 * SQ_SIZE, 0.5 * SQ_SIZE - 1, 0, 2 * Math.PI);
	ctx.fillStyle = "pink";
	ctx.fill();
}

function numToColorString(num){
	switch(num) {
		case 0:
			return "red";
		case 1:
			return "blue";
		case 2:
			return "yellow";
		case 3:
			return "green";
		case 4:
			return "orange";
		case 5:
			return "purple";
		case -1:
			return "white";
		default:
			return "black";
	}
}

function randInt(n){
	return Math.floor(Math.random() * n);
}