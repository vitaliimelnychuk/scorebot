//
// Aggresive strategy "run-and-kick"- all players run to ball and kick it if possible to any direction
//
'use strict';

function getPlayerMove(data) {
  var currentPlayer = data.yourTeam.players[data.playerIndex];
  var ball = data.ball;
  var direction;
  var attackDirection;
  var max_y = data.settings.field.height;

  var ballStop = getBallStats(ball, data.settings);
  if (ballStop.x < currentPlayer.x) {
    direction = getDefendDirection(data, currentPlayer, ballStop);
    attackDirection = getAttackDirection(data, currentPlayer, ballStop, max_y)
  } else {
    var direction = getAttackDirection(data, currentPlayer, ballStop);
  }
  if (currentPlayer.x > 400) {
    direction += getRandomArbitrary(-0.5, 0.5);
  } else {
    direction += getRandomArbitrary(-0.2, 0.2);
  }
  var velocity = currentPlayer.velocity + data.settings.player.maxVelocityIncrement;

  var players = getPlayersInfo(data, ballStop);
  var thirdPlayer = getThirdDefender(players);
  if (data.playerIndex == thirdPlayer.index
    && data.ball.settings.x == 354
    && data.ball.settings.y == 236.5) {
    velocity = 1.5
  }

  return {
    direction: direction,
    velocity
  };
}

function getAttackDirection(data, currentPlayer, ballStop, max_y) {
  if ((data.playerIndex == 2 && ballStop.y < max_y / 4) || (data.playerIndex == 0 && ballStop.y > (max_y / 2 + max_y / 4))) {
    return Math.atan2(max_y / 2 - currentPlayer.y, ballStop.x - currentPlayer.x - data.ball.settings.radius);
  } else {
    return Math.atan2(ballStop.y - currentPlayer.y, ballStop.x - currentPlayer.x - data.ball.settings.radius);
  }
}

function getDefendDirection(data, currentPlayer, ballStop) {
  var xDiff = ballStop.x - currentPlayer.x;
  var yDiff = ballStop.y - currentPlayer.y;

  var xDelta = - data.ball.settings.radius;
  var yDelta = 21;
  if (currentPlayer.y < ballStop.y) {
    yDelta *= -1;
  }

  var xBallDiff = xDiff + xDelta;
  var yBallDiff = yDiff + yDelta;

  return Math.atan2(yBallDiff, xBallDiff);
}

function getThirdDefender(players) {
  return players[2]
}

function getSecondDefender(players) {
  return players[1];
}
function getPlayersInfo(data, ballStop) {
  var players = []
  for (var i in data.yourTeam.players) {
    var player = data.yourTeam.players[i];
    players[i] = {
      distToBall: getDispance(player.x, player.y, ballStop.x, ballStop.y),
      index: i
    }
  }
  players.sort(function (a, b) {
    return a.distToBall - b.distToBall;
  });

  return players;
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

function getDispance(x1, y1, x2, y2) {

  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

onmessage = (e) => postMessage(getPlayerMove(e.data));
