source("cell_plot_utils.R")
line_width <- 3


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
tri_outline <- triangular_cell(0.3, 0.1, n_pnts)
tri_x <- tri_outline[, 1]+0.5
tri_y <- tri_outline[, 2]+0.5

# side trianglular cell
side_tri_outline <- side_triangular_cell(0.1, 0.3, n_pnts)
side_tri_x <- side_tri_outline[, 1]+0.5
side_tri_y <- side_tri_outline[, 2]+0.5

# small trianglular cell
sm_tri_outline <- triangular_cell(0.3, 0.2, n_pnts)
sm_tri_x <- 0.5*(sm_tri_outline[, 1]+0.5)
sm_tri_y <- 0.5*(sm_tri_outline[, 2]+0.5)

# quadrilateral cell
quad_outline <- quad_cell(0.2, 0.1, n_pnts)
quad_x <- quad_outline[, 1]+0.5
quad_y <- quad_outline[, 2]+0.5



#------------------
# build block functins
graphics.off()

# cell outline
png("o0000.png")
blank_plot()
abline(h=c(0,1), v=c(0,1), lwd=line_width/2)
# polygon(sq_x, sq_y, col = rgb(1, 1, 1, 0))  
dev.off()


# wrapper function to plot and save all colors
save_cells <- function(cell_func) {
  for (colorname in c("cellgreen", "cellred", "cellfuscia", "cellblue", "cellyellow")) {
    cell_func(colorname) 
  }
}

# []
cell_0000 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "0000.png"))
  blank_plot()
  plot_cell(sq_x, sq_y, color)
  abline(h=c(0,1), v=c(0,1), lwd=line_width/2)
  dev.off()
}
save_cells(cell_0000)


# [|]
cell_1000 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "1000.png"))
  blank_plot()
  plot_cell(rect_x, sq_y, color)
  plot_cell(rect_x+0.5, sq_y, color)
  abline(h=c(0,1), v=c(0,1), lwd=line_width/2)
  abline(v=0.5, lwd=line_width)
  dev.off()
}
save_cells(cell_1000)


# [\]
cell_0010 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "0010.png"))
  blank_plot()
  plot_cell(tri_x, tri_y, color)
  plot_cell(1-tri_x, 1-tri_y, color)
  abline(h=c(0,1), v=c(0,1), lwd=line_width/2)
  lines(c(0,1), c(1,0), lwd=line_width)
  dev.off()
}
save_cells(cell_0010)




# [+]
cell_1100 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "1100.png"))
  blank_plot()
  plot_cell(sm_sq_x, sm_sq_y, color)
  plot_cell(sm_sq_x, sm_sq_y+0.5, color)
  plot_cell(sm_sq_x+0.5, sm_sq_y, color)
  plot_cell(sm_sq_x+0.5, sm_sq_y+0.5, color)
  abline(h=c(0,1), v=c(0,1), lwd=line_width/2)
  abline(v=0.5, h=0.5, lwd=line_width)
  dev.off()
}
save_cells(cell_1100)



# [x]
cell_0011 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "0011.png"))
  blank_plot()
  plot_cell(side_tri_x, side_tri_y, color) # right
  plot_cell(side_tri_y, 1-side_tri_x, color) # bot
  plot_cell(1-side_tri_x, side_tri_y, color) # left
  plot_cell(side_tri_y, side_tri_x, color) # top
  abline(h=c(0,1), v=c(0,1), lwd=line_width/2)
  lines(c(0,1, NA, 0,1), c(1,0, NA, 0,1), lwd=line_width)
  dev.off()
}
save_cells(cell_0011)



# [|\]
cell_1010 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "1010.png"))
  blank_plot()
  plot_cell(quad_x, quad_y, color)
  plot_cell(1-quad_x, 1-quad_y, color)
  plot_cell(sm_tri_x, sm_tri_y+0.5, color)
  plot_cell(1-sm_tri_x, 0.5-sm_tri_y, color)
  abline(h=c(0,1), v=c(0,1), lwd=line_width/2)
  abline(v=0.5, lwd=line_width)
  lines(c(0,1), c(1,0), lwd=line_width)
  dev.off()
}
save_cells(cell_1010)

# [|/]
cell_1001 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "1001.png"))
  blank_plot()
  plot_cell(1-quad_x, quad_y, color)
  plot_cell(quad_x, 1-quad_y, color)
  plot_cell(1-sm_tri_x, sm_tri_y+0.5, color)
  plot_cell(sm_tri_x, 0.5-sm_tri_y, color)
  abline(h=c(0,1), v=c(0,1), lwd=line_width/2)
  abline(v=0.5, lwd=line_width)
  lines(c(0,1), c(0,1), lwd=line_width)
  dev.off()
}
save_cells(cell_1001)






# [-x]
cell_0111 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "0111.png"))
  blank_plot()
  plot_cell(sm_tri_x+0.5, 1-sm_tri_y, color) # top left 
  plot_cell(sm_tri_x+0.5, sm_tri_y, color) # bot left
  plot_cell(0.5-sm_tri_x, 1-sm_tri_y, color) # top right
  plot_cell(0.5-sm_tri_x, sm_tri_y, color) # bot right
  plot_cell(side_tri_y, 1-side_tri_x, color) # bot
  plot_cell(side_tri_y, side_tri_x, color) # top
  abline(h=c(0,1), v=c(0,1), lwd=line_width/2)
  abline(h=0.5, lwd=line_width)
  lines(c(0,1, NA, 0,1), c(1,0, NA, 0,1), lwd=line_width)
  dev.off()
}
save_cells(cell_0111)





# [+/]
cell_1101 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "1101.png"))
  blank_plot()
  plot_cell(sm_sq_x, sm_sq_y+0.5, color) # top left
  plot_cell(sm_sq_x+0.5, sm_sq_y, color) # bot right
  plot_cell(sm_tri_x, 0.5-sm_tri_y, color) # bot left
  plot_cell(0.5-sm_tri_x, sm_tri_y, color) # bot left
  plot_cell(sm_tri_x+0.5, 1-sm_tri_y, color) # top right
  plot_cell(1-sm_tri_x, sm_tri_y+0.5, color) # top right
  abline(h=c(0,1), v=c(0,1), lwd=line_width/2)
  abline(h=0.5, v=0.5, lwd=line_width)
  lines(c(0,1), c(0,1), lwd=line_width)
  dev.off()
}
save_cells(cell_1101)



# [+x]
cell_1111 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "1111.png"))
  blank_plot()
  # right
  plot_cell(sm_tri_x+0.5, 1-sm_tri_y, color)
  plot_cell(sm_tri_x+0.5, sm_tri_y, color)
  
  # bot
  plot_cell(sm_tri_x, 0.5-sm_tri_y, color)
  plot_cell(1-sm_tri_x, 0.5-sm_tri_y, color)
  
  # left
  plot_cell(0.5-sm_tri_x, 1-sm_tri_y, color)
  plot_cell(0.5-sm_tri_x, sm_tri_y, color)
  
  # top
  plot_cell(sm_tri_x, 0.5+sm_tri_y, color)
  plot_cell(1-sm_tri_x, 0.5+sm_tri_y, color)
  
  # lines
  abline(h=c(0,1), v=c(0,1), lwd=line_width/2)
  abline(h=0.5, v=0.5, lwd=line_width)
  lines(c(0,1, NA, 0,1), c(1,0, NA, 0,1), lwd=line_width)
  dev.off()
}
save_cells(cell_1111)
