source("cell_plot_utils.R")
line_width <- 3

w = 100
h = 100

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



graphics.off()

#------------------
# cell  icon
png("cell_icon.png")
blank_plot()
plot_cell(2*sm_sq_x, 2*sm_sq_y, cellgreen)
dev.off()

#------------------
# board size
png("size_small.png", width=w, height=h)
blank_plot()
plot_cell( 0.5*(sq_x-0.5)+0.5, 0.5*(sq_y-0.5)+0.5, cellgreen)
dev.off()

png("size_medium.png", width=w, height=h)
blank_plot()
plot_cell( 0.75*(sq_x-0.5)+0.5, 0.75*(sq_y-0.5)+0.5, cellgreen)
dev.off()

png("size_large.png", width=w, height=h)
blank_plot()
plot_cell( sq_x, sq_y, cellgreen)
dev.off()



# #------------------
# # difficulty
# makeDifficultyButton <- function(color, is_on=TRUE) {
#   blank_plot()
#   plot_cell(sm_tri_x+0.5, 1-sm_tri_y, color)
#   plot_cell(sm_tri_x+0.5, sm_tri_y, color)
#   # bot
#   plot_cell(sm_tri_x, 0.5-sm_tri_y, color)
#   plot_cell(1-sm_tri_x, 0.5-sm_tri_y, color)
#   
#   # left
#   plot_cell(0.5-sm_tri_x, 1-sm_tri_y, color)
#   plot_cell(0.5-sm_tri_x, sm_tri_y, color)
#   
#   # top
#   plot_cell(sm_tri_x, 0.5+sm_tri_y, color)
#   plot_cell(1-sm_tri_x, 0.5+sm_tri_y, color)
#   
#   # center
#   if (is_on) { 
#     plot_cell(0.61*(sm_sq_x-0.25)+0.5, 0.61*(sm_sq_y-0.25)+0.5, color) 
#   }
#   
# }
# # on 
# png("difficulty_easy_on.png", width=w, height=h)
# makeDifficultyButton(cellblue, TRUE)
# dev.off()
# png("difficulty_medium_on.png", width=w, height=h)
# makeDifficultyButton(cellfuscia, TRUE)
# dev.off()
# png("difficulty_hard_on.png", width=w, height=h)
# makeDifficultyButton(cellred, TRUE)
# dev.off()
# 
# # off
# png("difficulty_easy_off.png", width=w, height=h)
# makeDifficultyButton(cellblue, FALSE)
# dev.off()
# png("difficulty_medium_off.png", width=w, height=h)
# makeDifficultyButton(cellfuscia, FALSE)
# dev.off()
# png("difficulty_hard_off.png", width=w, height=h)
# makeDifficultyButton(cellred, FALSE)
# dev.off()



# #------------------
# # difficulty
# png("difficulty_easy.png", width=w, height=h)
# blank_plot()
# plot_cell(2*sm_sq_x, 2*sm_sq_y, cellblue)
# dev.off()
# 
# png("difficulty_medium.png", width=w, height=h)
# blank_plot()
# plot_cell(2*sm_sq_x, 2*sm_sq_y, cellfuscia)
# dev.off()
# 
# png("difficulty_hard.png", width=w, height=h)
# blank_plot()
# plot_cell(2*sm_sq_x, 2*sm_sq_y, cellred)
# dev.off()


#------------------
# board size

png("size_small.png", width=w, height=h)
blank_plot()
plot_cell(sm_sq_x+0.25, sm_sq_y+0.25, cellyellow)
dev.off()

png("size_medium.png", width=w, height=h)
blank_plot()
plot_cell(sm_sq_x, sm_sq_y+0.25, cellyellow)
plot_cell(sm_sq_x+0.5, sm_sq_y+0.25, cellyellow)
dev.off()

png("size_large.png", width=w, height=h)
blank_plot()
plot_cell(sm_sq_x, sm_sq_y, cellyellow)
plot_cell(sm_sq_x+0.5, sm_sq_y, cellyellow)
plot_cell(sm_sq_x+0.25, sm_sq_y+0.4712, cellyellow)
dev.off()


