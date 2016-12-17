/* -------------------------------------------------------------------------- */
/* Initializes variables and event listeners for board and scoring cell       */
/* -------------------------------------------------------------------------- */

/* ------------------------------------- */
/*           Shared Variables            */
/* ------------------------------------- */
var move_queue = [];       // array of moves to implement
var first_move = true;     // if true then user goes first
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
  resizeBoard();
};

/* Get user input */
document.querySelector("body").onload = function() {
  // initialize difficulty
  var el = document.querySelector("#difficulty-" + difficulty).childNodes[3];
  el.className = "fa fa-check check-on";

  // initialize board size
  switch (board_size) {
    case "small":  makeBoard(4,4); n_rounds=16; break;
    case "medium": makeBoard(5,5); n_rounds=25; break;
    case "large":  makeBoard(6,6); n_rounds=36; break;
    default: throw  "board size not defined";
  }
  el = document.querySelector("#size-" + board_size).childNodes[3];
  el.className = "fa fa-check check-on";

  // initialize scoring cell
  requestId = makeScoringCell.animateCell();
};

/* Update menu values */
function setMenuValue(el, var_name, value_name, value) {
  var new_value = el.id.match(/-(.*)/)[1];
  window[var_name] = new_value;
  if (new_value != value) {
    // turn off old value
    document.querySelector("#" + value_name + "-" + value)
    .childNodes[3].className = "fa fa-check check-off";
    // turn off on new value
    document.querySelector("#" + value_name + "-" + new_value)
    .childNodes[3].className = "fa fa-check check-on";
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
}

/* Update board size */
document.querySelector("#board-size")
.childNodes.forEach(function(el) {el.onclick = setSize;});
function setSize() { setMenuValue(this, "board_size", "size", board_size); }


/* Update first move */
(function() {
  document.getElementsByName("first-move").forEach(
    function(el) {
      el.addEventListener("click", function() {
        first_move = !first_move;
        resetBoard();
      }
    );
  });
})();

/* Update board size */
function resizeBoard() {
  var header_width;
  var header_height;
  var main_width;
  var main_height;

  // get window and header size
  var window_height = window.innerHeight;
  var window_width = window.innerWidth;

  // check orientation
  if (window_height>window_width) {
    // if portrait then 3-row format (subtract header and footer)
    header_height = document.querySelector("#header").clientHeight;
    main_width = window_width;
    main_height = window_height - header_height - 65;
  } else {
    // if landscape then 2-col format (no header and footer)
    header_width = document.querySelector("#header").clientWidth;
    main_width = window_width - header_width;
    main_height = window_height;
  }
  // resize main display
  document.querySelector("#main").style.height = main_height + "px";

  // resize board
  var board = document.querySelector("#board");
  var board_width = Math.min(main_width-75, main_height-140);
  board.style.maxWidth =  board_width + "px";
  board.style.maxHeight = board_width + "px";

  // resize game
  var game = document.querySelector("#game");
  game.style.maxWidth =  (board_width) + "px";
  game.style.maxHeight = (board_width+140) + "px";
}


/* ------------------------------------- */
/*           Button Listeners            */
/* ------------------------------------- */
/* --------------- */
/*  Intro Buttons  */
/* --------------- */
// play button
document.querySelector("#play-button").onclick = function() {
  document.querySelector("#introduction").style.display = "none";
  document.querySelector("#overlay").style.zIndex  = 0;
};
// tutorial button

/* -------------- */
/*  Game Buttons  */
/* -------------- */
// reset button
document.querySelector("#reset-button").onclick = resetBoard;

// undo button (see make_board.js)


/* ------------------- */
/*  Game Over Buttons  */
/* ------------------- */
// switch button
document.querySelector("#switch-button").onclick = function() {
  first_move = !first_move;
  resetBoard();
  document.querySelector("#game-over-container").style.display = "none";
  document.querySelector("#overlay").style.zIndex  = 0;
};
// statistics button
document.querySelector("#stats-button").onclick = function() {
  document.querySelector("#game-over-container").style.display = "none";
  document.querySelector("#statistics-overlay").style.display = "flex";
};
// repeat (play again) button
document.querySelector("#repeat-button").onclick = function() {
  resetBoard();
  document.querySelector("#game-over-container").style.display = "none";
  document.querySelector("#overlay").style.zIndex  = 0;
};


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
  makeDifferenceGraph(scores, first_move, makeScoringCell.player_colors);
  makeIndividualGraph(scores, first_move, makeScoringCell.player_colors);
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

function easeIn(el, duration=1) {
  el.style.opacity = 0;
  el.style.filter = "alpha(opacity=0)";
  var op = 0;             // initial opacity
  var t = 0;              // initial time
  var dt = 1/60/duration; // timestep (duration in seconds)
  var anim_id = requestAnimationFrame(increaseOpacity);

  // update opacity using op = 1-(1-t)^2 = t*(2-t)
  function increaseOpacity() {
    t += dt;
    op = t*(2-t);
    console.log(op);
    if (t >= 1){
      el.style.opacity = 1;
      el.style.filter = "alpha(opacity=100)";
      cancelAnimationFrame(anim_id);
    } else {
      el.style.opacity = op;
      el.style.filter = "alpha(opacity=" + op * 100 + ")";
      anim_id = requestAnimationFrame(increaseOpacity);
    }
  }
}

function easeOut(el, duration=1) {
  el.style.opacity = 1;
  el.style.filter = "alpha(opacity=100)";
  var op = 0;             // initial opacity
  var t = 0;              // initial time
  var dt = 1/60/duration; // timestep (duration in seconds)
  var anim_id = requestAnimationFrame(decreaseOpacity);

  // update opacity using op = 1 - t^2
  function decreaseOpacity() {
    t += dt;
    op = 1-t*t;
    if (t >= 1){
      el.style.opacity = 0;
      el.style.filter = "alpha(opacity=0)";
      cancelAnimationFrame(anim_id);
    }
    else {
      el.style.opacity = op;
      el.style.filter = "alpha(opacity=" + op * 100 + ")";
      anim_id = requestAnimationFrame(decreaseOpacity);
    }
  }
}


/* Gradually update score difference (for scoring cell color) */
function updateDiff(plyr) {
  var new_diff = score[0] - score[1];
  var total_change = (new_diff - diff);
  var dx = total_change/30;
  var player_score = document.querySelector("#score" + plyr);
  var requestIncDiffId = requestAnimationFrame(incrementDiff);

  // increment diff by dx and repeat 60 times a second
  function incrementDiff() {
    diff += dx;
    // check to see if calculation is over
    if (Math.abs(diff - new_diff)> Math.abs(dx)) {
      requestIncDiffId = requestAnimationFrame(incrementDiff);
    } else {
      diff = new_diff; // make sure everything no round off error
      cancelAnimationFrame(requestIncDiffId);
      // is_busy = false;
    }

    // update score display
    player_score.innerHTML = ( plyr==0 ?
      "You: " + Math.round(score[plyr] + diff-new_diff) :
      "AI: " + Math.round(score[plyr] + new_diff-diff)
    ) ;
  }
}

function toggleMenu() {
  document.getElementById("options-menu").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('#menu-link')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (!event.target.matches('.dropdown *') && openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
