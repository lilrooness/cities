var Person = require('./people');
var Resource = require('./resource');

module.exports = function(width, height, fps, numPeople, numResources) {

	var time = 0;

	var fps = fps;
	var people = [];
	var width = width;
	var height = height;
	var resources = [];

	var init = function() {
		for(var i=0; i<numPeople; i++) {
			people.push(Person(Math.random() * width, Math.random() * height));
		}

		for(var i=0; i<numResources; i++) {
			resources.push(Resource(100, Math.random() * width, Math.random() * height));
		}
	};

	var update = function() {
		
		time ++;

		for(var i=0; i<people.length; i++) {

			if(people[i].alive) {
				console.log(availbaleResources());
				if(availbaleResources() > 0) {
					var waypointIndex = nearestResource(people[i].position);
					people[i].waypoint.x = resources[waypointIndex].position.x;
					people[i].waypoint.y = resources[waypointIndex].position.y;
					people[i].currentResourceIndex = waypointIndex;

					people[i].update();

					if(resources[people[i].currentResourceIndex].ammount > 0) {
						if(distance(people[i].position, resources[people[i].currentResourceIndex].position) < 20) {
						resources[people[i].currentResourceIndex].ammount --;
						}
					}
				} else {
					people[i].waypoint.x = Math.random() * width;
					people[i].waypoint.y = Math.random() * height;
				}
			}
		}
	};

	var nearestResource = function(position) {
		var minDist = 100000;
		var minIndex = 0;
		for(var i=0; i<resources.length; i++) {
			var dist = Math.sqrt(Math.pow(position.x - resources[i].position.x,2) 
				+ Math.pow(position.y - resources[i].position.y,2));

			if(dist < minDist && resources[i].ammount > 0) {
				minDist = dist;
				minIndex = i;
			}
		}
		return minIndex;
	};

	var distance = function(pos1, pos2) {
		return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
	};

	var availbaleResources = function() {
		var count = 0;
		for(var i=0; i<resources.length; i++) {
			if(resources[i].ammount > 0) {
				count ++;
			}
		}
		return count;
	};

	return {
		time: 0,

		fps: fps,
		people: people,
		width: width,
		height: height,
		resources: resources,

		init: init,
		update: update
	};
};