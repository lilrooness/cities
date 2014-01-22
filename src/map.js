var heightmap = require('./heightmap');


module.exports = (function() {
  
  // # random
  // Generates a map of with dimensions
  // specified as arguments.
  function random(w, h) { 
    return heightmap(w, h);
  }

  // # flat
  // Generates a map with dimensions
  // specified as argument and constant
  // height specified by height.
  function flat(w, h, height) {
    return fill(w, h, function() {
      return height;
    });
  }

  // # fill
  // Fills a map of dimensions
  // specified by parameters.
  function fill(w, h, fillFn) {
    var x, y, map = [];
    for(x = 0; x < w; x++) {
      map[x] = [];
      for(y = 0; y < h; y++) {
        map[x][y] = fillFn(x, y);
      }
    }
    return map;
  }
  
  return {
    random: random,
    flat: flat,
    fill: fill
  }
})();
