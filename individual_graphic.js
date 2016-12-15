function makeIndividualGraph(scores, first_move, player_color) {
  /* ------------------------------------- */
  /*        Variables and Parameters       */
  /* ------------------------------------- */
  /* Canvas and Context */
  var h = 300;
  var w = 500;
  var canvas = document.querySelector("#individual-plot");
  var ctx = canvas.getContext("2d");
  canvas.width = w;    canvas.height = h;
  ctx.lineJoin="round";
  ctx.font = "12pt Calibri";
  ctx.textBaseline="middle";

  /* Score Variables */
  var n = scores.length;
  var n_labels = 8;
  var max_score = Math.max.apply(null, scores);
  var delta = Math.ceil( max_score/n_labels );

  /* ------------------------------------- */
  /*            Drawing Routine            */
  /* ------------------------------------- */
  addAxes();
  addLegend();
  addPlayer(0);
  addPlayer(1);
  addOpenDots();
  addFilledDots();


  /* Gray Axes */
  function addAxes() {
    var axis_color = "rgb(100, 100, 100)";
    // set context defaults
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = axis_color;
    ctx.fillStyle = axis_color;
    ctx.textAlign="end";

    // vertical axis labels
    for (var i=0; i<n_labels+1; i++) {
      ctx.fillText(i*delta, timestep2x(-0.3), score2y(i*delta));
    }

    // axes
    ctx.beginPath();
    ctx.moveTo(timestep2x(0), 0);          // vertical axis start
    ctx.lineTo(timestep2x(0), score2y(0)); // vertical axis end
    ctx.moveTo(timestep2x(0), score2y(0)); // horizontal axis start
    ctx.lineTo(w, score2y(0));             // horizontal axis end

    // horizontal axis ticks
    for (i=0; i<n; i++) {
      ctx.moveTo(timestep2x(i+1), score2y(0) + 0.0125*h);
      ctx.lineTo(timestep2x(i+1), score2y(0) - 0.0125*h);
    }
    ctx.stroke();
    ctx.restore();
  }


  /* Player's Scores */
  function addPlayer(player) {
    // set context defaults
    ctx.save();
    ctx.lineWidth = 2;

    // player's score
    ctx.beginPath();
    ctx.strokeStyle = vec2rgb(player_color[player]);
    ctx.fillStyle = vec2rgb(player_color[player]);
    ctx.moveTo(timestep2x(i), score2y(0));
    var player_score = extractScore(player);

    // draw line
    for (var i=0; i<player_score.length; i++) {
      ctx.lineTo(timestep2x(i), score2y(player_score[i]));
    }
    ctx.stroke();
    ctx.restore();
  }

  /* Colored Region Labels */
  function addLegend() {
    ctx.save();
    ctx.font = "italic 12pt Calibri";
    // played move
    ctx.fillStyle = "gray";
    ctx.fillText( "played", 1.75*w/16, 0.12*h );
    ctx.beginPath();
    ctx.arc( 1.5*w/16, 0.12*h, 0.01*h, 0, 2*Math.PI );
    ctx.fill();
    // waited
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "gray";
    ctx.fillText( "waited", 1.75*w/16, 0.18*h );
    ctx.beginPath();
    ctx.arc( 1.5*w/16, 0.18*h, 0.01*h, 0, 2*Math.PI );
    ctx.stroke();
    // title
    ctx.font = "italic 14pt Calibri";
    ctx.fillText( "Legend", 1.4*w/16, 0.05*h );
    ctx.restore();
  }

  /* Draw Open Dots */
  function addOpenDots() {
    ctx.save();
    ctx.fillStyle = "rgb(23, 23, 23)";
    ctx.lineWidth = 4;
    for (var i=1; i<n; i++) {
      // outline
      ctx.beginPath();
      ctx.strokeStyle = vec2rgb(player_color[(i+!first_move)%2]);
      ctx.arc( timestep2x(i), score2y(scores[i-1]), 0.01*h, 0, 2*Math.PI );
      ctx.stroke();
      // inside
      ctx.arc( timestep2x(i), score2y(scores[i]), 0.005*h, 0, 2*Math.PI );
      ctx.fill();
    }
    ctx.restore();
  }

  /* Draw Filled Dots */
  function addFilledDots() {
    ctx.save();
    for (var i=1; i<n; i++) {
      ctx.beginPath();
      ctx.fillStyle = vec2rgb(player_color[(i+first_move)%2]);
      ctx.arc( timestep2x(i), score2y(scores[i]), 0.01*h, 0, 2*Math.PI );
      ctx.fill();
    }
    ctx.restore();
  }

  /* ------------------------------------- */
  /*           Utility Functions           */
  /* ------------------------------------- */
  /* Map timestep to Pixels */
  function timestep2x(t) { return w/16*(14.5*t/(n-1) + 1); }

  /* Score  to Pixels */
  function score2y(s) { return h/10*(-1.05*s/delta + n_labels+1); }

  function extractScore(player) {
    var s = [];
    for (var i=1*(player!=first_move); i<n; i+=2) {
      s.push(scores[i]);
      s.push(scores[i]);
    }
    // check if shift is needed
    if (player!=first_move) { s.unshift(0); } // append to front
    else { s.pop(); }                         // remove last
    return s;
  }

  /* Convert Entries in a Vector into an rgb String */
  function vec2rgb(color) {
    var round_color = color.map(function(x) {return Math.round(x);});
    return "rgb(" + round_color[0] + "," + round_color[1] + "," + round_color[2] + ")";
  }
}
