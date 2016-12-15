function makeDifferenceGraph(scores, first_move, player_color) {
  /* ------------------------------------- */
  /*        Variables and Parameters       */
  /* ------------------------------------- */
  /* Canvas and Context */
  var h = 300;
  var w = 500;
  var canvas = document.querySelector("#difference-plot");
  var ctx = canvas.getContext('2d');
  canvas.width = w;    canvas.height = h;
  ctx.lineJoin="round";
  ctx.font = "12pt Calibri";
  ctx.textBaseline="middle";

  /* Score Variables */
  var n = scores.length;
  var score_diffs = diffCalc(scores);
  var max_diff =  Math.max.apply(null, score_diffs);
  var min_diff =  Math.min.apply(null, score_diffs);
  var n_upper = Math.round(8*max_diff/(max_diff - min_diff));
  var n_lower = 8 - n_upper;
  var delta = Math.ceil(
    Math.max(
      n_upper==0 ? 0 : max_diff/n_upper,
      n_lower==0 ? 0 : Math.abs(min_diff)/n_lower
    )
  );

  /* Coloring Variables */
  var darkness = 0.25;

  /* Gradient Parameters */
  var gradient_breakpoints = [0, 0.1, 0.499, 0.5, 0.501, 0.9, 1];
  var gradient_color = [
    [255, 255, 255], player_color[0],
    cvx_comb([0, 0, 0], player_color[0], darkness),
    [0, 0, 0],
    cvx_comb([0, 0, 0], player_color[1], darkness),
    player_color[1], [255, 255, 255]
  ];
  // create gradient background
  var vert_gradient = ctx.createLinearGradient(
    0, n_upper>n_lower ? 0 : h/10*(n_upper-n_lower),
    0, n_upper>n_lower ? h/10*(1+n_upper)*2 : h
  );
  for (var i=0; i<gradient_color.length; i++) {
    vert_gradient.addColorStop(gradient_breakpoints[i], vec2rgb(gradient_color[i]));
  }


  /* ------------------------------------- */
  /*            Drawing Routine            */
  /* ------------------------------------- */
  addGradientFeatures();
  addAxes();
  addPointLabels();
  addRegionLabels();

  /* Gray Axes */
  function addAxes() {
    var axis_color = "rgb(100, 100, 100)";

    // set context defaults
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = axis_color;
    ctx.fillStyle = axis_color;
    ctx.textAlign = "end";

    // vertical axis labels
    for (var i=-n_lower; i<n_upper+1; i++) {
      ctx.fillText(i*delta, timestep2x(-0.3), diff2y(i*delta));
    }
    // axes
    ctx.beginPath();
    ctx.moveTo(timestep2x(0), 0);         // vertical axis start
    ctx.lineTo(timestep2x(0), h);         // vertical axis end
    ctx.moveTo(timestep2x(0), diff2y(0)); // horizontal axis start
    ctx.lineTo(w, diff2y(0));             // horizontal axis end
    // horizontal axis ticks
    for (var i=0; i<n; i++) {
      ctx.moveTo(timestep2x(i+1), diff2y(0) + 0.0125*h);
      ctx.lineTo(timestep2x(i+1), diff2y(0) - 0.0125*h);
    }
    ctx.stroke();
    ctx.restore();
  }

  /* Gradient Colored Features */
  function addGradientFeatures() {
    ctx.save();
    ctx.strokeStyle = vert_gradient;
    ctx.fillStyle = vert_gradient;
    // gradient colored line for score difference
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(timestep2x(0), diff2y(0));
    for (var i=0; i<n; i++) { ctx.lineTo(timestep2x(i+1), diff2y(score_diffs[i])); }
    ctx.stroke();
    ctx.restore();
  }


  /* White Labels for Points */
  function addPointLabels() {
    ctx.save();
    ctx.font = "10pt Calibri";
    ctx.fillStyle = "white";
    ctx.textAlign="center";
    for (var i=0; i<n; i++) {
      ctx.fillText(
        score_diffs[i],
        timestep2x(i+1),
        diff2y(score_diffs[i]) + 0.04*h*(-1)**((i+1)%2+!first_move)
      );
    }
    ctx.restore();
  }

  /* Colored Region Labels */
  function addRegionLabels() {
    ctx.save();
    ctx.font = "bold 16pt Calibri";
    //label background
    ctx.fillStyle = "rgb(23, 23, 23)";
    ctx.fillRect( 1.5*w/16, 0.025*h, 0.155*w, 0.07*h );
    ctx.fillRect( 1.5*w/16, 0.925*h, 0.115*w, 0.07*h );
    // winning label
    ctx.fillStyle = vec2rgb(player_color[0]);
    ctx.fillText( "Winning", 1.5*w/16, 0.05*h );
    // losing label
    ctx.fillStyle = vec2rgb(player_color[1]);
    ctx.fillText( "Losing", 1.5*w/16, 0.95*h );
    ctx.restore();
  }

  /* ------------------------------------- */
  /*           Utility Functions           */
  /* ------------------------------------- */
  /* Map timestep to Pixels */
  function timestep2x(t) { return w/16*(14.5*t/n + 1); }

  /* Score Difference to Pixels */
  function diff2y(d) { return h/10*(-1.1*d/delta + n_upper+1); }

  /* Player0 Score Difference */
  function diffCalc(A) {
    A.unshift(0);
    return A.slice(1).map(function(n, i) { return (-1)**(i%2+!first_move)*(n - A[i]); });
  }
  /* Element-wise Convex Combination of Two Vectors */
  function cvx_comb(v1, v2, alpha) {
    var vec = [];
    for (var i = 0; i <v1.length; i++) {
      vec.push( Math.round(alpha*v1[i] + (1-alpha)*v2[i]) );
    }
    return vec;
  }

  /* Convert Entries in a Vector into an rgb String */
  function vec2rgb(color) {
    var round_color = color.map(function(x) {return Math.round(x);});
    return "rgb(" + round_color[0] + "," + round_color[1] + "," + round_color[2] + ")";
  }
}
