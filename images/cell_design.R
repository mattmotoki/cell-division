
source("cell_plot_utils.R")
line_width <- 1

w = 120
h = 120

#------------------
# square cells

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

# check that all square cells are self-similar
blank_plot()
points(sq_x, sq_y, pch=16, cex=1, col="blue")
points(rect_x, sq_y, pch=16, cex=0.5, col="red")
points(sm_sq_x, sm_sq_y, pch=16, cex=0.1, col="green")


#------------------
# trianglular cells
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


# check that all trinagular cells are self-similar
blank_plot()
points(sq_x, sq_y, pch=16, cex=1, col="blue")
points(tri_x, tri_y, pch=16, cex=0.5, col="red")
points(sm_tri_x, sm_tri_y+0.5, pch=16, cex=0.1, col="green")

points(sm_sq_x, sm_sq_y, pch=16, cex=0.1, col="red")
points(sm_tri_x, sm_tri_y, pch=16, cex=0.1, col="green")

points(side_tri_x, side_tri_y, pch=16, cex=0.1, col="red")
points(sm_tri_x+0.5, sm_tri_y, pch=16, cex=0.1, col="green")


#------------------
# quadrilateral cells
quad_outline <- quad_cell(0.2, 0.1, n_pnts)
quad_x <- quad_outline[, 1]+0.5
quad_y <- quad_outline[, 2]+0.5


# check that all quadrilateral cells are self-similar
blank_plot()
points(sq_x, sq_y, pch=16, cex=1, col="blue")
points(quad_x, quad_y, pch=16, cex=0.5, col="red")
points(sm_tri_x+0.5, sm_tri_y, pch=16, cex=0.1, col="green")

points(1-quad_x, 1-quad_y, pch=16, cex=0.5, col="red")
points(1-side_tri_x, side_tri_y, pch=16, cex=0.1, col="green")


