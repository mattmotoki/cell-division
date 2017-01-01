var makeScoringCell = (function() {
  /* ------------------------------------------------------------------------ */
  /* Create a new canvas element that represents the current game state.      */
  /*                                                                          */
  /* Public Methods:                                                          */
  /*  -animateCell:  start the animation                                      */
  /*  -setAIColor:   update the color of the AI (when difficulty changes)     */
  /* ------------------------------------------------------------------------ */

  var cell_module = {};

  /* ------------------------------ */
  /*          Variables             */
  /* ------------------------------ */
  /* Lorenz parameters (in units w.r.t. to the Lorenz system) */
  var sigma = 10;         // Lorenz system parameter
  var r = 28;             // Lorenz system parameter
  var b = 8/3;            // Lorenz system parameter
  var x0 = Math.random(); // initial x-coordinate (with noise for uniqueness)
  var y0 = 10;            // initial y-coordinate
  var z0 = 20;            // initial z-coordinate
  var dt = 0.015;         // timestep
  var x, y, z;            // current (x,y,z)-coordinate

  /* Canvas variables */
  var size = document.querySelector("#scoring-cell").offsetHeight;
  var canvas = document.querySelector("#scoring-canvas");
  var ctx = canvas.getContext("2d");
  var center_x, center_y;

  var scale, corner_points, temp_x, temp_y;
  function setSizeDependentParameters() {
    // set canvas size
    canvas.width = size;   canvas.height = size;

    // cell outline parameters (in units of pixels)
    scale = 0.75;                           // determines wiggleness of cell
    corner_points = [                       // corners of a square
      {x:0.22*size, y:0.78*size, theta:Math.PI/4, radius:0.15*size},
      {x:0.78*size, y:0.78*size, theta:-Math.PI/3, radius:0.15*size},
      {x:0.78*size, y:0.22*size, theta:-Math.PI/2, radius:0.15*size},
      {x:0.22*size, y:0.22*size, theta:Math.PI, radius:0.15*size}
    ];

    // state of the Lorenz system converted to pixels (in the xy-plane)
    temp_x=size/2;
    temp_y=size/2;
  }
  setSizeDependentParameters();

  /* Gradient parameters */
  var darkness = 0.5;                // how dark the shading is
  var color_white = [255, 255, 255]; // rgb value for white
  var color_black = [0, 0, 0];       // rgb value for black
  var color_gradient = "white";      // colored gradient fill
  var shading_gradient = "white";    // black and white gradient fill
  var max_score = 10;                // value used to truncate score difference
  var base_color0 = [34, 255, 34];   // player's cell color (green)
  // AI's cell color
  function setAIColor() {
    switch (difficulty) {
      case "easy":   base_color1 = [34, 142, 250]; break; // (blue)
      case "medium": base_color1 = [230, 54, 230]; break; // (fuscia)
      case "hard":   base_color1 = [255, 60, 0];   break; // (red)
      default:       base_color1 = [255, 255, 0];         // (yellow)
    }
    // make cell colors public
    cell_module.player_colors = [base_color0, base_color1];

    // update AI score color
    document.querySelector("#score1").style.color = vec2rgb(base_color1);

  }
  setAIColor();
  cell_module.setAIColor = setAIColor;

  /* ------------------------------------- */
  /*           Event Listeners             */
  /* ------------------------------------- */
  /* Resize canvas */
  cell_module.resizeCanvas = resizeCanvas;
  function resizeCanvas() {
    var new_size = document.querySelector("#scoring-cell").offsetHeight;
    if (new_size != size) {
      size = new_size;
      setSizeDependentParameters();
    }
  }

  /* ------------------------------------- */
  /*          Animation Functions          */
  /* ------------------------------------- */
  cell_module.animateCell = animateCell;
  function animateCell() {
    // update parameters
    updateParameters();
    updateGradient();
    // rotate cell
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(size/2, size/2);
    ctx.rotate(2*Math.PI/3600);
    ctx.translate(-size/2, -size/2);
    // redraw cell
    ctx.fillStyle = color_gradient;
    drawScoringCell(ctx);
    // overlay shading
    ctx.fillStyle =  shading_gradient;
    drawScoringCell(ctx);

    requestId = requestAnimationFrame(animateCell);
  }

  /* ------------------------------------- */
  /*           Drawing Functions           */
  /* ------------------------------------- */
  /* Update cell color and shading gradients */
  cell_module.updateGradient = updateGradient;
  function updateGradient() {
    var adjusted_diff = Math.min(Math.abs(score[0] - score[1]) / max_score, 1);

    /* Cell color*/
    // define colors
    var base_color = score[0]>score[1] ? base_color0 : base_color1;
    var dark_color = cvx_comb(color_black, base_color, darkness);
    var outer_color = cvx_comb(color_white, dark_color, 1-Math.pow(adjusted_diff,0.25));
    var inner_color = cvx_comb(color_white, base_color, 1-Math.pow(adjusted_diff,0.25));

    // update the fill style
    color_gradient=ctx.createRadialGradient(center_x, center_y,0,center_x, center_y, size);
    color_gradient.addColorStop(0, vec2rgb(inner_color));
    color_gradient.addColorStop(1, vec2rgb(outer_color));

    /* Cell shading*/
    // define shades
    var inner_shade = [255, 255, 255];
    var outer_shade = cvx_comb(color_white, color_black, 0.01);

    // add transparency
    inner_shade.push(0);
    outer_shade.push(0.5 + 0.25*Math.pow(1- adjusted_diff,0.25));

    // update the fill style
    shading_gradient=ctx.createRadialGradient(center_x, center_y,0,center_x, center_y, 0.9*size);
    shading_gradient.addColorStop(0, vec2rgba(inner_shade));
    shading_gradient.addColorStop(1, vec2rgba(outer_shade));
  }


  /* Draw and fill outline of cell */
  function drawScoringCell(context) {
    var row, next_row, next_cpx, next_cpy;
    var n_points = corner_points.length;

    context.beginPath();
    for (var i = 0; i<n_points; i++) {
      row = corner_points[i%n_points];
      next_row = corner_points[(i+1)%n_points];

      // calculate control points
      cpx = row.radius*Math.cos(row.theta) + row.x;
      cpy = row.radius*Math.sin(row.theta) + row.y;
      next_cpx = -next_row.radius*Math.cos(next_row.theta) + next_row.x;
      next_cpy = -next_row.radius*Math.sin(next_row.theta) + next_row.y;

      // plot start and end points and connecting Bezier curve
      if (i===0) {context.moveTo(row.x, row.y);}
      context.bezierCurveTo(cpx, cpy, next_cpx, next_cpy, next_row.x, next_row.y);
    }
    context.fill();
  }

  /* ------------------------------------- */
  /*      Parameter Update Functions       */
  /* ------------------------------------- */
  /* Propagate state of the Lorenz system forward by one step */
  function updateParameters() {
    // update the state of the system
    x = x0;
    y = y0;
    z = z0;
    x0 = sigma*(y-x)*dt + x;
    y0 = (r*x-y-x*z)*dt + y;
    z0 = (x*y-b*z)*dt + z;

    // update the cell parameters
    for (var i = 0; i <corner_points.length; i++) {
      row = corner_points[i];
      row.radius = scale*Math.sqrt( Math.pow(row.y - center_y,2) + Math.pow(row.x - center_x,2) );
      row.theta = Math.atan2(row.y - center_y, row.x - center_x)-Math.PI/2;
    }

    // convert units of the Lorenz system to pixels
    center_x =  0.015*size*y0 + 0.50*size;
    center_y = -0.015*size*z0 + 0.85*size;

    // if magnitude is small then normalization creates a jittery trajectory
    var vel = Math.sqrt( Math.pow(temp_y - center_y,2) + Math.pow(temp_x - center_x,2) )/size;
    if (vel > 0.01) {
      center_x = temp_x + 0.01*(center_x - temp_x)/vel;
      center_y = temp_y + 0.01*(center_y - temp_y)/vel;
    }
    temp_x = center_x;
    temp_y = center_y;
  }

  return cell_module;
}());
