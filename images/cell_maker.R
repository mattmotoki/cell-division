source("cell_plot_utils.R")
line_width <- 3

w = 1000
h = 1000
n_pnts <- 1000

#------------------
# cell definitions

# square cell
sq_outline <- squareCell(0.2, n_pnts)
sq_x <- sq_outline[, 1] + 0.5
sq_y <- sq_outline[, 2] + 0.5

# rectangular cell
rect_x <- sq_x - 0.5*(sq_x>0.5)

# small square cell
sm_sq_outline <- squareCell(0.4, n_pnts)
sm_sq_x <- 0.5*(sm_sq_outline[, 1] + 0.5)
sm_sq_y <- 0.5*(sm_sq_outline[, 2] + 0.5)

# trianglular cell
tri_outline <- triangularCell(0.2, 0.1, n_pnts)
tri_x <- tri_outline[, 1]+0.5
tri_y <- tri_outline[, 2]+0.5

# side trianglular cell
side_tri_outline <- sideTriangularCell(0.1, 0.275, n_pnts)
side_tri_x <- side_tri_outline[, 1]+0.5
side_tri_y <- side_tri_outline[, 2]+0.5

# small trianglular cell
sm_tri_outline <- triangularCell(0.4, 0.2, n_pnts)
sm_tri_x <- 0.5*(sm_tri_outline[, 1]+0.5)
sm_tri_y <- 0.5*(sm_tri_outline[, 2]+0.5)

# quadrilateral cell
quad_outline <- quadCell(0.2, 0.1, n_pnts)
quad_x <- quad_outline[, 1]+0.5
quad_y <- quad_outline[, 2]+0.5

#------------------
# build block functions

# 2d-interpolation for image smoothing
smoothImage <- function(fs=5) {
  
  # reload image
  rgb_img <- readPNG("tmp.png")
  
  # create interpolation grid
  inds <- seq(1, 1000, fs)
  full_grid <- make.surface.grid(list(1:1000, 1:1000))
  
  for (i in 1:3) {
    tmp <- 0
    rgb_slice <- as.matrix(rgb_img[,,i])
    for (k in 1:fs-1) {
      obj <- list(x=inds+k, y=inds+k, z=rgb_slice[inds+k, inds+k])
      interp_img <- interp.surface(obj, full_grid)
      interp_img[is.na(interp_img)] <- rgb_slice[is.na(interp_img)]
      tmp <- tmp + interp_img
    }
    rgb_img[,,i] <- tmp/fs
  }
  
  return(rgb_img)
}

# wrapper to create low, med, high res images
repeatImage <- function(save_name) {
  
  # load image
  rgb_img <- smoothImage() 
  
  # small 120x120
  png(paste0("small_120x120/", save_name), width=120, height=120)
  blankPlot()
  plot(as.raster(rgb_img))
  dev.off()
  
  # small 120x120
  png(paste0("medium_240x240/", save_name), width=240, height=240)
  blankPlot()
  plot(as.raster(rgb_img))
  dev.off()
  
  # small 120x120
  png(paste0("large_360x360/", save_name), width=360, height=360)
  blankPlot()
  plot(as.raster(rgb_img))
  dev.off()
}

# wrapper function to plot and save all colors
saveCells <- function(cell_func) {
  cell_colors <- c("cellgreen", "cellred", "cellfuscia", "cellblue", "cellyellow")
  for (colorname in cell_colors) cell_func(colorname) 
}


# cell background ----------------
graphics.off()
png("cell_background.png", width=2400, height=4800)
par(mar=c(0,0,0,0), bg=NA)
plot(1, type="n", asp=1, axes=FALSE,
     yaxs="i", xaxs="i", xlab = "", ylab = "",
     xlim = c(-1L, 2L), ylim = c(-2L, 4L)
)
plotCell(2*sm_sq_x, 2*sm_sq_y, cellgreen)
dev.off()


# cell icon ----------------
png("tmp.png", width=1000, height=1000)
blankPlot()
plotCell(2*sm_sq_x, 2*sm_sq_y, cellgreen)
dev.off()

png("cell_icon.png", width=480, height=480)
blankPlot()
rgb_img <- smoothImage()
plot(as.raster(rgb_img))
dev.off()

# # cell outline
# png("o0000.png")
# blankPlot()
# # abline(h=c(0,1), v=c(0,1), lwd=line_width/2)
# # polygon(sq_x, sq_y, col = rgb(1, 1, 1, 0))  
# dev.off()


# no connections ------------------
# []
cell_0000 <- function(colorname) {
  print(colorname)
  color <- eval(get(colorname))
  
  # make temp image
  png("tmp.png", width=w, height=h)
  blankPlot()
  plotCell(sq_x, sq_y, color, 2.0)
  dev.off()
  
  # make small medium large
  repeatImage(paste0( substr(colorname, 5, 5), "0000.png"))
}
saveCells(cell_0000)


#------------------
# single connection

# [|]
cell_1000 <- function(colorname) {
  print(colorname)
  color <- eval(get(colorname))
  
  # make temp image
  png("tmp.png", width=w, height=h)
  blankPlot()
  plotCell(rect_x, sq_y, color, 2.0)
  plotCell(rect_x+0.5, sq_y, color, 2.0)
  dev.off()
  
  # make small medium large
  repeatImage(paste0( substr(colorname, 5, 5), "1000.png"))  
}
saveCells(cell_1000)


# [-] 
cell_0100 <- function(colorname) {
  print(colorname)
  color <- eval(get(colorname))
  
  # make temp image
  png("tmp.png", width=w, height=h)
  blankPlot()
  plotCell(sq_y, rect_x, color, 2.0)
  plotCell(sq_y, rect_x+0.5, color, 2.0)
  dev.off()
  
  # make small medium large
  repeatImage(paste0( substr(colorname, 5, 5), "0100.png"))  
}
saveCells(cell_0100)


# [\]
cell_0010 <- function(colorname) {
  print(colorname)
  color <- eval(get(colorname))
  
  # make temp image
  png("tmp.png", width=w, height=h)
  blankPlot()
  plotCell(tri_x, tri_y, color, 2.0)
  plotCell(1-tri_x, 1-tri_y, color, 2.0)
  dev.off()
  
  # make small medium large
  repeatImage(paste0( substr(colorname, 5, 5), "0010.png"))  
}
saveCells(cell_0010)


# [/] 
cell_0001 <- function(colorname) {
  print(colorname)
  color <- eval(get(colorname))
  
  # make temp image
  png("tmp.png", width=w, height=h)
  blankPlot()
  plotCell(1-tri_x, tri_y, color, 2.0)
  plotCell(tri_x, 1-tri_y, color, 2.0)
  dev.off()
  
  # make small medium large
  repeatImage(paste0( substr(colorname, 5, 5), "0001.png"))  
}
saveCells(cell_0001)

#------------------
# double connection

# [+]
cell_1100 <- function(colorname) {
  print(colorname)
  color <- eval(get(colorname))
  
  # make temp image
  png("tmp.png", width=w, height=h)
  blankPlot()
  plotCell(sm_sq_x, sm_sq_y, color, 2.0)
  plotCell(sm_sq_x, sm_sq_y+0.5, color, 2.0)
  plotCell(sm_sq_x+0.5, sm_sq_y, color, 2.0)
  plotCell(sm_sq_x+0.5, sm_sq_y+0.5, color, 2.0)
  dev.off()
  
  # make small medium large
  repeatImage(paste0( substr(colorname, 5, 5), "1100.png"))  
}
saveCells(cell_1100)


# [x]
cell_0011 <- function(colorname) {
  print(colorname)
  color <- eval(get(colorname))
  
  # make temp image
  png("tmp.png", width=w, height=h)
  blankPlot()
  plotCell(side_tri_x, side_tri_y, color, 2.0) # right
  plotCell(side_tri_y, 1-side_tri_x, color, 2.0) # bot
  plotCell(1-side_tri_x, side_tri_y, color, 2.0) # left
  plotCell(side_tri_y, side_tri_x, color, 2.0) # top
  dev.off()
  
  # make small medium large
  repeatImage(paste0( substr(colorname, 5, 5), "0011.png"))  
}
saveCells(cell_0011)


# [|\]
cell_1010 <- function(colorname) {
  print(colorname)
  color <- eval(get(colorname))
  
  # make temp image
  png("tmp.png", width=w, height=h)
  blankPlot()
  plotCell(quad_x, quad_y, color, 2.0)
  plotCell(1-quad_x, 1-quad_y, color, 2.0)
  plotCell(sm_tri_x, sm_tri_y+0.5, color, 2)
  plotCell(1-sm_tri_x, 0.5-sm_tri_y, color, 2)
  dev.off()
  
  # make small medium large
  repeatImage(paste0( substr(colorname, 5, 5), "1010.png"))  
}
saveCells(cell_1010)

# [-\] 
cell_0110 <- function(colorname) {
  print(colorname)
  color <- eval(get(colorname))
  
  # make temp image
  png("tmp.png", width=w, height=h)
  blankPlot()
  plotCell(quad_y, quad_x, color, 2.0)
  plotCell(1-quad_y, 1-quad_x, color, 2.0)
  plotCell(sm_tri_y+0.5, sm_tri_x, color, 2)
  plotCell(0.5-sm_tri_y, 1-sm_tri_x, color, 2)
  dev.off()
  
  # make small medium large
  repeatImage(paste0( substr(colorname, 5, 5), "0110.png"))  
}
saveCells(cell_0110)


# [|/]
cell_1001 <- function(colorname) {
  print(colorname)
  color <- eval(get(colorname))
  
  # make temp image
  png("tmp.png", width=w, height=h)
  blankPlot()
  plotCell(1-quad_x, quad_y, color, 2.0)
  plotCell(quad_x, 1-quad_y, color, 2.0)
  plotCell(1-sm_tri_x, sm_tri_y+0.5, color, 2)
  plotCell(sm_tri_x, 0.5-sm_tri_y, color, 2)
  dev.off()
  
  # make small medium large
  repeatImage(paste0( substr(colorname, 5, 5), "1001.png"))  
}
saveCells(cell_1001)


# [-/] 
cell_0101 <- function(colorname) {
  print(colorname)
  color <- eval(get(colorname))
  
  # make temp image
  png("tmp.png", width=w, height=h)
  blankPlot()
  plotCell(quad_y, 1-quad_x, color, 2.0)
  plotCell(1-quad_y, quad_x, color, 2.0)
  plotCell(sm_tri_y+0.5, 1-sm_tri_x , color, 2)
  plotCell(0.5-sm_tri_y, sm_tri_x, color, 2)
  dev.off()
  
  # make small medium large
  repeatImage(paste0( substr(colorname, 5, 5), "0101.png"))  
}
saveCells(cell_0101)


#------------------
# triple connection

# [-x]
cell_0111 <- function(colorname) {
  print(colorname)
  color <- eval(get(colorname))
  
  # make temp image
  png("tmp.png", width=w, height=h)
  blankPlot()
  plotCell(sm_tri_x+0.5, 1-sm_tri_y, color, 2) # top left 
  plotCell(sm_tri_x+0.5, sm_tri_y, color, 2) # bot left
  plotCell(0.5-sm_tri_x, 1-sm_tri_y, color, 2) # top right
  plotCell(0.5-sm_tri_x, sm_tri_y, color, 2) # bot right
  plotCell(side_tri_y, 1-side_tri_x, color, 2.0) # bot
  plotCell(side_tri_y, side_tri_x, color, 2.0) # top
  dev.off()
  
  # make small medium large
  repeatImage(paste0( substr(colorname, 5, 5), "0111.png"))  
}
saveCells(cell_0111)


# [|x]
cell_1011 <- function(colorname) {
  print(colorname)
  color <- eval(get(colorname))
  
  # make temp image
  png("tmp.png", width=w, height=h)
  blankPlot()
  plotCell(1-sm_tri_y, sm_tri_x+0.5, color, 2) 
  plotCell(sm_tri_y, sm_tri_x+0.5, color, 2)
  plotCell(1-sm_tri_y, 0.5-sm_tri_x, color, 2)
  plotCell(sm_tri_y, 0.5-sm_tri_x, color, 2) 
  plotCell(1-side_tri_x, side_tri_y, color, 2.0)
  plotCell(side_tri_x, side_tri_y, color, 2.0)
  dev.off()
  
  # make small medium large
  repeatImage(paste0( substr(colorname, 5, 5), "1011.png"))  
}
saveCells(cell_1011)


# [+/]
cell_1101 <- function(colorname) {
  print(colorname)
  color <- eval(get(colorname))
  
  # make temp image
  png("tmp.png", width=w, height=h)
  blankPlot()
  plotCell(sm_sq_x, sm_sq_y+0.5, color, 2.0) # top left
  plotCell(sm_sq_x+0.5, sm_sq_y, color, 2.0) # bot right
  plotCell(sm_tri_x, 0.5-sm_tri_y, color, 2) # bot left
  plotCell(0.5-sm_tri_x, sm_tri_y, color, 2) # bot left
  plotCell(sm_tri_x+0.5, 1-sm_tri_y, color, 2) # top right
  plotCell(1-sm_tri_x, sm_tri_y+0.5, color, 2) # top right
  dev.off()
  
  # make small medium large
  repeatImage(paste0( substr(colorname, 5, 5), "1101.png"))  
}
saveCells(cell_1101)



# [+\]
cell_1110 <- function(colorname) {
  print(colorname)
  color <- eval(get(colorname))
  
  # make temp image
  png("tmp.png", width=w, height=h)
  blankPlot()
  plotCell(sm_sq_x+0.5, sm_sq_y+0.5, color, 2.0)
  plotCell(sm_sq_x, sm_sq_y, color, 2.0)
  plotCell(sm_tri_x, 0.5+sm_tri_y, color, 2) 
  plotCell(0.5-sm_tri_x, 1-sm_tri_y, color, 2)
  plotCell(0.5+sm_tri_x, sm_tri_y, color, 2) 
  plotCell(1-sm_tri_x, 0.5-sm_tri_y, color, 2)
  dev.off()
  
  # make small medium large
  repeatImage(paste0( substr(colorname, 5, 5), "1110.png"))  
}
saveCells(cell_1110)


#------------------
# quadruple connection

# [+x]
cell_1111 <- function(colorname) {
  print(colorname)
  color <- eval(get(colorname))
  
  # make temp image
  png("tmp.png", width=w, height=h)
  blankPlot()
  # right
  plotCell(sm_tri_x+0.5, 1-sm_tri_y, color, 2)
  plotCell(sm_tri_x+0.5, sm_tri_y, color, 2)
  
  # bot
  plotCell(sm_tri_x, 0.5-sm_tri_y, color, 2)
  plotCell(1-sm_tri_x, 0.5-sm_tri_y, color, 2)
  
  # left
  plotCell(0.5-sm_tri_x, 1-sm_tri_y, color, 2)
  plotCell(0.5-sm_tri_x, sm_tri_y, color, 2)
  
  # top
  plotCell(sm_tri_x, 0.5+sm_tri_y, color, 2)
  plotCell(1-sm_tri_x, 0.5+sm_tri_y, color, 2)
  
  dev.off()
  
  # make small medium large
  repeatImage(paste0( substr(colorname, 5, 5), "1111.png"))  
}
saveCells(cell_1111)