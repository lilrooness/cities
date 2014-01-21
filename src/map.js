var noise = require('./noise');

module.exports = function() {
  var map;
  
  function random() { 
    noise.seed(Math.random());
     
  }

  function fill() {
    map = [];
    for(var x = 0; x < 100; x++) {
      map[x] = [];
      for(var y = 0; y < 100; y++) {
        map[x][y] = noise.simplex2(x, y);
      }
    } 
  }
  
  return map;
}
