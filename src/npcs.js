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
