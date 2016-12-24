library(png)

# plotting parameters
n_pnts <- 100
cellgreen <- c(34/255,250/255,34/255)
cellred <- c(255/255,60/255,0/255)
cellfuscia <- c(230/255,54/255,230/255)
cellblue <- c(34/255,142/255,250/255)
cellyellow <- c(255/255,255/255,0/255)

#------------------
# single cell plotting functions

# square
squareCell <- function(r, n_pnts) {
  R <- rep(r, n_pnts)
  theta <- seq(0, 2*pi, length.out = 4*n_pnts)
  
  x <- r*cos(theta) + c(1-R, R, R, 1-R) - 0.5
  y <- r*sin(theta) + c(1-R, 1-R, R, R) - 0.5
  cbind(x, y)
}


#------------------
# post single cell plotting functions

# centroid calculation
circularShift <- function(x,shift=0) {
  N <- length(x)
  K <- shift %% N
  if(K == 0) x else c(x[(N-K+1):N],x[1:(N-K)])
}

centroidCalc <- function(x, y) {
  shift_x <- circularShift(x, 1)
  shift_y <- circularShift(y, 1)
  d <- x*shift_y - shift_x*y
  c(sum( (x+shift_x)*d ), sum( (y+shift_y)*d ) ) / (3*sum(d))
}


# create a blank plot
blankPlot <- function() {
  par(mar=c(0,0,0,0), bg=NA)
  plot(1, type="n", asp=1, axes=FALSE, 
       yaxs="i", xaxs="i", xlab = "", ylab = "",
       xlim = c(-0.002, 1.002), ylim = c(-0.002, 1.002)
  )
}


# plot a single cell with shadow and dimple
plotCell <- function(x, y, color) {
  
  graphics.off()
  blankPlot()
  color <- cellgreen
  
  # start with all black cell
  polygon(x, y, col="black", border=NA)
  
  # get center of mass
  centroid <- centroidCalc(x, y)
  
  # add shadow
  n_layers <- 250
  shrink <- seq(1, 0.1,length=n_layers)
  alpha <- seq(10/n_layers, 0.8, length=n_layers)
  for (k in 1:n_layers) {
    polygon(shrink[k]*(x-centroid[1])+centroid[1],
            shrink[k]*(y-centroid[2])+centroid[2],
            col=rgb(color[1], color[2], color[3], alpha[k]),
            border=NA)
  }
  
  # add dimple
  n_layers <- 50
  shrink <- seq(0.25, 0.85, length=n_layers)^2
  alpha <- seq(1/n_layers/8, 1/n_layers, length=n_layers)
  color <- 0.5*color
  for (k in 1:n_layers) {
    polygon(shrink[k]*(x-centroid[1])+centroid[1],
            shrink[k]*(y-centroid[2])+centroid[2],
            col=rgb(color[1], color[2], color[3], alpha[k]),
            border=NA)
  }
}

# square cell
sq_outline <- squareCell(0.2, 100)
sq_x <- sq_outline[, 1] + 0.5
sq_y <- sq_outline[, 2] + 0.5

blankPlot()
plotCell(2*sm_sq_x, 2*sm_sq_y, cellgreen)