source("cell_plot_utils.R")
line_width <- 3

w = 120
h = 120

#------------------
# cell definitions

# square cell
sq_outline <- square_cell(0.2, 100)
sq_x <- sq_outline[, 1] + 0.5
sq_y <- sq_outline[, 2] + 0.5

# rectangular cell
rect_x <- sq_x - 0.5*(sq_x>0.5)

# small square cell
sm_sq_outline <- square_cell(0.4, 100)
sm_sq_x <- 0.5*(sm_sq_outline[, 1] + 0.5)
sm_sq_y <- 0.5*(sm_sq_outline[, 2] + 0.5)

# trianglular cell
tri_outline <- triangular_cell(0.2, 0.1, n_pnts)
tri_x <- tri_outline[, 1]+0.5
tri_y <- tri_outline[, 2]+0.5

# side trianglular cell
side_tri_outline <- side_triangular_cell(0.1, 0.275, n_pnts)
side_tri_x <- side_tri_outline[, 1]+0.5
side_tri_y <- side_tri_outline[, 2]+0.5

# small trianglular cell
sm_tri_outline <- triangular_cell(0.4, 0.2, n_pnts)
sm_tri_x <- 0.5*(sm_tri_outline[, 1]+0.5)
sm_tri_y <- 0.5*(sm_tri_outline[, 2]+0.5)

# quadrilateral cell
quad_outline <- quad_cell(0.2, 0.1, n_pnts)
quad_x <- quad_outline[, 1]+0.5
quad_y <- quad_outline[, 2]+0.5


#--------------
circularShift <- function(x,shift=0)
{
  N <- length(x)
  K <- shift %% N
  if(K == 0) x else c(x[(N-K+1):N],x[1:(N-K)])
}

centroidCalc <- function(x, y) 
  {
  shift_x <- circularShift(x, 1)
  shift_y <- circularShift(y, 1)
  d <- x*shift_y - shift_x*y
  c(sum( (x+shift_x)*d ), sum( (y+shift_y)*d ) ) / (3*sum(d))
}





