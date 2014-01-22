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
