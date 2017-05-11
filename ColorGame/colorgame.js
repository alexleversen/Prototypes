var c = document.getElementById("myCanvas");
c.onclick = handleClick;
var ctx = c.getContext("2d");
var SQ_SIZE = 50;
var GRID_SIZE = 8;

var array = [[],[],[],[],[],[],[],[]];
var matchBuffer = [];
drawSquares(array,true);

function handleClick(e){
	var i = Math.floor((e.x - 8)/SQ_SIZE);
	var j = Math.floor((e.y - 8)/SQ_SIZE);
	clearMatches(i,j, array[i][j]);
	fillIn();
	matchBuffer = [];
	drawSquares(array,false);
}

function clearMatches(i, j, color){
	console.log("calling clearMatches("+i+","+j+") with color " + numToColorString(color));
	if(!bufferHasValue(i,j)){
		if(array[i][j] == color){
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
				array[i].push(randInt(6));
			}
			if(array[i][j] == -1){
				array[i][j] = randInt(6);
			}
			drawSquare(i,j,array[i][j]);
		}
	}
}

function drawSquare(i,j,num){
	ctx.beginPath();
	ctx.rect(i * SQ_SIZE, j * SQ_SIZE, SQ_SIZE, SQ_SIZE);
	ctx.fillStyle = numToColorString(num);
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