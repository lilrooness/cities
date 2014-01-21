(function() {

	var closestResouce = function(x, y) {
		var minDist = 1000;
		var minIndex = 0;
		for(var i=0; i<resourcePoints.length; i++) {
			dist = Math.pow(x - resourcePoints[i].x,  2) + Math.pow(y - resourcePoints[i].y, 2);

			if(dist < minDist) {
				minDist = dist;
				minIndex = i;
			}
		}
		return minIndex;
	};

	var Point = function(x, y) {
		return {x: x, y: y, recType: 'undef'};
	};

	var Person = function(x, y) {
		return {
			x: x,
			y: y,
			age: 0,

			waypoint: {x: x, y: y},

			update: function(time) {
				var resouceIndex = closestResouce(x, y);
			},

			setWayPoint: function(x, y) {
				waypoint = Point(this.x, this.y);
			}
		};
	};

	var width = 640;
	var height = 480;

	var ctx = document.getElementById("canvas").getContext('2d');

	var numResources = 30;
	var resourcePoints = [];

	for(var i=0; i < numResources; i++) {
		resourcePoints.push(Point(Math.random() * width, Math.random() * height));
		ctx.beginPath();
		ctx.arc(resourcePoints[i].x, resourcePoints[i].y, 5, 0, Math.PI*2);
		ctx.stroke();
	}
})();