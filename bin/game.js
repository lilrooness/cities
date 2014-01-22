(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(attributes) {
  return function(settings) {
    var key, spriteUrl;
    
    for(key in settings) {
      attributes[key] = settings[key];
    }

    spriteUrl = attributes.sprite;
    attributes.sprite = new Image();
    attributes.sprite.src = 'assets/' + spriteUrl + '.png';    

    return attributes;
  }
}



},{}],2:[function(require,module,exports){
var tileImages = require("./tiles");

module.exports = (function() {
  var canvas, ctx, map, ts, threshold,
    camera, tiles, entities, resources;

  camera = { x:0, y:0, zoom:1 };
  
  // Tile Size  
  ts = 24;
  tiles = [];
  
  entities = [];
  resources = [];
  
  // # Thresholds
  // This defines the thresholds for map
  // normalization.
  threshold = {
    water: 0,
    sand: 0.3,
    grass: 0.4,
    stone: 0.8,
    snow: 0.98
  };

  // # init
  // Initializes the engine and begins the
  // rendering process. Should only be called
  // after the window has loaded.
  function init() {
    canvas = document.querySelector('#map');
    ctx = canvas.getContext('2d');
    fullscreen();
    render();
    setInterval(render, 50);  
  }

  // # fullscreen
  // Sets the size of the canvas to be the
  // size of the full window. Should be called
  // whenever the window fires a resize event. 
  function fullscreen() {
    ctx.width = document.body.clientWidth;
    ctx.height = document.body.clientHeight;
    canvas.width = ctx.width;
    canvas.height = ctx.height;
  }

  // # loadMap
  // This function takes an array of tiles
  // with values between 0 and 1 and loads
  // it into the engine, ready to be rendered.
  function loadMap(tileArray) {
    map = normalize(tileArray);
  }  

  // # normalize
  // Turns a map of values between 0 and 1
  // into array index positions, based on
  // output from mapToTile and the thresholds
  // defined at the top of the engine.
  function normalize(map) {
    var x, y, type, index;
    
    index = 0;
    for(type in threshold) {
      tiles[index] = tileImages[type];
      // Convert threshold to be a lookup
      threshold[index] = type;
      index += 1;
    }
     
    for(x = 0; x < map.length; x++) {
      for(y = 0; y < map[x].length; y++) {
        map[x][y] = mapToTile(map[x][y]);
      }
    }
    return map;
  }

  // # mapToTile
  // Turns a value in the range of 0 to 1
  // into an array index for a tile type 
  // based on threshold map.
  function mapToTile(height) {
    var type, tile, select, index;
    index = 0;
    select = 0;
    for(type in threshold) {
      if(height >= threshold[type]) {
        select = index;
      }
      index++;
    }
    return select;
  }

  // # tileAt
  // Returns the name of the type
  // of tile at x, y
  function tileAt(x, y) {
    return threshold[map[x][y]];
  }

  // # render
  // Y'know. It renders stuff.
  function render() {
    var x, y, tile;

    update();
    
    ctx.clearRect(0, 0, ctx.width, ctx.height);
     
    for(x = 0; x < map.length; x++) {
      for(y = 0; y < map[x].length; y++) {
        tile = tiles[map[x][y]];
        ctx.drawImage(tile, 
          (x - camera.x) * ts * camera.zoom, 
          (y - camera.y) * ts * camera.zoom,
          ts * camera.zoom,
          ts * camera.zoom
        );
      }
    }    
    
    renderResources();
    renderEntities();
  }

  function spawnEntity(entity) {
    entities.push(entity);
  }

  function spawnResource(resource) {
    resources.push(resource);
  }

  function update() {
    if(keys.left) {
      camera.x--;
    } else if(keys.right) {
      camera.x++;
    }
    if(keys.up) {
      camera.y--;
    } else if(keys.down) {
      camera.y++;
    }
    if(keys.z) {
      camera.zoom -= 0.1;
    } else if(keys.x) {
      camera.zoom += 0.1;
    }
    updateResources();
    updateEntities();
  }

  function renderResources() {
    for(var i = 0; i < resources.length; i++) {
      var r = resources[i];
      ctx.drawImage(r.sprite, 
        (r.x - camera.x) * ts * camera.zoom, 
        (r.y - camera.y) * ts * camera.zoom, 
        r.w * camera.zoom, r.h * camera.zoom
      );
    }
  }
  
  function updateResources() {
    for(var i = 0; i < resources.length; i++) {
      var r = resources[i];
    }
  }

  function renderEntities() {
    for(var i = 0; i < entities.length; i++) {
      
    }
  }

  function updateEntities() {
    for(var i = 0; i < entities.length; i++) {
      
    }
  }
  
  return {
    init: init,
    fullscreen: fullscreen,
    loadMap: loadMap,
    spawnEntity: spawnEntity,
    spawnResource: spawnResource
  }
})();

},{"./tiles":6}],3:[function(require,module,exports){
var engine = require('./engine')
  , map = require('./map')
  , Resource = require('./Resource');

var Tree = new Resource({
  sprite: 'tree',
  h: 20,
  w: 20
});

var t = new Tree({ x:20, y:20 });
engine.spawnResource(t);

engine.loadMap(map.random(150, 150));
window.addEventListener('load', engine.init);
window.addEventListener('resize', engine.fullscreen);

},{"./Resource":1,"./engine":2,"./map":5}],4:[function(require,module,exports){
// I DID NOT WRITE THIS - Dan Prince //

var p = 5;

module.exports = function(w, h) {
  var noiseArr = new Array();
  
  for (i = 0; i <= p; i++) {
    noiseArr[i] = new Array();

    for (j = 0; j <= p; j++) {
      var height = Math.random();

      if (i == 0 || j == 0 || i == p || j == p)
        height = 1;

      noiseArr[i][j] = height;
    }
  }

  return (flatten(interpolate(noiseArr, w, h)));
}

function interpolate(points, w, h) {
  var noiseArr = new Array()
  var x = 0;
  var y = 0;
  var n = w/p;
  var m = h/p;

  for (i = 0; i < w; i++) {
    if (i != 0 && i % n == 0)
      x++;

    noiseArr[i] = new Array();
    for (j = 0; j < h; j++) {

      if (j != 0 && j % m == 0)
        y++;

      var mu_x = (i % n) / n;
      var mu_2 = (1 - Math.cos(mu_x * Math.PI)) / 2;

      var int_x1 = points[x][y] * (1 - mu_2) + points[x + 1][y] * mu_2;
      var int_x2 = points[x][y + 1] * (1 - mu_2) + points[x + 1][y + 1] * mu_2;

      var mu_y = (j % m) / m;
      var mu_2 = (1 - Math.cos(mu_y * Math.PI)) / 2;
      var int_y = int_x1 * (1 - mu_2) + int_x2 * mu_2;

      noiseArr[i][j] = int_y;
    }
    y = 0;
  }
  return (noiseArr);
}

function flatten(points) {
  var noiseArr = new Array()
  for (i = 0; i < points.length; i++) {
    noiseArr[i] = new Array()
    for (j = 0; j < points[i].length; j++) {
      /*
      if (points[i][j] < 0.2)
        noiseArr[i][j] = 0;

      else if (points[i][j] < 0.4)
        noiseArr[i][j] = 0.2;

      else if (points[i][j] < 0.6)
        noiseArr[i][j] = 0.4;

      else if (points[i][j] < 0.8)
        noiseArr[i][j] = 0.6;

      else
        noiseArr[i][j] = 1;*/
      noiseArr[i][j] = 1 - points[i][j];
    }
  }

  return (noiseArr);
}

},{}],5:[function(require,module,exports){
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

},{"./heightmap":4}],6:[function(require,module,exports){
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

},{"./tiles.json":7}],7:[function(require,module,exports){
module.exports={
  "water": "floor.png",
  "grass": "grass.png",
  "sand": "sand.png",
  "snow": "snow.png",
  "water": "water.png",
  "stone": "stone.png"
}

},{}]},{},[3])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9kYW4vZGV2L2NpdGllcy9ub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvZGFuL2Rldi9jaXRpZXMvc3JjL1Jlc291cmNlLmpzIiwiL2hvbWUvZGFuL2Rldi9jaXRpZXMvc3JjL2VuZ2luZS5qcyIsIi9ob21lL2Rhbi9kZXYvY2l0aWVzL3NyYy9nYW1lLmpzIiwiL2hvbWUvZGFuL2Rldi9jaXRpZXMvc3JjL2hlaWdodG1hcC5qcyIsIi9ob21lL2Rhbi9kZXYvY2l0aWVzL3NyYy9tYXAuanMiLCIvaG9tZS9kYW4vZGV2L2NpdGllcy9zcmMvdGlsZXMuanMiLCIvaG9tZS9kYW4vZGV2L2NpdGllcy9zcmMvdGlsZXMuanNvbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXR0cmlidXRlcykge1xuICByZXR1cm4gZnVuY3Rpb24oc2V0dGluZ3MpIHtcbiAgICB2YXIga2V5LCBzcHJpdGVVcmw7XG4gICAgXG4gICAgZm9yKGtleSBpbiBzZXR0aW5ncykge1xuICAgICAgYXR0cmlidXRlc1trZXldID0gc2V0dGluZ3Nba2V5XTtcbiAgICB9XG5cbiAgICBzcHJpdGVVcmwgPSBhdHRyaWJ1dGVzLnNwcml0ZTtcbiAgICBhdHRyaWJ1dGVzLnNwcml0ZSA9IG5ldyBJbWFnZSgpO1xuICAgIGF0dHJpYnV0ZXMuc3ByaXRlLnNyYyA9ICdhc3NldHMvJyArIHNwcml0ZVVybCArICcucG5nJzsgICAgXG5cbiAgICByZXR1cm4gYXR0cmlidXRlcztcbiAgfVxufVxuXG5cbiIsInZhciB0aWxlSW1hZ2VzID0gcmVxdWlyZShcIi4vdGlsZXNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgY2FudmFzLCBjdHgsIG1hcCwgdHMsIHRocmVzaG9sZCxcbiAgICBjYW1lcmEsIHRpbGVzLCBlbnRpdGllcywgcmVzb3VyY2VzO1xuXG4gIGNhbWVyYSA9IHsgeDowLCB5OjAsIHpvb206MSB9O1xuICBcbiAgLy8gVGlsZSBTaXplICBcbiAgdHMgPSAyNDtcbiAgdGlsZXMgPSBbXTtcbiAgXG4gIGVudGl0aWVzID0gW107XG4gIHJlc291cmNlcyA9IFtdO1xuICBcbiAgLy8gIyBUaHJlc2hvbGRzXG4gIC8vIFRoaXMgZGVmaW5lcyB0aGUgdGhyZXNob2xkcyBmb3IgbWFwXG4gIC8vIG5vcm1hbGl6YXRpb24uXG4gIHRocmVzaG9sZCA9IHtcbiAgICB3YXRlcjogMCxcbiAgICBzYW5kOiAwLjMsXG4gICAgZ3Jhc3M6IDAuNCxcbiAgICBzdG9uZTogMC44LFxuICAgIHNub3c6IDAuOThcbiAgfTtcblxuICAvLyAjIGluaXRcbiAgLy8gSW5pdGlhbGl6ZXMgdGhlIGVuZ2luZSBhbmQgYmVnaW5zIHRoZVxuICAvLyByZW5kZXJpbmcgcHJvY2Vzcy4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkXG4gIC8vIGFmdGVyIHRoZSB3aW5kb3cgaGFzIGxvYWRlZC5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFwJyk7XG4gICAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgZnVsbHNjcmVlbigpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldEludGVydmFsKHJlbmRlciwgNTApOyAgXG4gIH1cblxuICAvLyAjIGZ1bGxzY3JlZW5cbiAgLy8gU2V0cyB0aGUgc2l6ZSBvZiB0aGUgY2FudmFzIHRvIGJlIHRoZVxuICAvLyBzaXplIG9mIHRoZSBmdWxsIHdpbmRvdy4gU2hvdWxkIGJlIGNhbGxlZFxuICAvLyB3aGVuZXZlciB0aGUgd2luZG93IGZpcmVzIGEgcmVzaXplIGV2ZW50LiBcbiAgZnVuY3Rpb24gZnVsbHNjcmVlbigpIHtcbiAgICBjdHgud2lkdGggPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xuICAgIGN0eC5oZWlnaHQgPSBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodDtcbiAgICBjYW52YXMud2lkdGggPSBjdHgud2lkdGg7XG4gICAgY2FudmFzLmhlaWdodCA9IGN0eC5oZWlnaHQ7XG4gIH1cblxuICAvLyAjIGxvYWRNYXBcbiAgLy8gVGhpcyBmdW5jdGlvbiB0YWtlcyBhbiBhcnJheSBvZiB0aWxlc1xuICAvLyB3aXRoIHZhbHVlcyBiZXR3ZWVuIDAgYW5kIDEgYW5kIGxvYWRzXG4gIC8vIGl0IGludG8gdGhlIGVuZ2luZSwgcmVhZHkgdG8gYmUgcmVuZGVyZWQuXG4gIGZ1bmN0aW9uIGxvYWRNYXAodGlsZUFycmF5KSB7XG4gICAgbWFwID0gbm9ybWFsaXplKHRpbGVBcnJheSk7XG4gIH0gIFxuXG4gIC8vICMgbm9ybWFsaXplXG4gIC8vIFR1cm5zIGEgbWFwIG9mIHZhbHVlcyBiZXR3ZWVuIDAgYW5kIDFcbiAgLy8gaW50byBhcnJheSBpbmRleCBwb3NpdGlvbnMsIGJhc2VkIG9uXG4gIC8vIG91dHB1dCBmcm9tIG1hcFRvVGlsZSBhbmQgdGhlIHRocmVzaG9sZHNcbiAgLy8gZGVmaW5lZCBhdCB0aGUgdG9wIG9mIHRoZSBlbmdpbmUuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZShtYXApIHtcbiAgICB2YXIgeCwgeSwgdHlwZSwgaW5kZXg7XG4gICAgXG4gICAgaW5kZXggPSAwO1xuICAgIGZvcih0eXBlIGluIHRocmVzaG9sZCkge1xuICAgICAgdGlsZXNbaW5kZXhdID0gdGlsZUltYWdlc1t0eXBlXTtcbiAgICAgIC8vIENvbnZlcnQgdGhyZXNob2xkIHRvIGJlIGEgbG9va3VwXG4gICAgICB0aHJlc2hvbGRbaW5kZXhdID0gdHlwZTtcbiAgICAgIGluZGV4ICs9IDE7XG4gICAgfVxuICAgICBcbiAgICBmb3IoeCA9IDA7IHggPCBtYXAubGVuZ3RoOyB4KyspIHtcbiAgICAgIGZvcih5ID0gMDsgeSA8IG1hcFt4XS5sZW5ndGg7IHkrKykge1xuICAgICAgICBtYXBbeF1beV0gPSBtYXBUb1RpbGUobWFwW3hdW3ldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcDtcbiAgfVxuXG4gIC8vICMgbWFwVG9UaWxlXG4gIC8vIFR1cm5zIGEgdmFsdWUgaW4gdGhlIHJhbmdlIG9mIDAgdG8gMVxuICAvLyBpbnRvIGFuIGFycmF5IGluZGV4IGZvciBhIHRpbGUgdHlwZSBcbiAgLy8gYmFzZWQgb24gdGhyZXNob2xkIG1hcC5cbiAgZnVuY3Rpb24gbWFwVG9UaWxlKGhlaWdodCkge1xuICAgIHZhciB0eXBlLCB0aWxlLCBzZWxlY3QsIGluZGV4O1xuICAgIGluZGV4ID0gMDtcbiAgICBzZWxlY3QgPSAwO1xuICAgIGZvcih0eXBlIGluIHRocmVzaG9sZCkge1xuICAgICAgaWYoaGVpZ2h0ID49IHRocmVzaG9sZFt0eXBlXSkge1xuICAgICAgICBzZWxlY3QgPSBpbmRleDtcbiAgICAgIH1cbiAgICAgIGluZGV4Kys7XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3Q7XG4gIH1cblxuICAvLyAjIHRpbGVBdFxuICAvLyBSZXR1cm5zIHRoZSBuYW1lIG9mIHRoZSB0eXBlXG4gIC8vIG9mIHRpbGUgYXQgeCwgeVxuICBmdW5jdGlvbiB0aWxlQXQoeCwgeSkge1xuICAgIHJldHVybiB0aHJlc2hvbGRbbWFwW3hdW3ldXTtcbiAgfVxuXG4gIC8vICMgcmVuZGVyXG4gIC8vIFkna25vdy4gSXQgcmVuZGVycyBzdHVmZi5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciB4LCB5LCB0aWxlO1xuXG4gICAgdXBkYXRlKCk7XG4gICAgXG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjdHgud2lkdGgsIGN0eC5oZWlnaHQpO1xuICAgICBcbiAgICBmb3IoeCA9IDA7IHggPCBtYXAubGVuZ3RoOyB4KyspIHtcbiAgICAgIGZvcih5ID0gMDsgeSA8IG1hcFt4XS5sZW5ndGg7IHkrKykge1xuICAgICAgICB0aWxlID0gdGlsZXNbbWFwW3hdW3ldXTtcbiAgICAgICAgY3R4LmRyYXdJbWFnZSh0aWxlLCBcbiAgICAgICAgICAoeCAtIGNhbWVyYS54KSAqIHRzICogY2FtZXJhLnpvb20sIFxuICAgICAgICAgICh5IC0gY2FtZXJhLnkpICogdHMgKiBjYW1lcmEuem9vbSxcbiAgICAgICAgICB0cyAqIGNhbWVyYS56b29tLFxuICAgICAgICAgIHRzICogY2FtZXJhLnpvb21cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9ICAgIFxuICAgIFxuICAgIHJlbmRlclJlc291cmNlcygpO1xuICAgIHJlbmRlckVudGl0aWVzKCk7XG4gIH1cblxuICBmdW5jdGlvbiBzcGF3bkVudGl0eShlbnRpdHkpIHtcbiAgICBlbnRpdGllcy5wdXNoKGVudGl0eSk7XG4gIH1cblxuICBmdW5jdGlvbiBzcGF3blJlc291cmNlKHJlc291cmNlKSB7XG4gICAgcmVzb3VyY2VzLnB1c2gocmVzb3VyY2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIGlmKGtleXMubGVmdCkge1xuICAgICAgY2FtZXJhLngtLTtcbiAgICB9IGVsc2UgaWYoa2V5cy5yaWdodCkge1xuICAgICAgY2FtZXJhLngrKztcbiAgICB9XG4gICAgaWYoa2V5cy51cCkge1xuICAgICAgY2FtZXJhLnktLTtcbiAgICB9IGVsc2UgaWYoa2V5cy5kb3duKSB7XG4gICAgICBjYW1lcmEueSsrO1xuICAgIH1cbiAgICBpZihrZXlzLnopIHtcbiAgICAgIGNhbWVyYS56b29tIC09IDAuMTtcbiAgICB9IGVsc2UgaWYoa2V5cy54KSB7XG4gICAgICBjYW1lcmEuem9vbSArPSAwLjE7XG4gICAgfVxuICAgIHVwZGF0ZVJlc291cmNlcygpO1xuICAgIHVwZGF0ZUVudGl0aWVzKCk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJSZXNvdXJjZXMoKSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHJlc291cmNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHIgPSByZXNvdXJjZXNbaV07XG4gICAgICBjdHguZHJhd0ltYWdlKHIuc3ByaXRlLCBcbiAgICAgICAgKHIueCAtIGNhbWVyYS54KSAqIHRzICogY2FtZXJhLnpvb20sIFxuICAgICAgICAoci55IC0gY2FtZXJhLnkpICogdHMgKiBjYW1lcmEuem9vbSwgXG4gICAgICAgIHIudyAqIGNhbWVyYS56b29tLCByLmggKiBjYW1lcmEuem9vbVxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgXG4gIGZ1bmN0aW9uIHVwZGF0ZVJlc291cmNlcygpIHtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgcmVzb3VyY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgciA9IHJlc291cmNlc1tpXTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJFbnRpdGllcygpIHtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIFxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZUVudGl0aWVzKCkge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBlbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgXG4gICAgfVxuICB9XG4gIFxuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXQsXG4gICAgZnVsbHNjcmVlbjogZnVsbHNjcmVlbixcbiAgICBsb2FkTWFwOiBsb2FkTWFwLFxuICAgIHNwYXduRW50aXR5OiBzcGF3bkVudGl0eSxcbiAgICBzcGF3blJlc291cmNlOiBzcGF3blJlc291cmNlXG4gIH1cbn0pKCk7XG4iLCJ2YXIgZW5naW5lID0gcmVxdWlyZSgnLi9lbmdpbmUnKVxuICAsIG1hcCA9IHJlcXVpcmUoJy4vbWFwJylcbiAgLCBSZXNvdXJjZSA9IHJlcXVpcmUoJy4vUmVzb3VyY2UnKTtcblxudmFyIFRyZWUgPSBuZXcgUmVzb3VyY2Uoe1xuICBzcHJpdGU6ICd0cmVlJyxcbiAgaDogMjAsXG4gIHc6IDIwXG59KTtcblxudmFyIHQgPSBuZXcgVHJlZSh7IHg6MjAsIHk6MjAgfSk7XG5lbmdpbmUuc3Bhd25SZXNvdXJjZSh0KTtcblxuZW5naW5lLmxvYWRNYXAobWFwLnJhbmRvbSgxNTAsIDE1MCkpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBlbmdpbmUuaW5pdCk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZW5naW5lLmZ1bGxzY3JlZW4pO1xuIiwiLy8gSSBESUQgTk9UIFdSSVRFIFRISVMgLSBEYW4gUHJpbmNlIC8vXG5cbnZhciBwID0gNTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih3LCBoKSB7XG4gIHZhciBub2lzZUFyciA9IG5ldyBBcnJheSgpO1xuICBcbiAgZm9yIChpID0gMDsgaSA8PSBwOyBpKyspIHtcbiAgICBub2lzZUFycltpXSA9IG5ldyBBcnJheSgpO1xuXG4gICAgZm9yIChqID0gMDsgaiA8PSBwOyBqKyspIHtcbiAgICAgIHZhciBoZWlnaHQgPSBNYXRoLnJhbmRvbSgpO1xuXG4gICAgICBpZiAoaSA9PSAwIHx8IGogPT0gMCB8fCBpID09IHAgfHwgaiA9PSBwKVxuICAgICAgICBoZWlnaHQgPSAxO1xuXG4gICAgICBub2lzZUFycltpXVtqXSA9IGhlaWdodDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKGZsYXR0ZW4oaW50ZXJwb2xhdGUobm9pc2VBcnIsIHcsIGgpKSk7XG59XG5cbmZ1bmN0aW9uIGludGVycG9sYXRlKHBvaW50cywgdywgaCkge1xuICB2YXIgbm9pc2VBcnIgPSBuZXcgQXJyYXkoKVxuICB2YXIgeCA9IDA7XG4gIHZhciB5ID0gMDtcbiAgdmFyIG4gPSB3L3A7XG4gIHZhciBtID0gaC9wO1xuXG4gIGZvciAoaSA9IDA7IGkgPCB3OyBpKyspIHtcbiAgICBpZiAoaSAhPSAwICYmIGkgJSBuID09IDApXG4gICAgICB4Kys7XG5cbiAgICBub2lzZUFycltpXSA9IG5ldyBBcnJheSgpO1xuICAgIGZvciAoaiA9IDA7IGogPCBoOyBqKyspIHtcblxuICAgICAgaWYgKGogIT0gMCAmJiBqICUgbSA9PSAwKVxuICAgICAgICB5Kys7XG5cbiAgICAgIHZhciBtdV94ID0gKGkgJSBuKSAvIG47XG4gICAgICB2YXIgbXVfMiA9ICgxIC0gTWF0aC5jb3MobXVfeCAqIE1hdGguUEkpKSAvIDI7XG5cbiAgICAgIHZhciBpbnRfeDEgPSBwb2ludHNbeF1beV0gKiAoMSAtIG11XzIpICsgcG9pbnRzW3ggKyAxXVt5XSAqIG11XzI7XG4gICAgICB2YXIgaW50X3gyID0gcG9pbnRzW3hdW3kgKyAxXSAqICgxIC0gbXVfMikgKyBwb2ludHNbeCArIDFdW3kgKyAxXSAqIG11XzI7XG5cbiAgICAgIHZhciBtdV95ID0gKGogJSBtKSAvIG07XG4gICAgICB2YXIgbXVfMiA9ICgxIC0gTWF0aC5jb3MobXVfeSAqIE1hdGguUEkpKSAvIDI7XG4gICAgICB2YXIgaW50X3kgPSBpbnRfeDEgKiAoMSAtIG11XzIpICsgaW50X3gyICogbXVfMjtcblxuICAgICAgbm9pc2VBcnJbaV1bal0gPSBpbnRfeTtcbiAgICB9XG4gICAgeSA9IDA7XG4gIH1cbiAgcmV0dXJuIChub2lzZUFycik7XG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW4ocG9pbnRzKSB7XG4gIHZhciBub2lzZUFyciA9IG5ldyBBcnJheSgpXG4gIGZvciAoaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICBub2lzZUFycltpXSA9IG5ldyBBcnJheSgpXG4gICAgZm9yIChqID0gMDsgaiA8IHBvaW50c1tpXS5sZW5ndGg7IGorKykge1xuICAgICAgLypcbiAgICAgIGlmIChwb2ludHNbaV1bal0gPCAwLjIpXG4gICAgICAgIG5vaXNlQXJyW2ldW2pdID0gMDtcblxuICAgICAgZWxzZSBpZiAocG9pbnRzW2ldW2pdIDwgMC40KVxuICAgICAgICBub2lzZUFycltpXVtqXSA9IDAuMjtcblxuICAgICAgZWxzZSBpZiAocG9pbnRzW2ldW2pdIDwgMC42KVxuICAgICAgICBub2lzZUFycltpXVtqXSA9IDAuNDtcblxuICAgICAgZWxzZSBpZiAocG9pbnRzW2ldW2pdIDwgMC44KVxuICAgICAgICBub2lzZUFycltpXVtqXSA9IDAuNjtcblxuICAgICAgZWxzZVxuICAgICAgICBub2lzZUFycltpXVtqXSA9IDE7Ki9cbiAgICAgIG5vaXNlQXJyW2ldW2pdID0gMSAtIHBvaW50c1tpXVtqXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKG5vaXNlQXJyKTtcbn1cbiIsInZhciBoZWlnaHRtYXAgPSByZXF1aXJlKCcuL2hlaWdodG1hcCcpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICBcbiAgLy8gIyByYW5kb21cbiAgLy8gR2VuZXJhdGVzIGEgbWFwIG9mIHdpdGggZGltZW5zaW9uc1xuICAvLyBzcGVjaWZpZWQgYXMgYXJndW1lbnRzLlxuICBmdW5jdGlvbiByYW5kb20odywgaCkgeyBcbiAgICByZXR1cm4gaGVpZ2h0bWFwKHcsIGgpO1xuICB9XG5cbiAgLy8gIyBmbGF0XG4gIC8vIEdlbmVyYXRlcyBhIG1hcCB3aXRoIGRpbWVuc2lvbnNcbiAgLy8gc3BlY2lmaWVkIGFzIGFyZ3VtZW50IGFuZCBjb25zdGFudFxuICAvLyBoZWlnaHQgc3BlY2lmaWVkIGJ5IGhlaWdodC5cbiAgZnVuY3Rpb24gZmxhdCh3LCBoLCBoZWlnaHQpIHtcbiAgICByZXR1cm4gZmlsbCh3LCBoLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBoZWlnaHQ7XG4gICAgfSk7XG4gIH1cblxuICAvLyAjIGZpbGxcbiAgLy8gRmlsbHMgYSBtYXAgb2YgZGltZW5zaW9uc1xuICAvLyBzcGVjaWZpZWQgYnkgcGFyYW1ldGVycy5cbiAgZnVuY3Rpb24gZmlsbCh3LCBoLCBmaWxsRm4pIHtcbiAgICB2YXIgeCwgeSwgbWFwID0gW107XG4gICAgZm9yKHggPSAwOyB4IDwgdzsgeCsrKSB7XG4gICAgICBtYXBbeF0gPSBbXTtcbiAgICAgIGZvcih5ID0gMDsgeSA8IGg7IHkrKykge1xuICAgICAgICBtYXBbeF1beV0gPSBmaWxsRm4oeCwgeSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXA7XG4gIH1cbiAgXG4gIHJldHVybiB7XG4gICAgcmFuZG9tOiByYW5kb20sXG4gICAgZmxhdDogZmxhdCxcbiAgICBmaWxsOiBmaWxsXG4gIH1cbn0pKCk7XG4iLCJ2YXIgdGlsZXMgPSByZXF1aXJlKCcuL3RpbGVzLmpzb24nKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBjYWNoZSwgdHlwZTtcbiBcbiAgY2FjaGUgPSB7fTtcbiBcbiAgZm9yKHR5cGUgaW4gdGlsZXMpIHtcbiAgICBjYWNoZVt0eXBlXSA9IG5ldyBJbWFnZSgpO1xuICAgIGNhY2hlW3R5cGVdLnNyYyA9ICdhc3NldHMvJyArIHRpbGVzW3R5cGVdO1xuICB9XG4gIFxuICByZXR1cm4gY2FjaGVcbn0pKCk7XG4iLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwid2F0ZXJcIjogXCJmbG9vci5wbmdcIixcbiAgXCJncmFzc1wiOiBcImdyYXNzLnBuZ1wiLFxuICBcInNhbmRcIjogXCJzYW5kLnBuZ1wiLFxuICBcInNub3dcIjogXCJzbm93LnBuZ1wiLFxuICBcIndhdGVyXCI6IFwid2F0ZXIucG5nXCIsXG4gIFwic3RvbmVcIjogXCJzdG9uZS5wbmdcIlxufVxuIl19
