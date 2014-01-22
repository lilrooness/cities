var tiles = require('./tiles.json');

module.exports = (function() {
  var cache, type;
 
  cache = {};
 
  for(type in tiles) {
    cache[type] = new Image();
    cache[type].src = 'assets/' + tiles[type];
  }
  
  return cache
})();
