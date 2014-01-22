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
