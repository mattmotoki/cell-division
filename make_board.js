var makeBoard = function(w, h) {
  /* ------------------------------------------------------------------------ */
  /* Create a board of cells                                                  */
  /*  -w:  width of the board (without margin)                                */
  /*  -h:  height of the board (without margin)                               */
  /*                                                                          */
  /* Global Variables:                                                        */
  /*  -difficulty: used to define AI's moves                                  */
  /*  -first_move: determines who get's the first move                        */
  /* ------------------------------------------------------------------------ */

  /* ----------------------------- */
  /*          Variables            */
  /* ----------------------------- */
  w += 4;   h += 4;      // add margin to width and height
  var is_busy = false;   // is busy with annimation
  var game_over = false; // game over flag
  var open_moves = [];   // open board positions
  var timestep = 0;      // number of moves played


  /* Calculate adjacent indices */
  var adj = [
    -1,   1,   // horizontal
    -h,   h,   // vertical
    -h-1, h+1, // backward diagonal
    -h+1, h-1  // forward diagonal
  ];

  /* Specify color of cells */
  var player_color = ["g"];
  switch (difficulty) {
    case "easy":   player_color.push("b"); break;
    case "medium": player_color.push("f"); break;
    case "hard":   player_color.push("r"); break;
    default: throw "player difficulty not defined";
  }
  player_color.push("o"); // default for outline

  /* Create scoring and connections table */
  // check feasibility of index (with margin)
  function checkFeasibility(ind) {
    var col = Math.floor(ind/h);
    var row = ind % h;
    return (row>1) && (row<h-2) && (col>1) && (col<w-2);
  }
  // initialize tables with defaults
  var connection_table = new Array(w*h);
  var scoring_table = [new Array(w*h), new Array(w*h)];
  for (var i=0; i < w*h; i++) {
    // initialize scoring tables
    scoring_table[0][i] = { overlap:0, interlap:0, unconnected:0, extensions:0 };
    scoring_table[1][i] = { overlap:0, interlap:0, unconnected:0, extensions:0 };
    // initialize  connection table (default player=2)
    connection_table[i] = { player:2, openness:8, connections:[0, 0, 0, 0] };
    // update openness (if neighbor is not feasible then decrement openness)
    if (checkFeasibility(i)) {
      for (var j = 0; j < 8; j++) {
        if (!checkFeasibility(i + adj[j])) { connection_table[i].openness --; }
      }
    }
  }


  /* Create the board */
  var container = document.createElement("div");
  container.id = "board";

  /* Fill in the board */
  for (var i=0; i < (w-4)*(h-4);  i++) {
    var ind0 = convertIndex(i);
    open_moves.push(ind0);

    // get cell container
    var cell_container = document.createElement("div");
    cell_container.className = "cell-container";
    cell_container.style.width = 100/(w-4) + "%";
    cell_container.ind0 =  ind0;
    cell_container.onclick = playRound;

    // initialize scoring overlay text
    var cell_text = document.createElement("div");
    cell_text.innerHTML = "1";
    cell_text.id  = "cell-text-" + ind0;
    cell_text.className = "cell-text on";

    // initialize cell image
    var old_cell = document.createElement("img");
    old_cell.id  = "old-cell-img-" + ind0;
    old_cell.className  = "single-cell on old";
    old_cell.src = "images/o0000.png";

    var new_cell = document.createElement("img");
    new_cell.id  = "new-cell-img-" + ind0;
    new_cell.className  = "single-cell on new";
    new_cell.src = "images/o0000.png";


    // add elements to board
    cell_container.appendChild(new_cell);
    cell_container.appendChild(old_cell);
    cell_container.appendChild(cell_text);
    container.appendChild(cell_container);
    document.querySelector("#board-container").appendChild(container);
  }

  // sort open_moves for reproducible game play (after undo)
  open_moves.sort();


  /* Set AI move if needed */
  if (first_move=="ai") {
    var ind0 = findBestMove();
    var move_ind = open_moves.indexOf(ind0);
    open_moves.splice(move_ind, 1);
    playMove(ind0, 1);
  }
  /* ------------------------------------- */
  /*          Game State Functions         */
  /* ------------------------------------- */

  /* Main routine */
  function playRound() {
    var ind0 = this.ind0;

    // check for feasibility
    var move_ind = open_moves.indexOf(ind0);
    if (move_ind>=0 && !is_busy) {

      // cut off user input for 2 seconds (time for two moves)
      is_busy = true;
      setTimeout( function() {is_busy = false;}, 1000 )

      // remove from feasible array
      open_moves.splice(move_ind, 1);

      // play your move
      playMove(ind0, 0);

      // play AI move
      setTimeout( function() {
        ind0 = findBestMove();
        move_ind = open_moves.indexOf(ind0);
        open_moves.splice(move_ind, 1);

        playMove(ind0, 1);
      }, 750 );
    }
  }

  /* Play a single player's move */
  function playMove(ind0, plyr) {
    if (game_over) { return; }

    // update game log
    game_log.push({move:ind0, player:plyr, score:score[plyr]});

    // update connection_table
    timestep ++;
    connection_table[ind0].player = plyr;
    if (timestep==n_rounds) { game_over = true; }

    // remove hover property from cell image and cell text ("on" class)
    document.querySelector("#new-cell-img-" + ind0).className  = "single-cell new";
    document.querySelector("#old-cell-img-" + ind0).className  = "single-cell old";
    document.querySelector("#cell-text-" + ind0).className  = "cell-text";

    // update score parameters
    updateScore(plyr, extractScore(plyr, ind0));


    // update state values of other cells
    for (var i = 0; i < 8; i++) {
      // adjacent indices (surrounding cells)
      var ind1 = ind0 + adj[i];   // one position away
      var ind2 = ind0 + 2*adj[i]; // two positions away

      // update openness and overlap
      connection_table[ind1].openness -- ;
      scoring_table[plyr][ind1].overlap ++;

      // check for a connection between ind0 and ind1
      if (connection_table[ind1].player == plyr) {

        // specify the direction of the connection
        connection_table[ind0].connections[Math.floor(i/2)] += 1;
        connection_table[ind1].connections[Math.floor(i/2)] += 1;

        // the current connection extends the connection with ind2 and ind0-adj[i]
        scoring_table[plyr][ind0-adj[i]].extensions ++;
        scoring_table[plyr][ind2].extensions ++;

        // if ind1 was previously unconnected (it isn't now) then update its neighbors
        if (scoring_table[plyr][ind1].unconnected==-1) {
          scoring_table[plyr][ind1].unconnected = 0;
          for (var j = 0; j < 8; j++) {
            scoring_table[plyr][ind1+adj[j]].unconnected = 0;
          }
        }

        // update the cell display of the neighbor (if necessary)
        if (connection_table[ind1].connections[Math.floor(i/2)]==1) {
          updateCellDisplay(ind1);
        }
      }

      // check for possible interlap
      if (connection_table[ind2].player == plyr) {
        scoring_table[plyr][ind1].interlap ++;
      }
    }

    // check if ind0 is unconnected
    var is_unconnected = (connection_table[ind0].connections.reduce((a, b) => a + b, 0)==0);
    scoring_table[plyr][ind0].unconnected = is_unconnected ? -1 : 0;
    if (is_unconnected) {
      for (var i = 0; i < 8; i++) {
        scoring_table[plyr][ind0+adj[i]].unconnected ++;
      }
    }

    // update the display of the current cell
    updateCellDisplay(ind0);

    // check if game is over
    if (game_over) { showGameOverMessage(); }
  }



  /* Listen for undo button */
  document.querySelector("#undo-button").onclick = function() {
    // check to see if there are enough moves to remove
    if (timestep<2) {
      console.log("Not enough moves to undo.");
      return;
    }

    removeMove();
    // if game over and medium board then only need to remove one piece
    if (!(game_over && board_size=="medium")) { removeMove(); }
    diff = score[0] - score[1];
    game_over = false;
  };

  /* Remove a single player's move */
  function removeMove() {
    // get entry
    var last_entry = game_log.pop();
    var ind0 = last_entry.move;
    var plyr = last_entry.player;
    var plyr_score = last_entry.score;

    // add move back to open_moves
    open_moves.push(ind0);
    open_moves.sort();

    // update connection_table
    timestep --;
    connection_table[ind0].player = 2;

    // add hover property from cell image and cell text
    document.querySelector("#new-cell-img-" + ind0).className  = "single-cell on new";
    document.querySelector("#old-cell-img-" + ind0).className  = "single-cell on old";
    document.querySelector("#cell-text-" + ind0).className  = "cell-text on";

    // update score parameters
    score[plyr] = plyr_score;
    document.querySelector("#score" + plyr).innerHTML = (plyr==0 ? "You: " : "AI: ") + score[plyr] ;

    // check if ind0 is unconnected
    if (scoring_table[plyr][ind0].unconnected==-1) {
      scoring_table[plyr][ind0].unconnected = 0;
      for (var i = 0; i < 8; i++) {
        scoring_table[plyr][ind0+adj[i]].unconnected = 0;
      }
    }

    // update state values of other cells
    for (var i = 0; i < 8; i++) {
      // adjacent indices (surrounding cells)
      var ind1 = ind0 + adj[i];   // one position away
      var ind2 = ind0 + 2*adj[i]; // two positions away

      // update openness and overlap
      connection_table[ind1].openness ++ ;
      scoring_table[plyr][ind1].overlap --;

      // check for a connection between ind0 and ind1
      if (connection_table[ind1].player == plyr) {

        // specify the direction of the connection
        connection_table[ind0].connections[Math.floor(i/2)] -= 1;
        connection_table[ind1].connections[Math.floor(i/2)] -= 1;

        // the current connection extended the connection with ind2 and ind0-adj[i]
        scoring_table[plyr][ind0-adj[i]].extensions --;
        scoring_table[plyr][ind2].extensions --;

        // check if ind1 is now unconnected, if so then update its neighbors
        if (connection_table[ind1].connections.reduce((a, b) => a + b, 0)==0) {
          scoring_table[plyr][ind1].unconnected = -1;
          for (var j = 0; j < 8; j++) {
            scoring_table[plyr][ind1+adj[j]].unconnected ++;
          }
        }

        // update the cell display of the neighbor (if necessary)
        if (connection_table[ind1].connections[Math.floor(i/2)]==0) {
          updateCellDisplay(ind1);
        }
      }

      // check for possible interlap
      if (connection_table[ind2].player == plyr) {
        scoring_table[plyr][ind1].interlap --;
      }

      // update the text displayed in the cell
      if (checkFeasibility(ind1)) {
        document.querySelector("#cell-text-" + ind1).innerHTML = extractScore(0, ind1);
      }
    }

    // update the text displayed in the cell
    document.querySelector("#cell-text-" + ind0).innerHTML = extractScore(0, ind0);

    // update the display of the current cell
    updateCellDisplay(ind0);
  }


  /* ------------------------------------- */
  /*          Scoring Functions            */
  /* ------------------------------------- */

  /* Calculate score from state variables */
  function extractScore(plyr, ind) {
    var s = scoring_table[plyr][ind];
    return (s.overlap ==0) - s.unconnected + 4*s.overlap - 2*(s.interlap + s.extensions);
  }


  /* Define and extract values of the AI difficulties */
  function extractValue(plyr, ind) {
    // extract scores of both players
    var your_score = extractScore(0, ind);
    var ai_score = extractScore(1, ind);

    // calculate easy and hard values
    var easy = 10*ai_score + 5*your_score;
    var hard = 2*ai_score + 2*your_score + 0.01*connection_table[ind].openness;

    // combine easy and hard to get value
    switch (difficulty) {
      case "easy":   return easy;
      case "medium": return 0.5*easy + 0.5*hard;
      case "hard":   return hard;
      default:       return 0.25*easy + 0.75*hard;
    }
  }

  /* Find the board position of the best move */
  function findBestMove() {
    var best_value = 0;
    var value = 0;
    var best_ind = 0;
    var ind = 0;

    for (var i = 0; i < open_moves.length; i++) {
      ind = open_moves[i];
      value = extractValue(1, ind);
      if (value > best_value) {
        best_value = value;
        best_ind = ind;
      }
      // update the text displayed in the cell (this could be better placed)
      document.querySelector("#cell-text-" + ind).innerHTML = extractScore(0, ind);
    }
    return best_ind;
  }

  /* ------------------------------------- */
  /*          Graphics Functions           */
  /* ------------------------------------- */

  /* Update cell image */
  function updateCellDisplay(ind) {
    var old_cell = document.querySelector("#old-cell-img-" + ind);
    var new_cell = document.querySelector("#new-cell-img-" + ind);

    // update old cell
    old_cell.src = new_cell.src;
    easeElement(old_cell, "out", 1, 2);
    // update new cell (map number of connections to {0, 1})
    new_cell.src = "images/" + player_color[connection_table[ind].player] +
    connection_table[ind].connections.map(function(v) {return 1*(v>0);}).join("") + ".png";
    easeElement(new_cell, "in", 1, 2);
  }

  // /* Gradually update score difference (for scoring cell color) */
  function updateScore(plyr, added_score) {
    var t = 0;
    var ds = added_score/30;
    var player_score = document.querySelector("#score" + plyr);
    var requestIncDiffId = requestAnimationFrame(updateDiff);

    function updateDiff() {
      t += 1/30;
      score[plyr] +=  ds;
      if (t >= 0.95) {
        score[plyr] =  Math.round(score[plyr]);
        cancelAnimationFrame(requestIncDiffId);
      } else { requestAnimationFrame(updateDiff); }
      diff = score[0] - score[1];
      player_score.innerHTML = (plyr==0 ? "You" : "AI") + ": " + Math.ceil(score[plyr]);
    }
  }

  /* ------------------------------------- */
  /*           Utility Functions           */
  /* ------------------------------------- */

  /* Convert index w/o border to index with border */
  function convertIndex(ind) {
    var row = Math.floor(ind/(h-4)) + 2;
    var col = (ind % (h-4)) + 2;
    return col*h + row;
  }
}
