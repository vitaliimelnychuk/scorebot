//
// Aggresive strategy "run-and-kick"- all players run to ball and kick it if possible to any direction
//
'use strict';

function getPlayerMove(data) {
  var currentPlayer = data.yourTeam.players[data.playerIndex];
  var ball = data.ball;
  var direction;
  var attackDirection;

  var ballStop = getBallStats(ball, data.settings);
  if (ballStop.x < currentPlayer.x) {
    direction = getDefendDirection(data, currentPlayer, ballStop);
    attackDirection = getAttackDirection(data, currentPlayer, ballStop)
  } else {
    var direction = getAttackDirection(data, currentPlayer, ballStop);
  }
  direction += getRandomDirection();

  return {
    direction: direction,
    velocity: currentPlayer.velocity + data.settings.player.maxVelocityIncrement
  };
}

function getAttackDirection(data, currentPlayer, ballStop, ) {
  return Math.atan2(ballStop.y - currentPlayer.y, ballStop.x - currentPlayer.x - data.ball.settings.radius);
}

function getDefendDirection(data, currentPlayer, ballStop) {
  var xDiff = ballStop.x - currentPlayer.x;
  var yDiff = Math.abs(ballStop.y - currentPlayer.y);
  var delta = 0;

  var xDelta = data.ball.settings.radius * 2;
  var xBallDiff = (xDiff - xDelta + delta);

  return Math.atan2(ballStop.y - currentPlayer.y, xBallDiff);
}

function getBallStats(ball, gameSettings) {
  var stopTime = getStopTime(ball);
  var stopDistance = ball.velocity * stopTime
    - ball.settings.moveDeceleration * (stopTime + 1) * stopTime / 2;

  var x = ball.x + stopDistance * Math.cos(ball.direction);
  var y = Math.abs(ball.y + stopDistance * Math.sin(ball.direction));

  // check the reflection from field side
  if (y > gameSettings.field.height) y = 2 * gameSettings.field.height - y;

  return { stopTime, stopDistance, x, y };
}

function getStopTime(ball) {
  return ball.velocity / ball.settings.moveDeceleration;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomDirection() {
  return getRandomArbitrary(-0.01, 0.01);
}
onmessage = (e) => postMessage(getPlayerMove(e.data));
