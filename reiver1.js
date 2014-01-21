(function() {

	var Point = function(x, y) {
		return {x: x, y: y, recType: 'undef'};
	}

	var width = 640;
	var height = 480;

	var ctx = document.getElementById("canvas").getContext('2d');

	var numResources = 30;
	var resourcePoints = [];

	//gerenate resource points
	for(var i=0; i < numResources; i++) {
		resourcePoints.push(Point(Math.random() * width, Math.random() * height));
		ctx.beginPath();
		ctx.arc(resourcePoints[i].x, resourcePoints[i].y, 5, 0, Math.PI*2);
		ctx.stroke();
	}

	var reachedSink = false;
	var source = Point(320, 0);//middle top
	var sink = Point(320, 480);//middle bot
	var current = source;

	console.log(current);

	resourcePoints.push(sink);
	var count = 5;
	// use resource points to generate river
	while(!reachedSink) {
		var currentMinDistToSink = 10000;
		var currentMinDist = 10000;
		var currentMinIndex = 0;

		for(var i=0; i < resourcePoints.length; i++) {
			
			var dist = Math.sqrt(Math.pow(current.x - resourcePoints[i].x, 2) + Math.pow(current.y - resourcePoints[i].y, 2));
			var distToSink = Math.sqrt(Math.pow(sink.x - resourcePoints[i].x, 2) + Math.pow(sink.y - resourcePoints[i].y, 2));

			if(dist < currentMinDist && distToSink < currentMinDistToSink && resourcePoints[i].recType == 'undef') {
				currentMinDist = dist;
				currentMinIndex = i;
			}
		}
		console.log(currentMinIndex);
		ctx.moveTo(current.x, current.y);
		ctx.lineTo(resourcePoints[currentMinIndex].x, resourcePoints[currentMinIndex].y);
		ctx.stroke();
		current = resourcePoints[currentMinIndex];
		current.recType = 'river';
		
		//check if reached sink
		if((current.x == sink.x && current.y == sink.y) /*|| count-- < 0*/) {
			reachedSink = true;
		}
	}

})();