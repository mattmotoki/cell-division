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



#------------------
# build block functins
graphics.off()

# cell outline
png("o0000.png")
blank_plot()
# abline(h=c(0,1), v=c(0,1), lwd=line_width/2)
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
  png(paste0( substr(colorname, 5, 5), "0000.png"), width=w, height=h)
  blank_plot()
  plot_cell(sq_x, sq_y, color)
  dev.off()
}
save_cells(cell_0000)


#------------------
# single connection

# [|]
cell_1000 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "1000.png"), width=w, height=h)
  blank_plot()
  plot_cell(rect_x, sq_y, color)
  plot_cell(rect_x+0.5, sq_y, color)
  dev.off()
}
save_cells(cell_1000)


# [-] 
cell_0100 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "0100.png"), width=w, height=h)
  blank_plot()
  plot_cell(sq_y, rect_x, color)
  plot_cell(sq_y, rect_x+0.5, color)
  dev.off()
}
save_cells(cell_0100)


# [\]
cell_0010 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "0010.png"), width=w, height=h)
  blank_plot()
  plot_cell(tri_x, tri_y, color)
  plot_cell(1-tri_x, 1-tri_y, color)
  dev.off()
}
save_cells(cell_0010)


# [/] 
cell_0001 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "0001.png"), width=w, height=h)
  blank_plot()
  plot_cell(1-tri_x, tri_y, color)
  plot_cell(tri_x, 1-tri_y, color)
  dev.off()
}
save_cells(cell_0001)

#------------------
# double connection

# [+]
cell_1100 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "1100.png"), width=w, height=h)
  blank_plot()
  plot_cell(sm_sq_x, sm_sq_y, color)
  plot_cell(sm_sq_x, sm_sq_y+0.5, color)
  plot_cell(sm_sq_x+0.5, sm_sq_y, color)
  plot_cell(sm_sq_x+0.5, sm_sq_y+0.5, color)
  dev.off()
}
save_cells(cell_1100)



# [x]
cell_0011 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "0011.png"), width=w, height=h)
  blank_plot()
  plot_cell(side_tri_x, side_tri_y, color) # right
  plot_cell(side_tri_y, 1-side_tri_x, color) # bot
  plot_cell(1-side_tri_x, side_tri_y, color) # left
  plot_cell(side_tri_y, side_tri_x, color) # top
  dev.off()
}
save_cells(cell_0011)


# [|\]
cell_1010 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "1010.png"), width=w, height=h)
  blank_plot()
  plot_cell(quad_x, quad_y, color)
  plot_cell(1-quad_x, 1-quad_y, color)
  plot_cell(sm_tri_x, sm_tri_y+0.5, color)
  plot_cell(1-sm_tri_x, 0.5-sm_tri_y, color)
  dev.off()
}
save_cells(cell_1010)

# [-\] 
cell_0110 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "0110.png"), width=w, height=h)
  blank_plot()
  plot_cell(quad_y, quad_x, color)
  plot_cell(1-quad_y, 1-quad_x, color)
  plot_cell(sm_tri_y+0.5, sm_tri_x, color)
  plot_cell(0.5-sm_tri_y, 1-sm_tri_x, color)
  dev.off()
}
save_cells(cell_0110)


# [|/]
cell_1001 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "1001.png"), width=w, height=h)
  blank_plot()
  plot_cell(1-quad_x, quad_y, color)
  plot_cell(quad_x, 1-quad_y, color)
  plot_cell(1-sm_tri_x, sm_tri_y+0.5, color)
  plot_cell(sm_tri_x, 0.5-sm_tri_y, color)
  dev.off()
}
save_cells(cell_1001)


# [-/] 
cell_0101 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "0101.png"), width=w, height=h)
  blank_plot()
  plot_cell(quad_y, 1-quad_x, color)
  plot_cell(1-quad_y, quad_x, color)
  plot_cell(sm_tri_y+0.5, 1-sm_tri_x , color)
  plot_cell(0.5-sm_tri_y, sm_tri_x, color)
  dev.off()
}
save_cells(cell_0101)


#------------------
# triple connection

# [-x]
cell_0111 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "0111.png"), width=w, height=h)
  blank_plot()
  plot_cell(sm_tri_x+0.5, 1-sm_tri_y, color) # top left 
  plot_cell(sm_tri_x+0.5, sm_tri_y, color) # bot left
  plot_cell(0.5-sm_tri_x, 1-sm_tri_y, color) # top right
  plot_cell(0.5-sm_tri_x, sm_tri_y, color) # bot right
  plot_cell(side_tri_y, 1-side_tri_x, color) # bot
  plot_cell(side_tri_y, side_tri_x, color) # top
  dev.off()
}
save_cells(cell_0111)


# [|x]
cell_1011 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "1011.png"), width=w, height=h)
  blank_plot()
  plot_cell(1-sm_tri_y, sm_tri_x+0.5, color) 
  plot_cell(sm_tri_y, sm_tri_x+0.5, color) 
  plot_cell(1-sm_tri_y, 0.5-sm_tri_x, color)
  plot_cell(sm_tri_y, 0.5-sm_tri_x, color) 
  plot_cell(1-side_tri_x, side_tri_y, color)
  plot_cell(side_tri_x, side_tri_y, color)
  dev.off()
}
save_cells(cell_1011)



# [+/]
cell_1101 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "1101.png"), width=w, height=h)
  blank_plot()
  plot_cell(sm_sq_x, sm_sq_y+0.5, color) # top left
  plot_cell(sm_sq_x+0.5, sm_sq_y, color) # bot right
  plot_cell(sm_tri_x, 0.5-sm_tri_y, color) # bot left
  plot_cell(0.5-sm_tri_x, sm_tri_y, color) # bot left
  plot_cell(sm_tri_x+0.5, 1-sm_tri_y, color) # top right
  plot_cell(1-sm_tri_x, sm_tri_y+0.5, color) # top right
  dev.off()
}
save_cells(cell_1101)



# [+\]
cell_1110 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "1110.png"), width=w, height=h)
  blank_plot()
  plot_cell(sm_sq_x+0.5, sm_sq_y+0.5, color)
  plot_cell(sm_sq_x, sm_sq_y, color)
  plot_cell(sm_tri_x, 0.5+sm_tri_y, color) 
  plot_cell(0.5-sm_tri_x, 1-sm_tri_y, color)
  plot_cell(0.5+sm_tri_x, sm_tri_y, color) 
  plot_cell(1-sm_tri_x, 0.5-sm_tri_y, color)
  dev.off()
}
save_cells(cell_1110)


#------------------
# quadruple connection

# [+x]
cell_1111 <- function(colorname) {
  color <- eval(get(colorname))
  png(paste0( substr(colorname, 5, 5), "1111.png"), width=w, height=h)
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
  
  dev.off()
}
save_cells(cell_1111)
