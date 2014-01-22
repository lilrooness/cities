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


