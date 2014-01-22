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


