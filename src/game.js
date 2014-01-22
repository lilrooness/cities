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
