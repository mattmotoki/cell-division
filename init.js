/* -------------------------------------------------------------------------- */
/* Initializes variables and event listeners for board and scoring cell       */
/* -------------------------------------------------------------------------- */

/* ------------------------------------- */
/*           Shared Variables            */
/* ------------------------------------- */
var move_queue = [];       // array of moves to implement
var first_move = "you";     // if true then user goes first
var board_size = "small";  // board size
var difficulty = "medium"; // AI difficulty
var score = [0, 0];        // your score and AI's score
var diff = 0;              // your score minus AI's score
var n_rounds = 0;          // number of rounds per game
/* Create a game log (for easier undos and for score visualization)*/
var game_log = [];


/* ------------------------------------- */
/*            Event Listeners            */
/* ------------------------------------- */

/* resize listener   */
window.onresize = function() {
  makeScoringCell.resizeCanvas();
};

/* Get user input */
document.querySelector("body").onload = function() {
  // initialize difficulty
  document.querySelector("#difficulty-" + difficulty)
  .style.textDecoration = "underline";

  // initialize board size
  switch (board_size) {
    case "small":  makeBoard(4,4); n_rounds=16; break;
    case "medium": makeBoard(5,5); n_rounds=25; break;
    case "large":  makeBoard(6,6); n_rounds=36; break;
    default: throw  "board size not defined";
  }
  document.querySelector("#size-" + board_size)
  .style.textDecoration = "underline";

  // initialize first move
  document.querySelector("#move-" + first_move)
  .style.textDecoration = "underline";

  // simulate hover effects
  document.querySelector("#move-ai").onmouseover = function(el) {
    el.target.style.color = vec2rgb(makeScoringCell.player_colors[1]);
  };
  document.querySelector("#move-ai").onmouseleave = function(el) {
    el.target.style.color = "white";
  };

  // initialize scoring cell
  requestId = makeScoringCell.animateCell();
};

/* Update menu values */
function setMenuValue(el, var_name, value_name, value) {
  var new_value = el.id.match(/-(.*)/)[1];
  window[var_name] = new_value;
  if (new_value != value) {
    // turn off underline
    document.querySelector("#" + value_name + "-" + value)
    .style.textDecoration = "none";
    // turn on underline
    document.querySelector("#" + value_name + "-" + new_value)
    .style.textDecoration = "underline";
    // reset the game
    resetBoard();
  }
}

/* Update difficulty */
document.querySelector("#ai-difficulty")
.childNodes.forEach(function(el) {el.onclick = setDifficulty;});
function setDifficulty() {
  setMenuValue(this, "difficulty", "difficulty", difficulty);
  makeScoringCell.setAIColor();
  document.querySelector("#move-ai").childNodes[1].style.color = vec2rgb(makeScoringCell.player_colors[1]);
}

/* Update board size */
document.querySelector("#board-size")
.childNodes.forEach(function(el) {el.onclick = setSize;});
function setSize() { setMenuValue(this, "board_size", "size", board_size); }

/* Update first move */
document.querySelector("#first-move")
.childNodes.forEach(function(el) {el.onclick = setFirstMove;});
function setFirstMove() { setMenuValue(this, "first_move", "move", first_move); }


/* ------------------------------------- */
/*           Button Listeners            */
/* ------------------------------------- */
// undo button (see make_board.js)
// statistics button
document.querySelector("#stats-button").onclick = function() {
  document.querySelector("#game-over-container").style.display = "none";
  document.querySelector("#statistics-overlay").style.display = "flex";
};
// reset button
document.querySelector("#reset-button").onclick = resetBoard;


/* ------------------------------------- */
/*                Overlays               */
/* ------------------------------------- */
function showGameOverMessage() {
  // update display
  document.querySelector("#game-over-container").style.display = "flex";
  document.querySelector("#overlay").style.zIndex  = 1;

  // update message
  var game_message = "The game is a draw.";
  if (score[0] > score[1]) { game_message = "Congratulations you won!"; }
  else if (score[0] < score[1]) { game_message = "Sorry, you lost."; }
  document.querySelector("#game-over-message").innerHTML = game_message;

  // create graphics
  var scores = game_log.map(function(x) {return x.score;} );
  makeDifferenceGraph(scores, first_move=="you", makeScoringCell.player_colors);
  makeIndividualGraph(scores, first_move=="you", makeScoringCell.player_colors);
}
// statistics overlay
document.querySelector("#statistics-overlay").onclick = function(el){
  document.querySelector("#game-over-container").style.display = "flex";
  document.querySelector("#statistics-overlay").style.display = "none";
  document.querySelector("#overlay").style.zIndex  = 0;
};

/* ------------------------------------- */
/*            Helper Functions           */
/* ------------------------------------- */
function resetBoard() {
  // reset scores
  score = [0, 0];   diff = 0;   game_log = [];
  document.querySelector("#score0").innerHTML = "You: 0";
  document.querySelector("#score1").innerHTML = "AI: 0";

  // delete board
  var parent = document.querySelector("#board-container");
  var child =  document.querySelector("#board");
  parent.removeChild(child);

  // set board dimensions
  switch (board_size) {
    case "small":  makeBoard(4,4); n_rounds=16; break;
    case "medium": makeBoard(5,5); n_rounds=25; break;
    case "large":  makeBoard(6,6); n_rounds=36; break;
    default: throw  "board size not defined";
  }
}

/* ------------------------------------- */
/*               Animation               */
/* ------------------------------------- */
/* fading function */
function easeElement(el, in_or_out="out", duration=1, power=3) {
  var t = 0;                             // initial time
  var dt = 1/60/duration;                // timestep (duration in seconds)
  var initial_op = 1*(in_or_out=="out"); // initial opacity

  // initialize
  var op = initial_op;
  el.style.opacity = initial_op;
  el.style.filter = "alpha(opacity=" + initial_op*100 + ")";
  var anim_id = requestAnimationFrame(updateOpacity);
  // update opacity: 1-t^power (out) or t^power (in)
  function updateOpacity() {
    t += dt;
    op = in_or_out=="out" ? 1-Math.pow(t, power) : Math.pow(t, power);
    if (t >= 1){
      el.style.opacity = 1-initial_op;
      el.style.filter = "alpha(opacity=" + (1-initial_op)*100 + ")";
      cancelAnimationFrame(anim_id);
    } else {
      el.style.opacity = op;
      el.style.filter = "alpha(opacity=" + op*100 + ")";
      anim_id = requestAnimationFrame(updateOpacity);
    }
  }
}

/* ------------------------------------- */
/*           Utility Functions           */
/* ------------------------------------- */
/* Element-wise convex combination of two vectors */
function cvx_comb(v1, v2, alpha) {
  var vec = [];
  for (var i = 0; i <v1.length; i++) {
    vec.push( Math.round(alpha*v1[i] + (1-alpha)*v2[i]) );
  }
  return vec;
}

/* Convert entries in a vector into an rgb string */
function vec2rgb(vec) {
  return "rgb(" + vec[0] + "," + vec[1] + "," + vec[2] + ")";
}

/* Convert entries in a vector into an rgba string */
function vec2rgba(vec) {
  return "rgba(" + vec[0] + "," + vec[1] + "," + vec[2] + "," + vec[3] + ")";
}
