module.exports = function(x, y) {

	var position = {x: x, y: y};
	var waypoint = {x: x, y: y};
	var hunger = 1000;
	var alive = true;
	var currentResourceIndex = -1;
	var resource = 0;

	var buildings = []; //array of buildings indexes

	var update = function(time) {
		if(hunger < 1) {
			alive = false;
		}

		moveTo(waypoint);
	};

	var moveTo = function(point) {
		var mag = Math.sqrt(Math.pow(point.x - position.x, 2), Math.pow(point.y - position.y));

		if(mag > 0) {
			position.x += (waypoint.x - position.x) / mag;
			position.y += (waypoint.y - position.y) / mag;
		}
	};

	return {
		position: position,
		waypoint: waypoint,
		currentResourceIndex: currentResourceIndex,
		hunger: hunger,
		alive: alive,
		buildings: buildings,
		resource: resource,

		update: update,
		moveTo: moveTo
	};
};