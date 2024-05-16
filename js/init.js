/* -------------------------------------------------------------------------- */
/* Initializes variables and event listeners for board and scoring cell       */
/* -------------------------------------------------------------------------- */

/* ------------------------------------- */
/*           Shared Variables            */
/* ------------------------------------- */
var game_over = false;     // game over flag
var first_move = "you";    // if true then user goes first
var board_size = "large";  // board size
var difficulty = "hard"; // AI difficulty
var score = [0, 0];        // your score and AI's score
var n_rounds = 0;          // number of rounds per game
/* Create a game log (for easier undos and for score visualization)*/
var game_log = [];
/* Sound effects */
var init_sound = new Howl({
  urls: ["sounds/mouth-40.wav"],
  volume: 0.5,
  sprite: { blop: [0, 250]}
});
var low_sound = new Howl({
  urls: ["sounds/jump-c-04.wav"],
  volume: 1.0,
  sprite: { blop: [0, 250]}
});
var mid_sound = new Howl({
  urls: ["sounds/blop.wav"],
  volume: 0.5,
  sprite: { blop: [0, 1000]}
});
var high_sound = new Howl({
  urls: ["sounds/bong-chime-3.mp3"],
  volume: 0.4,
  sprite: { blop: [0, 2000]}
});


/* ------------------------------------- */
/*            Event Listeners            */
/* ------------------------------------- */

/* resize listener   */
window.onresize = function() {
  makeScoringCell.resizeCanvas();
  if (game_over) {makeGraphics();}
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

  // cache cells for current game
  cacheCells();
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
// document.querySelector("#ai-difficulty").childNodes.forEach(function(el) {el.onclick = setDifficulty;});
(function() {
  var difficulty_list = document.querySelector("#ai-difficulty").childNodes;
  for (var i=0; i<difficulty_list.length; i++) {
    difficulty_list[i].onclick = setDifficulty;
  }
})();
function setDifficulty() {
  setMenuValue(this, "difficulty", "difficulty", difficulty);
  makeScoringCell.setAIColor();
  document.querySelector("#move-ai").childNodes[1].style.color = vec2rgb(makeScoringCell.player_colors[1]);
  cacheCells();
}

/* Update board size */
// document.querySelector("#board-size").childNodes.forEach(function(el) {el.onclick = setSize;});
(function() {
  var size_list = document.querySelector("#board-size").childNodes;
  for (var i=0; i<size_list.length; i++) {
    size_list[i].onclick = setSize;
  }
})();
function setSize() { setMenuValue(this, "board_size", "size", board_size); }

/* Update first move */
// document.querySelector("#first-move").childNodes.forEach(function(el) {el.onclick = setFirstMove;});
(function() {
  var first_move_list = document.querySelector("#first-move").childNodes;
  for (var i=0; i<first_move_list.length; i++) {
    first_move_list[i].onclick = setFirstMove;
  }
})();
function setFirstMove() { setMenuValue(this, "first_move", "move", first_move); }



/* ------------------------------------- */
/*                Overlays               */
/* ------------------------------------- */
function showGameOverMessage() {
  // update display
  var overlay = document.querySelector("#game-over-message");
  // update message
  var game_message = "Draw.";
  overlay.style.color = "white";
  if (score[0] > score[1]) {
    game_message = "You won!";
    overlay.style.color = vec2rgb(makeScoringCell.player_colors[0]);
  }
  else if (score[0] < score[1]) {
    game_message = "You lost.";
    overlay.style.color = vec2rgb(makeScoringCell.player_colors[1]);
  }
  overlay.innerHTML = game_message;
}
// statistics overlay
document.querySelector("#statistics-overlay").onclick = function(el){
  document.querySelector("#statistics-overlay").style.display = "none";
};

/* ------------------------------------- */
/*           Button Listeners            */
/* ------------------------------------- */
// undo button (see make_board.js)
// reset button
document.querySelector("#reset-button").onclick = resetBoard;
// statistics button
document.querySelector("#stats-button").onclick = function() {
  if (game_over) {
    // toggle graphics (turn off or create)
    var stats_overlay = document.querySelector("#statistics-overlay");
    if (stats_overlay.style.display == "flex") { stats_overlay.style.display = "none"; }
    else {
      stats_overlay.style.display = "flex";
      makeGraphics();
    }
  }
};
function makeGraphics() {
  var h = 0.4*document.querySelector("#board").offsetHeight;
  var w = document.querySelector("#board").offsetWidth;
  var scores = game_log.map(function(x) {return Math.round(x.score);} );
  // remove first two elements (zeros) and add current scores
  scores.splice(0,2);
  if (board_size=="medium") {
    scores.push(score[1*(first_move=="you")]);
    scores.push(score[1*(first_move!="you")]);
  } else {
    scores.push(score[1*(first_move!="you")]);
    scores.push(score[1*(first_move=="you")]);
  }
  makeDifferenceGraph(scores, first_move=="you", makeScoringCell.player_colors, h, w);
  makeIndividualGraph(scores, first_move=="you", makeScoringCell.player_colors, h, w);
}



/* ------------------------------------- */
/*            Helper Functions           */
/* ------------------------------------- */
function resetBoard() {
  // switch first moves if you win
  if (game_over && score[0]>score[1]) {
    // turn off underline of old first move
    document.querySelector("#move-" + first_move)
    .style.textDecoration = "none";
    // switch and turn on underline
    first_move = first_move=="you" ? "ai" : "you";
    document.querySelector("#move-" + first_move)
    .style.textDecoration = "underline";
  }

  // reset scores
  score = [0, 0];   game_log = [];   game_over = false;
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

  // update displays
  document.querySelector("#game-over-message").innerHTML = "";
  document.querySelector("#stats-button").className = "off";
  document.querySelector("#statistics-overlay").style.display = "none";
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
  var anim_id = requestAnimationFrame(updateOpacity);
  // update opacity: 1-t^power (out) or t^power (in)
  function updateOpacity() {
    t += dt;
    op = in_or_out=="out" ? 1-Math.pow(t, power) : Math.pow(t, power);
    if (t >= 1){
      el.style.opacity = 1-initial_op;
      cancelAnimationFrame(anim_id);
    } else {
      el.style.opacity = op;
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

/* load images into browswer cache */
function preloadImages(array) {
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    var list = preloadImages.list;
    for (var i = 0; i < array.length; i++) {
        var img = new Image();
        img.onload = function() {
            var index = list.indexOf(this);
            if (index !== -1) {
                // remove image from the array once it's loaded
                // for memory consumption reasons
                list.splice(index, 1);
            }
        }
        list.push(img);
        img.src = array[i];
    }
}
/* load all cells of a given color into cache */
function cacheCells() {
  var a =  [
    "0000", "1000", "0100", "0010", "0001", "1100", "1010", "1001",
    "0110", "0101", "0011", "1110", "1101", "1011", "0111", "1111"
  ];
  // cache your cells
  preloadImages(
    a.map(function(x) { return "images/g" + x + ".png"; })
  );
  // cache ai's cells
  var clr;
  switch (difficulty) {
    case "easy":   clr = "b"; break; // (blue)
    case "medium": clr = "f"; break; // (fuscia)
    case "hard":   clr = "r"; break; // (red)
    default: throw "difficulty not defined";
  }
  preloadImages(
    a.map(function(x) { return "images/" + clr + x + ".png"; })
  );
}
