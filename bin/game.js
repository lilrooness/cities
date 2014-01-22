(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(attributes) {
  var spriteUrl;
  
  spriteUrl = attributes.sprite;
  attributes.sprite = new Image();
  attributes.sprite.src = 'assets/' + spriteUrl + '.png';    

 
  return function(settings) {
    var key, entity;
    entity = {};

    for(key in attributes) {
      entity[key] = attributes[key];
    }
    for(key in settings) {
      entity[key] = settings[key];
    }
    
    return entity;
  }
}



},{}],2:[function(require,module,exports){
var tileImages = require("./tiles");

module.exports = (function() {
  var canvas, ctx, map, ts, threshold, lookup,
    camera, tiles, entities, resources;

  camera = { x:0, y:0, zoom:1, w:0, h:0 };
  
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

  // # Lookup
  // A lookup array
  // for tile images
  lookup = [];

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
    camera.w = ctx.width / ts;
    camera.h = ctx.height /ts;
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
      index += 1;
    }
     
    for(x = 0; x < map.length; x++) {
      for(y = 0; y < map[x].length; y++) {
        map[x][y] = mapToTile(map[x][y]);
      }
    }
   
    // create the lookup 
    index = 0;
    for(type in threshold) {
      lookup[index] = type;
      index += 1;
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
    return lookup[map[x][y]];
  }

  // # region
  // Returns all the tiles of a given
  // type e.g. 'grass'
  function region(type) {
    var x, y, index, results;
    results = [];
    index = lookup.indexOf(type);
    for(x = 0; x < map.length; x++) {
      for(y = 0; y < map[x].length; y++) {
        if(map[x][y] === index) {
          results.push({ x:x, y:y });
        }
      }
    }
    return results;
  }

  // # render
  // Y'know. It renders stuff.
  function render() {
    var x, y, tile;

    update();
    
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    for(x = camera.x; x < camera.x + camera.w; x++) {
      for(y = camera.y; y < camera.y + camera.h; y++) {
        tile = tiles[map[x][y]];
        ctx.save(); 
        
        ctx.translate((x - camera.x) * ts * camera.zoom,
          (y - camera.y) * ts * camera.zoom);
        
        ctx.drawImage(tile, 0, 0, ts * camera.zoom,
          ts * camera.zoom);
        
        ctx.restore();
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
      if(camera.x > 0) camera.x--;
    } else if(keys.right) {
      camera.x++;
    }
    if(keys.up) {
      if(camera.y > 0) camera.y--;
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
      ctx.save();      
      ctx.translate(
        (r.x - camera.x) * ts * camera.zoom,
        (r.y - camera.y) * ts * camera.zoom);
      
      ctx.drawImage(r.sprite, 0, 0, r.w * camera.zoom, 
        r.h * camera.zoom);
      ctx.restore();
    }
  }
  
  function updateResources() {
    for(var i = 0; i < resources.length; i++) {
      var r = resources[i];
    }
  }

  function renderEntities() {
    for(var i = 0; i < entities.length; i++) {
      var e = entities[i];
      ctx.save(); 
      ctx.translate(
        (e.x - camera.x) * ts * camera.zoom,
        (e.y - camera.y) * ts * camera.zoom);
      
      ctx.drawImage(e.sprite, 0, 0, e.w * camera.zoom, 
        e.h * camera.zoom);
      ctx.restore();
    }
  }

  function updateEntities() {
    for(var i = 0; i < entities.length; i++) {
      var e = entities[i];
      e.x += e.i;
      e.y += e.j;
    }
  }
  
  return {
    init: init,
    fullscreen: fullscreen,
    loadMap: loadMap,
    spawnEntity: spawnEntity,
    spawnResource: spawnResource,
    tileAt: tileAt,
    region: region
  }
})();

},{"./tiles":8}],3:[function(require,module,exports){
var engine = require('./engine')
  , map = require('./map')
  , npcs = require('./npcs') 
  , resources = require('./resources');
  
function placeResources() {
  console.table(engine.region('grass'))   
}

function placeNpcs() {
  for(var i = 0; i < 10; i++) {
    engine.spawnEntity(new npcs.Dwarf({
      x: Math.random() * 100,
      y: Math.random() * 100,
      i: 0,
      j: 0
    }));
  }
}

engine.loadMap(map.random(150, 150));

placeNpcs();
placeResources();

window.addEventListener('load', engine.init);
window.addEventListener('resize', engine.fullscreen);

},{"./engine":2,"./map":5,"./npcs":6,"./resources":7}],4:[function(require,module,exports){
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
var NPC = require('./Entity');

module.exports = {
  Crab: new NPC({
    sprite: 'crab',
    h: 24,
    w: 24
  }),
  Dwarf: new NPC({
    sprite: 'dwarf',
    h: 24,
    w: 24
  }), 
  Farmer: new NPC({
    sprite: 'miner',
    h: 24,
    w: 24
  })
}

},{"./Entity":1}],7:[function(require,module,exports){
var Resource = require('./Entity');

module.exports = {
  Tree: new Resource({
    sprite: 'tree',
    h: 20,
    w: 20
  }),
  Rock: new Resource({
    sprite: 'rock',
    h: 20,
    w: 20
  }),
  RockAlt: new Resource({
    sprite: 'rockalt',
    h: 20,
    w: 20
  }),
  Bush: new Resource({
    sprite: 'bush',
    h: 20,
    w: 20
  }),
  Cactus: new Resource({
    sprite: 'cactus',
    h: 20,
    w: 20
  }),
}

},{"./Entity":1}],8:[function(require,module,exports){
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

},{"./tiles.json":9}],9:[function(require,module,exports){
module.exports={
  "water": "floor.png",
  "grass": "grass.png",
  "sand": "sand.png",
  "snow": "snow.png",
  "water": "water.png",
  "stone": "stone.png"
}

},{}]},{},[3])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9kYW4vZGV2L2NpdGllcy9ub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvZGFuL2Rldi9jaXRpZXMvc3JjL0VudGl0eS5qcyIsIi9ob21lL2Rhbi9kZXYvY2l0aWVzL3NyYy9lbmdpbmUuanMiLCIvaG9tZS9kYW4vZGV2L2NpdGllcy9zcmMvZ2FtZS5qcyIsIi9ob21lL2Rhbi9kZXYvY2l0aWVzL3NyYy9oZWlnaHRtYXAuanMiLCIvaG9tZS9kYW4vZGV2L2NpdGllcy9zcmMvbWFwLmpzIiwiL2hvbWUvZGFuL2Rldi9jaXRpZXMvc3JjL25wY3MuanMiLCIvaG9tZS9kYW4vZGV2L2NpdGllcy9zcmMvcmVzb3VyY2VzLmpzIiwiL2hvbWUvZGFuL2Rldi9jaXRpZXMvc3JjL3RpbGVzLmpzIiwiL2hvbWUvZGFuL2Rldi9jaXRpZXMvc3JjL3RpbGVzLmpzb24iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXR0cmlidXRlcykge1xuICB2YXIgc3ByaXRlVXJsO1xuICBcbiAgc3ByaXRlVXJsID0gYXR0cmlidXRlcy5zcHJpdGU7XG4gIGF0dHJpYnV0ZXMuc3ByaXRlID0gbmV3IEltYWdlKCk7XG4gIGF0dHJpYnV0ZXMuc3ByaXRlLnNyYyA9ICdhc3NldHMvJyArIHNwcml0ZVVybCArICcucG5nJzsgICAgXG5cbiBcbiAgcmV0dXJuIGZ1bmN0aW9uKHNldHRpbmdzKSB7XG4gICAgdmFyIGtleSwgZW50aXR5O1xuICAgIGVudGl0eSA9IHt9O1xuXG4gICAgZm9yKGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICBlbnRpdHlba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICB9XG4gICAgZm9yKGtleSBpbiBzZXR0aW5ncykge1xuICAgICAgZW50aXR5W2tleV0gPSBzZXR0aW5nc1trZXldO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gZW50aXR5O1xuICB9XG59XG5cblxuIiwidmFyIHRpbGVJbWFnZXMgPSByZXF1aXJlKFwiLi90aWxlc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBjYW52YXMsIGN0eCwgbWFwLCB0cywgdGhyZXNob2xkLCBsb29rdXAsXG4gICAgY2FtZXJhLCB0aWxlcywgZW50aXRpZXMsIHJlc291cmNlcztcblxuICBjYW1lcmEgPSB7IHg6MCwgeTowLCB6b29tOjEsIHc6MCwgaDowIH07XG4gIFxuICAvLyBUaWxlIFNpemUgIFxuICB0cyA9IDI0O1xuICB0aWxlcyA9IFtdO1xuICBcbiAgZW50aXRpZXMgPSBbXTtcbiAgcmVzb3VyY2VzID0gW107XG4gIFxuICAvLyAjIFRocmVzaG9sZHNcbiAgLy8gVGhpcyBkZWZpbmVzIHRoZSB0aHJlc2hvbGRzIGZvciBtYXBcbiAgLy8gbm9ybWFsaXphdGlvbi5cbiAgdGhyZXNob2xkID0ge1xuICAgIHdhdGVyOiAwLFxuICAgIHNhbmQ6IDAuMyxcbiAgICBncmFzczogMC40LFxuICAgIHN0b25lOiAwLjgsXG4gICAgc25vdzogMC45OFxuICB9O1xuXG4gIC8vICMgTG9va3VwXG4gIC8vIEEgbG9va3VwIGFycmF5XG4gIC8vIGZvciB0aWxlIGltYWdlc1xuICBsb29rdXAgPSBbXTtcblxuICAvLyAjIGluaXRcbiAgLy8gSW5pdGlhbGl6ZXMgdGhlIGVuZ2luZSBhbmQgYmVnaW5zIHRoZVxuICAvLyByZW5kZXJpbmcgcHJvY2Vzcy4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkXG4gIC8vIGFmdGVyIHRoZSB3aW5kb3cgaGFzIGxvYWRlZC5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFwJyk7XG4gICAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgZnVsbHNjcmVlbigpO1xuICAgIHJlbmRlcigpO1xuICAgIHNldEludGVydmFsKHJlbmRlciwgNTApO1xuICB9XG5cbiAgLy8gIyBmdWxsc2NyZWVuXG4gIC8vIFNldHMgdGhlIHNpemUgb2YgdGhlIGNhbnZhcyB0byBiZSB0aGVcbiAgLy8gc2l6ZSBvZiB0aGUgZnVsbCB3aW5kb3cuIFNob3VsZCBiZSBjYWxsZWRcbiAgLy8gd2hlbmV2ZXIgdGhlIHdpbmRvdyBmaXJlcyBhIHJlc2l6ZSBldmVudC4gXG4gIGZ1bmN0aW9uIGZ1bGxzY3JlZW4oKSB7XG4gICAgY3R4LndpZHRoID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDtcbiAgICBjdHguaGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQ7XG4gICAgY2FudmFzLndpZHRoID0gY3R4LndpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBjdHguaGVpZ2h0O1xuICAgIGNhbWVyYS53ID0gY3R4LndpZHRoIC8gdHM7XG4gICAgY2FtZXJhLmggPSBjdHguaGVpZ2h0IC90cztcbiAgfVxuXG4gIC8vICMgbG9hZE1hcFxuICAvLyBUaGlzIGZ1bmN0aW9uIHRha2VzIGFuIGFycmF5IG9mIHRpbGVzXG4gIC8vIHdpdGggdmFsdWVzIGJldHdlZW4gMCBhbmQgMSBhbmQgbG9hZHNcbiAgLy8gaXQgaW50byB0aGUgZW5naW5lLCByZWFkeSB0byBiZSByZW5kZXJlZC5cbiAgZnVuY3Rpb24gbG9hZE1hcCh0aWxlQXJyYXkpIHtcbiAgICBtYXAgPSBub3JtYWxpemUodGlsZUFycmF5KTtcbiAgfSAgXG5cbiAgLy8gIyBub3JtYWxpemVcbiAgLy8gVHVybnMgYSBtYXAgb2YgdmFsdWVzIGJldHdlZW4gMCBhbmQgMVxuICAvLyBpbnRvIGFycmF5IGluZGV4IHBvc2l0aW9ucywgYmFzZWQgb25cbiAgLy8gb3V0cHV0IGZyb20gbWFwVG9UaWxlIGFuZCB0aGUgdGhyZXNob2xkc1xuICAvLyBkZWZpbmVkIGF0IHRoZSB0b3Agb2YgdGhlIGVuZ2luZS5cbiAgZnVuY3Rpb24gbm9ybWFsaXplKG1hcCkge1xuICAgIHZhciB4LCB5LCB0eXBlLCBpbmRleDtcbiAgICBcbiAgICBpbmRleCA9IDA7XG4gICAgZm9yKHR5cGUgaW4gdGhyZXNob2xkKSB7XG4gICAgICB0aWxlc1tpbmRleF0gPSB0aWxlSW1hZ2VzW3R5cGVdO1xuICAgICAgaW5kZXggKz0gMTtcbiAgICB9XG4gICAgIFxuICAgIGZvcih4ID0gMDsgeCA8IG1hcC5sZW5ndGg7IHgrKykge1xuICAgICAgZm9yKHkgPSAwOyB5IDwgbWFwW3hdLmxlbmd0aDsgeSsrKSB7XG4gICAgICAgIG1hcFt4XVt5XSA9IG1hcFRvVGlsZShtYXBbeF1beV0pO1xuICAgICAgfVxuICAgIH1cbiAgIFxuICAgIC8vIGNyZWF0ZSB0aGUgbG9va3VwIFxuICAgIGluZGV4ID0gMDtcbiAgICBmb3IodHlwZSBpbiB0aHJlc2hvbGQpIHtcbiAgICAgIGxvb2t1cFtpbmRleF0gPSB0eXBlO1xuICAgICAgaW5kZXggKz0gMTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWFwO1xuICB9XG5cbiAgLy8gIyBtYXBUb1RpbGVcbiAgLy8gVHVybnMgYSB2YWx1ZSBpbiB0aGUgcmFuZ2Ugb2YgMCB0byAxXG4gIC8vIGludG8gYW4gYXJyYXkgaW5kZXggZm9yIGEgdGlsZSB0eXBlIFxuICAvLyBiYXNlZCBvbiB0aHJlc2hvbGQgbWFwLlxuICBmdW5jdGlvbiBtYXBUb1RpbGUoaGVpZ2h0KSB7XG4gICAgdmFyIHR5cGUsIHRpbGUsIHNlbGVjdCwgaW5kZXg7XG4gICAgaW5kZXggPSAwO1xuICAgIHNlbGVjdCA9IDA7XG4gICAgZm9yKHR5cGUgaW4gdGhyZXNob2xkKSB7XG4gICAgICBpZihoZWlnaHQgPj0gdGhyZXNob2xkW3R5cGVdKSB7XG4gICAgICAgIHNlbGVjdCA9IGluZGV4O1xuICAgICAgfVxuICAgICAgaW5kZXgrKztcbiAgICB9XG4gICAgcmV0dXJuIHNlbGVjdDtcbiAgfVxuXG4gIC8vICMgdGlsZUF0XG4gIC8vIFJldHVybnMgdGhlIG5hbWUgb2YgdGhlIHR5cGVcbiAgLy8gb2YgdGlsZSBhdCB4LCB5XG4gIGZ1bmN0aW9uIHRpbGVBdCh4LCB5KSB7XG4gICAgcmV0dXJuIGxvb2t1cFttYXBbeF1beV1dO1xuICB9XG5cbiAgLy8gIyByZWdpb25cbiAgLy8gUmV0dXJucyBhbGwgdGhlIHRpbGVzIG9mIGEgZ2l2ZW5cbiAgLy8gdHlwZSBlLmcuICdncmFzcydcbiAgZnVuY3Rpb24gcmVnaW9uKHR5cGUpIHtcbiAgICB2YXIgeCwgeSwgaW5kZXgsIHJlc3VsdHM7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGluZGV4ID0gbG9va3VwLmluZGV4T2YodHlwZSk7XG4gICAgZm9yKHggPSAwOyB4IDwgbWFwLmxlbmd0aDsgeCsrKSB7XG4gICAgICBmb3IoeSA9IDA7IHkgPCBtYXBbeF0ubGVuZ3RoOyB5KyspIHtcbiAgICAgICAgaWYobWFwW3hdW3ldID09PSBpbmRleCkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCh7IHg6eCwgeTp5IH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgLy8gIyByZW5kZXJcbiAgLy8gWSdrbm93LiBJdCByZW5kZXJzIHN0dWZmLlxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIHgsIHksIHRpbGU7XG5cbiAgICB1cGRhdGUoKTtcbiAgICBcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGN0eC53aWR0aCwgY3R4LmhlaWdodCk7XG4gICAgZm9yKHggPSBjYW1lcmEueDsgeCA8IGNhbWVyYS54ICsgY2FtZXJhLnc7IHgrKykge1xuICAgICAgZm9yKHkgPSBjYW1lcmEueTsgeSA8IGNhbWVyYS55ICsgY2FtZXJhLmg7IHkrKykge1xuICAgICAgICB0aWxlID0gdGlsZXNbbWFwW3hdW3ldXTtcbiAgICAgICAgY3R4LnNhdmUoKTsgXG4gICAgICAgIFxuICAgICAgICBjdHgudHJhbnNsYXRlKCh4IC0gY2FtZXJhLngpICogdHMgKiBjYW1lcmEuem9vbSxcbiAgICAgICAgICAoeSAtIGNhbWVyYS55KSAqIHRzICogY2FtZXJhLnpvb20pO1xuICAgICAgICBcbiAgICAgICAgY3R4LmRyYXdJbWFnZSh0aWxlLCAwLCAwLCB0cyAqIGNhbWVyYS56b29tLFxuICAgICAgICAgIHRzICogY2FtZXJhLnpvb20pO1xuICAgICAgICBcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmVuZGVyUmVzb3VyY2VzKCk7XG4gICAgcmVuZGVyRW50aXRpZXMoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNwYXduRW50aXR5KGVudGl0eSkge1xuICAgIGVudGl0aWVzLnB1c2goZW50aXR5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNwYXduUmVzb3VyY2UocmVzb3VyY2UpIHtcbiAgICByZXNvdXJjZXMucHVzaChyZXNvdXJjZSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgaWYoa2V5cy5sZWZ0KSB7XG4gICAgICBpZihjYW1lcmEueCA+IDApIGNhbWVyYS54LS07XG4gICAgfSBlbHNlIGlmKGtleXMucmlnaHQpIHtcbiAgICAgIGNhbWVyYS54Kys7XG4gICAgfVxuICAgIGlmKGtleXMudXApIHtcbiAgICAgIGlmKGNhbWVyYS55ID4gMCkgY2FtZXJhLnktLTtcbiAgICB9IGVsc2UgaWYoa2V5cy5kb3duKSB7XG4gICAgICBjYW1lcmEueSsrO1xuICAgIH1cbiAgICBpZihrZXlzLnopIHtcbiAgICAgIGNhbWVyYS56b29tIC09IDAuMTtcbiAgICB9IGVsc2UgaWYoa2V5cy54KSB7XG4gICAgICBjYW1lcmEuem9vbSArPSAwLjE7XG4gICAgfVxuICAgIHVwZGF0ZVJlc291cmNlcygpO1xuICAgIHVwZGF0ZUVudGl0aWVzKCk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJSZXNvdXJjZXMoKSB7XG5cbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgcmVzb3VyY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgciA9IHJlc291cmNlc1tpXTtcbiAgICAgIGN0eC5zYXZlKCk7ICAgICAgXG4gICAgICBjdHgudHJhbnNsYXRlKFxuICAgICAgICAoci54IC0gY2FtZXJhLngpICogdHMgKiBjYW1lcmEuem9vbSxcbiAgICAgICAgKHIueSAtIGNhbWVyYS55KSAqIHRzICogY2FtZXJhLnpvb20pO1xuICAgICAgXG4gICAgICBjdHguZHJhd0ltYWdlKHIuc3ByaXRlLCAwLCAwLCByLncgKiBjYW1lcmEuem9vbSwgXG4gICAgICAgIHIuaCAqIGNhbWVyYS56b29tKTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9XG4gIFxuICBmdW5jdGlvbiB1cGRhdGVSZXNvdXJjZXMoKSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHJlc291cmNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHIgPSByZXNvdXJjZXNbaV07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyRW50aXRpZXMoKSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZSA9IGVudGl0aWVzW2ldO1xuICAgICAgY3R4LnNhdmUoKTsgXG4gICAgICBjdHgudHJhbnNsYXRlKFxuICAgICAgICAoZS54IC0gY2FtZXJhLngpICogdHMgKiBjYW1lcmEuem9vbSxcbiAgICAgICAgKGUueSAtIGNhbWVyYS55KSAqIHRzICogY2FtZXJhLnpvb20pO1xuICAgICAgXG4gICAgICBjdHguZHJhd0ltYWdlKGUuc3ByaXRlLCAwLCAwLCBlLncgKiBjYW1lcmEuem9vbSwgXG4gICAgICAgIGUuaCAqIGNhbWVyYS56b29tKTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlRW50aXRpZXMoKSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZSA9IGVudGl0aWVzW2ldO1xuICAgICAgZS54ICs9IGUuaTtcbiAgICAgIGUueSArPSBlLmo7XG4gICAgfVxuICB9XG4gIFxuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXQsXG4gICAgZnVsbHNjcmVlbjogZnVsbHNjcmVlbixcbiAgICBsb2FkTWFwOiBsb2FkTWFwLFxuICAgIHNwYXduRW50aXR5OiBzcGF3bkVudGl0eSxcbiAgICBzcGF3blJlc291cmNlOiBzcGF3blJlc291cmNlLFxuICAgIHRpbGVBdDogdGlsZUF0LFxuICAgIHJlZ2lvbjogcmVnaW9uXG4gIH1cbn0pKCk7XG4iLCJ2YXIgZW5naW5lID0gcmVxdWlyZSgnLi9lbmdpbmUnKVxuICAsIG1hcCA9IHJlcXVpcmUoJy4vbWFwJylcbiAgLCBucGNzID0gcmVxdWlyZSgnLi9ucGNzJykgXG4gICwgcmVzb3VyY2VzID0gcmVxdWlyZSgnLi9yZXNvdXJjZXMnKTtcbiAgXG5mdW5jdGlvbiBwbGFjZVJlc291cmNlcygpIHtcbiAgY29uc29sZS50YWJsZShlbmdpbmUucmVnaW9uKCdncmFzcycpKSAgIFxufVxuXG5mdW5jdGlvbiBwbGFjZU5wY3MoKSB7XG4gIGZvcih2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgZW5naW5lLnNwYXduRW50aXR5KG5ldyBucGNzLkR3YXJmKHtcbiAgICAgIHg6IE1hdGgucmFuZG9tKCkgKiAxMDAsXG4gICAgICB5OiBNYXRoLnJhbmRvbSgpICogMTAwLFxuICAgICAgaTogMCxcbiAgICAgIGo6IDBcbiAgICB9KSk7XG4gIH1cbn1cblxuZW5naW5lLmxvYWRNYXAobWFwLnJhbmRvbSgxNTAsIDE1MCkpO1xuXG5wbGFjZU5wY3MoKTtcbnBsYWNlUmVzb3VyY2VzKCk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZW5naW5lLmluaXQpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGVuZ2luZS5mdWxsc2NyZWVuKTtcbiIsIi8vIEkgRElEIE5PVCBXUklURSBUSElTIC0gRGFuIFByaW5jZSAvL1xuXG52YXIgcCA9IDU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odywgaCkge1xuICB2YXIgbm9pc2VBcnIgPSBuZXcgQXJyYXkoKTtcbiAgXG4gIGZvciAoaSA9IDA7IGkgPD0gcDsgaSsrKSB7XG4gICAgbm9pc2VBcnJbaV0gPSBuZXcgQXJyYXkoKTtcblxuICAgIGZvciAoaiA9IDA7IGogPD0gcDsgaisrKSB7XG4gICAgICB2YXIgaGVpZ2h0ID0gTWF0aC5yYW5kb20oKTtcblxuICAgICAgaWYgKGkgPT0gMCB8fCBqID09IDAgfHwgaSA9PSBwIHx8IGogPT0gcClcbiAgICAgICAgaGVpZ2h0ID0gMTtcblxuICAgICAgbm9pc2VBcnJbaV1bal0gPSBoZWlnaHQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChmbGF0dGVuKGludGVycG9sYXRlKG5vaXNlQXJyLCB3LCBoKSkpO1xufVxuXG5mdW5jdGlvbiBpbnRlcnBvbGF0ZShwb2ludHMsIHcsIGgpIHtcbiAgdmFyIG5vaXNlQXJyID0gbmV3IEFycmF5KClcbiAgdmFyIHggPSAwO1xuICB2YXIgeSA9IDA7XG4gIHZhciBuID0gdy9wO1xuICB2YXIgbSA9IGgvcDtcblxuICBmb3IgKGkgPSAwOyBpIDwgdzsgaSsrKSB7XG4gICAgaWYgKGkgIT0gMCAmJiBpICUgbiA9PSAwKVxuICAgICAgeCsrO1xuXG4gICAgbm9pc2VBcnJbaV0gPSBuZXcgQXJyYXkoKTtcbiAgICBmb3IgKGogPSAwOyBqIDwgaDsgaisrKSB7XG5cbiAgICAgIGlmIChqICE9IDAgJiYgaiAlIG0gPT0gMClcbiAgICAgICAgeSsrO1xuXG4gICAgICB2YXIgbXVfeCA9IChpICUgbikgLyBuO1xuICAgICAgdmFyIG11XzIgPSAoMSAtIE1hdGguY29zKG11X3ggKiBNYXRoLlBJKSkgLyAyO1xuXG4gICAgICB2YXIgaW50X3gxID0gcG9pbnRzW3hdW3ldICogKDEgLSBtdV8yKSArIHBvaW50c1t4ICsgMV1beV0gKiBtdV8yO1xuICAgICAgdmFyIGludF94MiA9IHBvaW50c1t4XVt5ICsgMV0gKiAoMSAtIG11XzIpICsgcG9pbnRzW3ggKyAxXVt5ICsgMV0gKiBtdV8yO1xuXG4gICAgICB2YXIgbXVfeSA9IChqICUgbSkgLyBtO1xuICAgICAgdmFyIG11XzIgPSAoMSAtIE1hdGguY29zKG11X3kgKiBNYXRoLlBJKSkgLyAyO1xuICAgICAgdmFyIGludF95ID0gaW50X3gxICogKDEgLSBtdV8yKSArIGludF94MiAqIG11XzI7XG5cbiAgICAgIG5vaXNlQXJyW2ldW2pdID0gaW50X3k7XG4gICAgfVxuICAgIHkgPSAwO1xuICB9XG4gIHJldHVybiAobm9pc2VBcnIpO1xufVxuXG5mdW5jdGlvbiBmbGF0dGVuKHBvaW50cykge1xuICB2YXIgbm9pc2VBcnIgPSBuZXcgQXJyYXkoKVxuICBmb3IgKGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgbm9pc2VBcnJbaV0gPSBuZXcgQXJyYXkoKVxuICAgIGZvciAoaiA9IDA7IGogPCBwb2ludHNbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIC8qXG4gICAgICBpZiAocG9pbnRzW2ldW2pdIDwgMC4yKVxuICAgICAgICBub2lzZUFycltpXVtqXSA9IDA7XG5cbiAgICAgIGVsc2UgaWYgKHBvaW50c1tpXVtqXSA8IDAuNClcbiAgICAgICAgbm9pc2VBcnJbaV1bal0gPSAwLjI7XG5cbiAgICAgIGVsc2UgaWYgKHBvaW50c1tpXVtqXSA8IDAuNilcbiAgICAgICAgbm9pc2VBcnJbaV1bal0gPSAwLjQ7XG5cbiAgICAgIGVsc2UgaWYgKHBvaW50c1tpXVtqXSA8IDAuOClcbiAgICAgICAgbm9pc2VBcnJbaV1bal0gPSAwLjY7XG5cbiAgICAgIGVsc2VcbiAgICAgICAgbm9pc2VBcnJbaV1bal0gPSAxOyovXG4gICAgICBub2lzZUFycltpXVtqXSA9IDEgLSBwb2ludHNbaV1bal07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChub2lzZUFycik7XG59XG4iLCJ2YXIgaGVpZ2h0bWFwID0gcmVxdWlyZSgnLi9oZWlnaHRtYXAnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgXG4gIC8vICMgcmFuZG9tXG4gIC8vIEdlbmVyYXRlcyBhIG1hcCBvZiB3aXRoIGRpbWVuc2lvbnNcbiAgLy8gc3BlY2lmaWVkIGFzIGFyZ3VtZW50cy5cbiAgZnVuY3Rpb24gcmFuZG9tKHcsIGgpIHsgXG4gICAgcmV0dXJuIGhlaWdodG1hcCh3LCBoKTtcbiAgfVxuXG4gIC8vICMgZmxhdFxuICAvLyBHZW5lcmF0ZXMgYSBtYXAgd2l0aCBkaW1lbnNpb25zXG4gIC8vIHNwZWNpZmllZCBhcyBhcmd1bWVudCBhbmQgY29uc3RhbnRcbiAgLy8gaGVpZ2h0IHNwZWNpZmllZCBieSBoZWlnaHQuXG4gIGZ1bmN0aW9uIGZsYXQodywgaCwgaGVpZ2h0KSB7XG4gICAgcmV0dXJuIGZpbGwodywgaCwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaGVpZ2h0O1xuICAgIH0pO1xuICB9XG5cbiAgLy8gIyBmaWxsXG4gIC8vIEZpbGxzIGEgbWFwIG9mIGRpbWVuc2lvbnNcbiAgLy8gc3BlY2lmaWVkIGJ5IHBhcmFtZXRlcnMuXG4gIGZ1bmN0aW9uIGZpbGwodywgaCwgZmlsbEZuKSB7XG4gICAgdmFyIHgsIHksIG1hcCA9IFtdO1xuICAgIGZvcih4ID0gMDsgeCA8IHc7IHgrKykge1xuICAgICAgbWFwW3hdID0gW107XG4gICAgICBmb3IoeSA9IDA7IHkgPCBoOyB5KyspIHtcbiAgICAgICAgbWFwW3hdW3ldID0gZmlsbEZuKHgsIHkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWFwO1xuICB9XG4gIFxuICByZXR1cm4ge1xuICAgIHJhbmRvbTogcmFuZG9tLFxuICAgIGZsYXQ6IGZsYXQsXG4gICAgZmlsbDogZmlsbFxuICB9XG59KSgpO1xuIiwidmFyIE5QQyA9IHJlcXVpcmUoJy4vRW50aXR5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDcmFiOiBuZXcgTlBDKHtcbiAgICBzcHJpdGU6ICdjcmFiJyxcbiAgICBoOiAyNCxcbiAgICB3OiAyNFxuICB9KSxcbiAgRHdhcmY6IG5ldyBOUEMoe1xuICAgIHNwcml0ZTogJ2R3YXJmJyxcbiAgICBoOiAyNCxcbiAgICB3OiAyNFxuICB9KSwgXG4gIEZhcm1lcjogbmV3IE5QQyh7XG4gICAgc3ByaXRlOiAnbWluZXInLFxuICAgIGg6IDI0LFxuICAgIHc6IDI0XG4gIH0pXG59XG4iLCJ2YXIgUmVzb3VyY2UgPSByZXF1aXJlKCcuL0VudGl0eScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgVHJlZTogbmV3IFJlc291cmNlKHtcbiAgICBzcHJpdGU6ICd0cmVlJyxcbiAgICBoOiAyMCxcbiAgICB3OiAyMFxuICB9KSxcbiAgUm9jazogbmV3IFJlc291cmNlKHtcbiAgICBzcHJpdGU6ICdyb2NrJyxcbiAgICBoOiAyMCxcbiAgICB3OiAyMFxuICB9KSxcbiAgUm9ja0FsdDogbmV3IFJlc291cmNlKHtcbiAgICBzcHJpdGU6ICdyb2NrYWx0JyxcbiAgICBoOiAyMCxcbiAgICB3OiAyMFxuICB9KSxcbiAgQnVzaDogbmV3IFJlc291cmNlKHtcbiAgICBzcHJpdGU6ICdidXNoJyxcbiAgICBoOiAyMCxcbiAgICB3OiAyMFxuICB9KSxcbiAgQ2FjdHVzOiBuZXcgUmVzb3VyY2Uoe1xuICAgIHNwcml0ZTogJ2NhY3R1cycsXG4gICAgaDogMjAsXG4gICAgdzogMjBcbiAgfSksXG59XG4iLCJ2YXIgdGlsZXMgPSByZXF1aXJlKCcuL3RpbGVzLmpzb24nKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBjYWNoZSwgdHlwZTtcbiBcbiAgY2FjaGUgPSB7fTtcbiBcbiAgZm9yKHR5cGUgaW4gdGlsZXMpIHtcbiAgICBjYWNoZVt0eXBlXSA9IG5ldyBJbWFnZSgpO1xuICAgIGNhY2hlW3R5cGVdLnNyYyA9ICdhc3NldHMvJyArIHRpbGVzW3R5cGVdO1xuICB9XG4gIFxuICByZXR1cm4gY2FjaGVcbn0pKCk7XG4iLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwid2F0ZXJcIjogXCJmbG9vci5wbmdcIixcbiAgXCJncmFzc1wiOiBcImdyYXNzLnBuZ1wiLFxuICBcInNhbmRcIjogXCJzYW5kLnBuZ1wiLFxuICBcInNub3dcIjogXCJzbm93LnBuZ1wiLFxuICBcIndhdGVyXCI6IFwid2F0ZXIucG5nXCIsXG4gIFwic3RvbmVcIjogXCJzdG9uZS5wbmdcIlxufVxuIl19
