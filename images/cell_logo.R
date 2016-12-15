source("cell_plot_utils.R")



#------------------
# cell definitions

# square cell
sq_outline <- square_cell(0.2, 100)
sq_x <- 0.5*(sq_outline[, 1] + 0.5)
sq_y <- 0.5*(sq_outline[, 2] + 0.5)

# trianglular cell
tri_outline <- 0.5*triangular_cell(0.3, 0.1, n_pnts)
tri_x <- 0.5*(tri_outline[, 1]+0.5)
tri_y <- 0.5*(tri_outline[, 2]+0.5)



# small square cell
sm_sq_outline <- square_cell(0.4, 100)
sm_sq_x <- 0.25*(sm_sq_outline[, 1] + 0.5)
sm_sq_y <- 0.25*(sm_sq_outline[, 2] + 0.5)


# small trianglular cell
sm_tri_outline <- triangular_cell(0.3, 0.2, n_pnts)
sm_tri_x <- 0.25*(sm_tri_outline[, 1]+0.5)
sm_tri_y <- 0.25*(sm_tri_outline[, 2]+0.5)


# quadrilateral cell
quad_outline <- quad_cell(0.2, 0.1, n_pnts)
quad_x <- 0.5*(quad_outline[, 1]+0.5)
quad_y <- 0.5*(quad_outline[, 2]+0.5)

#------------------
# logo
graphics.off()
# png("cell_logo.png")
blank_plot()

# inner
plot_cell(sq_x+0.5, sq_y, cellfuscia)

# middle
plot_cell(0.25+sm_sq_x, 0.5+sm_sq_y, cellgreen)
plot_cell(0.5-sm_tri_x, 0.25+sm_tri_y, cellgreen)
plot_cell(0.75-sm_tri_x, 0.5+sm_tri_y, cellgreen)
plot_cell(0.5+quad_y, 1-quad_x, cellgreen)
plot_cell(quad_x, 0.5-quad_y, cellgreen)


# outer
plot_cell(0.5-quad_x, quad_y, cellgreen)
plot_cell(1-quad_y, 0.5+quad_x, cellgreen)
plot_cell(sm_tri_x, 0.25-sm_tri_y, cellgreen)
plot_cell(0.75+sm_tri_x, 1-sm_tri_y, cellgreen)
plot_cell(sm_sq_x, 0.5+sm_sq_y, cellgreen)
plot_cell(sm_sq_x, 0.75+sm_sq_y, cellgreen)
plot_cell(0.25+sm_sq_x, 0.75+sm_sq_y, cellgreen)

# dev.off()



# # inner
# plot_cell(sq_x+0.5, sq_y, cellfuscia)
# 
# # middle
# plot_cell(0.25+sm_sq_x, 0.5+sm_sq_y, cellblue)
# plot_cell(0.5-sm_tri_x, 0.25+sm_tri_y, cellblue)
# plot_cell(0.75-sm_tri_x, 0.5+sm_tri_y, cellblue)
# plot_cell(0.5+quad_y, 1-quad_x, cellblue)
# plot_cell(quad_x, 0.5-quad_y, cellblue)
# 
# 
# # outer
# plot_cell(0.5-quad_x, quad_y, cellgreen)
# plot_cell(1-quad_y, 0.5+quad_x, cellgreen)
# plot_cell(sm_tri_x, 0.25-sm_tri_y, cellgreen)
# plot_cell(0.75+sm_tri_x, 1-sm_tri_y, cellgreen)
# plot_cell(sm_sq_x, 0.5+sm_sq_y, cellgreen)
# plot_cell(sm_sq_x, 0.75+sm_sq_y, cellgreen)
# plot_cell(0.25+sm_sq_x, 0.75+sm_sq_y, cellgreen)










