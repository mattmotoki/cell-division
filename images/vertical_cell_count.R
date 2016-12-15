library(png)
source("cell_plot_utils.R")


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


# small trianglular cell
sm_tri_outline <- triangular_cell(0.3, 0.2, n_pnts)
sm_tri_x <- 0.5*(sm_tri_outline[, 1]+0.5)
sm_tri_y <- 0.5*(sm_tri_outline[, 2]+0.5)



#------------------
# plot the progression
graphics.off()

# one
png("cell_v1.png")
blank_plot()
plot_cell(sq_x, sq_y, cellgreen)
dev.off()



# two
png("cell_v2.png")
blank_plot()
plot_cell(rect_x, sq_y, cellgreen)
plot_cell(rect_x+0.5, sq_y, cellgreen)
dev.off()




# three
png("cell_v3.png")
blank_plot()
plot_cell(sm_sq_x, sm_sq_y, cellgreen)
plot_cell(sm_sq_x, sm_sq_y+0.5, cellgreen)
plot_cell(rect_x+0.5, sq_y, cellgreen)
dev.off()


# four
png("cell_v4.png")
blank_plot()
plot_cell(sm_sq_x, sm_sq_y, cellgreen)
plot_cell(sm_sq_x, sm_sq_y+0.5, cellgreen)
plot_cell(sm_sq_x+0.5, sm_sq_y, cellgreen)
plot_cell(sm_sq_x+0.5, sm_sq_y+0.5, cellgreen)
dev.off()


# five
png("cell_v5.png")
blank_plot()

plot_cell(sm_sq_x, sm_sq_y+0.5, cellgreen)
plot_cell(sm_sq_x+0.5, sm_sq_y, cellgreen)

plot_cell(sm_tri_x, 0.5-sm_tri_y, cellgreen)
plot_cell(0.5-sm_tri_x, sm_tri_y, cellgreen)

plot_cell(sm_sq_x+0.5, sm_sq_y+0.5, cellgreen)
dev.off()


# six 
png("cell_v6.png")
blank_plot()

plot_cell(sm_sq_x, sm_sq_y+0.5, cellgreen)
plot_cell(sm_sq_x+0.5, sm_sq_y, cellgreen)

plot_cell(sm_tri_x, 0.5-sm_tri_y, cellgreen)
plot_cell(0.5-sm_tri_x, sm_tri_y, cellgreen)

plot_cell(sm_tri_x+0.5, 1-sm_tri_y, cellgreen)
plot_cell(1-sm_tri_x, sm_tri_y+0.5, cellgreen)
dev.off()


# seven 
png("cell_v7.png")
blank_plot()

plot_cell(sm_sq_x, sm_sq_y+0.5, cellgreen)

plot_cell(sm_tri_x+0.5, sm_tri_y, cellgreen)
plot_cell(1-sm_tri_x, 0.5-sm_tri_y, cellgreen)

plot_cell(sm_tri_x, 0.5-sm_tri_y, cellgreen)
plot_cell(0.5-sm_tri_x, sm_tri_y, cellgreen)

plot_cell(sm_tri_x+0.5, 1-sm_tri_y, cellgreen)
plot_cell(1-sm_tri_x, sm_tri_y+0.5, cellgreen)
dev.off()



# eight
png("cell_v8.png")
blank_plot()

plot_cell(sm_tri_x, 0.5-sm_tri_y, cellgreen)
plot_cell(0.5-sm_tri_x, sm_tri_y, cellgreen)

plot_cell(sm_tri_x+0.5, sm_tri_y, cellgreen)
plot_cell(1-sm_tri_x, 0.5-sm_tri_y, cellgreen)

plot_cell(sm_tri_x+0.5, 1-sm_tri_y, cellgreen)
plot_cell(1-sm_tri_x, 0.5+sm_tri_y, cellgreen)

plot_cell(sm_tri_x, 0.5+sm_tri_y, cellgreen)
plot_cell(0.5-sm_tri_x, 1-sm_tri_y, cellgreen)
dev.off()