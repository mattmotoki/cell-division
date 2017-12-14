library(png)

# plotting parameters
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


# triangular
triangularCell <- function(r, r2, n_pnts) {
  R <- rep(r, n_pnts)
  R2 <- rep(r2, n_pnts)
  
  theta <- c(seq(0, pi/2, length.out = n_pnts), 
             seq(pi/2, 5*pi/4, length.out = n_pnts),
             seq(5*pi/4, 2*pi, length.out = n_pnts))
  
  
  x <- c(R, R2, R2)*cos(theta) + c(1-R, R2*(1+sqrt(2)),  1-R2) - 0.5
  y <- c(R, R2, R2)*sin(theta) + c(1-R, 1-R2,  R2*(1+sqrt(2))) - 0.5
  cbind(x, y)
}


# side triangular
sideTriangularCell <- function(r, r2, n_pnts) {
  R <- rep(r, n_pnts)
  R2 <- rep(r2, n_pnts)
  theta <- c(seq(0, 3*pi/4, length.out = n_pnts),
             seq(3*pi/4, 5*pi/4, length.out = n_pnts),
             seq(5*pi/4, 2*pi, length.out = n_pnts))
  x <- c(R, R2, R)*cos(theta) + c(1-R, 0.5+sqrt(2)*R2, 1-R) - 0.5
  y <- c(R, R2, R)*sin(theta) + c(1-(1+sqrt(2))*R, rep(0.5, n_pnts), (1+sqrt(2))*R) - 0.5
  cbind(x, y)
}


# quadrilateral
quadCell <- function(r, r2, n_pnts) {
  R <- rep(r, n_pnts)
  R2 <- rep(r2, n_pnts)
  
  theta <- c(seq(0, pi/2, length.out = n_pnts), 
             seq(pi/2, pi, length.out = n_pnts),
             seq(pi, 5*pi/4, length.out = n_pnts),
             seq(5*pi/4, 2*pi, length.out = n_pnts))
  
  x <- c(R, R, R, R2)*cos(theta) + c(1-R, 0.5+R, 0.5+R, 1-R2) - 0.5
  y <- c(R, R ,R, R2)*sin(theta) + c(1-R, 1-R, 0.5 + R*(sqrt(2)-1), R2*(1+sqrt(2))) - 0.5
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


# plot a single cell with shadow and dimple
plotCell <- function(x, y, color, shrinkage=2) {
  
  # start with all black cell
  polygon(x, y, col="black", border=NA)
  
  # get center of mass
  centroid <- centroidCalc(x, y)
  
  # add shadow
  n_layers <- 250
  shrink <- seq(1, 0, length=n_layers)^shrinkage
  alpha <- seq(0.09, 1, length=n_layers)
  for (k in 1:n_layers) {
    polygon(shrink[k]*(x-centroid[1])+centroid[1],
            shrink[k]*(y-centroid[2])+centroid[2],
            col=rgb(color[1], color[2], color[3], alpha[k]),
            border=NA)
  }
  
  # add dimple
  n_layers <- 100
  shrink <- seq(0., 0.9, length=n_layers)^2
  alpha <- seq(0.01, 0.2, length=n_layers)^2
  alpha <- alpha/ifelse(all(color == cellred), 2.5, 5)
  color <- 0.5*color
  for (k in 1:n_layers) {
    polygon(shrink[k]*(x-centroid[1])+centroid[1],
            shrink[k]*(y-centroid[2])+centroid[2],
            col=rgb(color[1], color[2], color[3], alpha[k]),
            border=NA)
  }  
  
}

# create a blank plot
blankPlot <- function() {
  par(mar=c(0,0,0,0), bg=NA)
  plot(1, type="n", asp=1, axes=FALSE, 
       yaxs="i", xaxs="i", xlab = "", ylab = "",
       xlim = c(0L, 1L), ylim = c(0L, 1L)
  )
}
