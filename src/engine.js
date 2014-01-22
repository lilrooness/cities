var Person = require('./people');
var Resource = require('./resource');

module.exports = function(width, height, fps, numPeople, numResources) {

	var time = 0;

	var fps = fps;
	var people = [];
	var width = width;
	var height = height;
	var resources = [];
	var buildings = [];

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
				//player owns buildings with resource
				if(availableBuildings(people[i])) {

					var nearestBuildingIndex = nearestBuilding(people[i]);
					people[i].waypoint.x = buildings[nearestBuildingIndex].position.x;
					people[i].waypoint.y = buildings[nearestBuildingIndex].position.y;

				} else {

					//no player buildings owned
					if(availbaleResources() > 0) {
						var waypointIndex = nearestResource(people[i].position);
						people[i].waypoint.x = resources[waypointIndex].position.x;
						people[i].waypoint.y = resources[waypointIndex].position.y;
						people[i].currentResourceIndex = waypointIndex;

						people[i].update();

						if(resources[people[i].currentResourceIndex].ammount > 0) {
							if(distance(people[i].position, resources[people[i].currentResourceIndex].position) < 20) {
								resources[people[i].currentResourceIndex].ammount --;
								people[i].resource ++;
							}
						}

					} else {
						people[i].waypoint.x = Math.random() * width;
						people[i].waypoint.y = Math.random() * height;
					}
				}
			}
			//player can build a farm if they have enough resource
			if(people[i].resource >= 340) {
				var resource = Resource(3000, people[i].position.x, people[i].position.y);
				buildings.push(resource);
				people[i].buildings.push(buildings.length - 1);//push index of last added building
			}
		}
	};

	//returns the index of the nearest resource to the position parameter
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

	//number of buildings owned by a player that have resource
	var availableBuildings = function(person) {
		var count = 0;
		for(var i=0; i<person.buildings.length; i++) {
			if(person.buildings[i].ammount > 0) {
				count ++;
			}
		}
		return count;
	};

	var nearestBuilding = function(player) {
		var minDist = 100000;
		var minIndex = 0;

		for(var i=0; i<buildings.length; i++) {
			var dist = Math.sqrt(Math.pow(position.x - buildings[i].position.x,2) 
				+ Math.pow(position.y - buildings[i].position.y,2));

			if(dist < minDist && buildings[i].ammount > 0 && player.buildings.indexOf(i) != -1) {
				minDist = dist;
				minIndex = i;
			}
		}
		return minIndex;
	};

	//number of resources in the world which have resource
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
		buildings: buildings,

		init: init,
		update: update
	};
};