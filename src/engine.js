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
