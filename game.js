let canvas = document.getElementById("game");
let context = canvas.getContext("2d");
//set the font and size for text
context.fillStyle = "#FFFF00";
context.font = "18px Arial";
//load all the images
let background = new Image();           
background.src = "https://raw.githubusercontent.com/luftbuefel/flappyBlobfish/master/background.png";
let player = new Image();
player.src = "https://raw.githubusercontent.com/luftbuefel/flappyBlobfish/master/player.png"; //"player.png"; //"http://piq.codeus.net/static/media/userpics/piq_171575_400x400.png";
//added size to the top barrier so it would position properly before the art is loaded CCC MAKE THIS MORE ROBUST LATER
let topBarrier = new Image(23, 512);
topBarrier.src = "https://raw.githubusercontent.com/luftbuefel/flappyBlobfish/master/barrier.png"; //"barrier.png" //"barrierTop.png";//http://pixelartmaker.com/art/39bfde85b8af3d6.png";

let bottomBarrier = new Image();
bottomBarrier.src = "https://raw.githubusercontent.com/luftbuefel/flappyBlobfish/master/barrierB.png";
//"barrierB.png" //"barrierBottom.png";
/*
//load all the sounds
let flapping = new Sound();
//flap.src = "";
let pointAdded = new Sound();
//pointAdded.src="";
*/
//positioning variables
//player y is the center of the canvas
let targetPlayerY = (canvas.height / 2) - (player.height / 2);
let playerX = 30;
let playerY = targetPlayerY
let maxPlayerMovePerFrame = 5; //3;
let playerIsAlive = true;

let gravity = -3;
let flapAmount = 60;
//controls flapping
let keyIsPressed = false;
let barrierSpeed = -2;
let BARRIER_GAP = 150;
//because we don't want the hole to be completely flush with the top or bottom
let MIN_BARRIER_MARGIN = 20;

let score = 0;
let SCORE_TEXT = "Score: ";
let POINT_AMOUNT = 1;

//barriers
let barriers = [];

function updateCanvas() {
  if (playerIsAlive) {
    //draw the background
    context.drawImage(background, 0, 0);
    //move and then draw the player if it is still alive
    movePlayer();
    context.drawImage(player, playerX, playerY);
    //move the barriers
    moveBarriers();
    //draw the barriers
    for (var i = 0; i < barriers.length; i++) {
      //draw the top barrier
      context.drawImage(topBarrier, barriers[i].x, barriers[i].y);
      //draw the bottom barrier under the top barrier
      context.drawImage(bottomBarrier, barriers[i].x, barriers[i].y + topBarrier.height + BARRIER_GAP);
    }
    //draw the score
    context.fillText(SCORE_TEXT + score, 10, 30)
    window.requestAnimationFrame(updateCanvas);
  }
}

//create the first barriers
function initializeBarriers() {
  addBarrier();
  //addBarrier();
  //barriers[1].x = canvas.width+(canvas.width-topBarrier.width);
}

//min position is -top column height
//max position is canvas.height-topBarrier.height-BARRIER_GAP
//barrier range is (canvas.height-(2*MIN_BARRIER_MARGIN)))
//-topBarrier.height+MIN_BARRIER_MARGIN+(Math.round(Math.random()*canvas.height-(2*MIN_BARRIER_MARGIN)))
function addBarrier() {
  barriers.push({
    x: canvas.width,
    y: -topBarrier.height + MIN_BARRIER_MARGIN + (((canvas.height - (2 * MIN_BARRIER_MARGIN)) - BARRIER_GAP) * Math.random())
  });
}

function removeBarrier() {
  barriers.shift();
}

function movePlayer() {
  //apply gravity
  targetPlayerY -= gravity;
  //this smoothes out the flapping animation
  if (playerY < targetPlayerY - maxPlayerMovePerFrame) {
    playerY += maxPlayerMovePerFrame;
  } else if (playerY > targetPlayerY + maxPlayerMovePerFrame) {
    playerY -= maxPlayerMovePerFrame;
  } else {
    playerY = targetPlayerY;
  }
  checkPlayerForCollisions();
}

function checkPlayerForCollisions() {
  playerIsAlive = true;
  //check if the player touching the top or bottom edge
  if (playerY <= 0 || playerY >= canvas.height - player.height) {
    playerIsAlive = false;
  } else {
    //check if the player is touching a barrier
    for (var i = 0; i < barriers.length; i++) {
      var barrier = barriers[i];
      //check if it is in the same x space as a barrier
      if (playerX >= barrier.x - player.width && playerX <= barrier.x + topBarrier.width) {
        //check the y axis
        if (!(playerY > barrier.y + topBarrier.height && playerY + player.height < barrier.y + topBarrier.height + BARRIER_GAP)) {
          playerIsAlive = false;
        }
      }
    }
  }
  if (!playerIsAlive) {
    die();
  }
}

function die() {
  location.reload();
}

function moveBarriers() {
  for (var i = 0; i < barriers.length; i++) {
    barriers[i].x += barrierSpeed;
    //remove and repopulate the barriers once they are offscreen
    if (barriers[i].x < -topBarrier.width) {
      removeBarrier();
      addBarrier();
      addToScore();
    }
  }
}

function addToScore() {
  score++;
}

function flap() {
  if (!keyIsPressed) {
    keyIsPressed = true;
    targetPlayerY -= flapAmount;
  }
}

function keyUp() {
  keyIsPressed = false;
}

document.addEventListener("keydown", flap);

document.addEventListener("keyup", keyUp);
initializeBarriers();
updateCanvas();
