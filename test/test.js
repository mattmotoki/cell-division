var spritesheet
var cell_images = {};
var cell_size;

window.onload = function() {

  // Load the spritesheet
  spritesheet = new Image();
  spritesheet.src = "low_res_sprite_sheet.png";
  spritesheet.onload = function() {
    createCellImages(1/3);
  }

};

function createCellImages(scale) {
  var body = document.querySelector("body");
  var board = document.createElement("div");
  var cell_name;
  var cell_colors = ["b", "f", "g", "r"];
  var cell_mapping = {0:"00", 1:"01", 2:"10", 3:"11"};

  board.id = "board";
  for (var k=0; k<4; k++) {
    for (var i=0; i<4; i++) {
      for (var j=0; j<4; j++) {
        cell_name = cell_colors[k] + cell_mapping[i] + cell_mapping[j];
        cell_images[cell_name] = extractCell(spritesheet, i, j, k, 1/3);
        board.appendChild(cell_images[cell_name]);
      }
    }
  }
  body.appendChild(board);
}

function extractCell(img, i, j, k, scale) {

  var new_image = img.cloneNode(true);
  var cell_container = document.createElement("div");
  cell_size = 120*scale;
  // create a window to show a single cell
  cell_container.style.display = "inline-block";
  cell_container.style.overflow = "hidden";
  cell_container.style.width = (25*scale) + "%";
  cell_container.style.height = (25*scale) + "%";

  // position the cell in the window
  new_image.style.width = new_image.width*scale + "px";
  new_image.style.height = new_image.height*scale + "px";
  new_image.style.marginTop  = (-cell_size*(i+4*k)+0.5*scale) + "px";
  new_image.style.marginLeft = (-cell_size*j+0.5*scale) + "px";

  // return cell embeded in the container
  cell_container.appendChild(new_image);

  return cell_container;
}
