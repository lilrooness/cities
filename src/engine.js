
module.exports = function() {
  var canvas, ctx, map;
  
  function init() {
    canvas = document.querySelector('#map');
    ctx = canvas.getContext('2d');  
  }
  
  window.addEventListener('load', init);
}


