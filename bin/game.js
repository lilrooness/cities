(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./people":3,"./resource":4}],2:[function(require,module,exports){
var Engine = require('./engine');

var game = Engine(640, 480, 60, 10, 30);
game.init();

var ctx = $('#canvas')[0].getContext('2d');

var render = function() {

	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, game.width, game.height);

	ctx.strokeStyle = "black";
	for(var i=0; i<game.resources.length; i++) {
		if(game.resources[i].ammount > 0) {
			ctx.beginPath();
			ctx.arc(game.resources[i].position.x, game.resources[i].position.y, 5, 0, 2*Math.PI);
			ctx.stroke();
		}
	}

	ctx.strokeStyle = "red";
	for(var i=0; i<game.people.length; i++) {
		if(game.people[i].alive) {
			ctx.beginPath();
			ctx.arc(game.people[i].position.x, game.people[i].position.y, 2, 0, 2*Math.PI);
			ctx.stroke();
		}
	}

	ctx.fillStyle = "green";
	ctx.strokeStyle = "black";
	for(var i=0; i<game.buildings.length; i++) {
		if(game.buildings[i].resource < 1) {
			ctx.fillStyle = "gray";
			ctx.strokeStyle = "gray";
		}
		ctx.fillRect(game.buildings[i].position.x - 5, 
			game.buildings[i].position.y - 5, 
			game.buildings[i].position.x + 5, 
			game.buildings[i].position.y + 5
		);
	}
};

setInterval(function() {
	game.update();
	render();

}, 1000 / game.fps);
},{"./engine":1}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
module.exports = function(ammount, x, y) {
	
	var ammount = ammount;
	var type = "undef";

	var position = {
		x: x,
		y: y
	};

	return {
		position: position,
		ammount: ammount,
		type: type
	};
};
},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEpvZVxcRG9jdW1lbnRzXFxHaXRIdWJcXGNpdGllc1xcbm9kZV9tb2R1bGVzXFxncnVudC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkM6L1VzZXJzL0pvZS9Eb2N1bWVudHMvR2l0SHViL2NpdGllcy9zcmMvZW5naW5lLmpzIiwiQzovVXNlcnMvSm9lL0RvY3VtZW50cy9HaXRIdWIvY2l0aWVzL3NyYy9nYW1lLmpzIiwiQzovVXNlcnMvSm9lL0RvY3VtZW50cy9HaXRIdWIvY2l0aWVzL3NyYy9wZW9wbGUuanMiLCJDOi9Vc2Vycy9Kb2UvRG9jdW1lbnRzL0dpdEh1Yi9jaXRpZXMvc3JjL3Jlc291cmNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBQZXJzb24gPSByZXF1aXJlKCcuL3Blb3BsZScpO1xyXG52YXIgUmVzb3VyY2UgPSByZXF1aXJlKCcuL3Jlc291cmNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQsIGZwcywgbnVtUGVvcGxlLCBudW1SZXNvdXJjZXMpIHtcclxuXHJcblx0dmFyIHRpbWUgPSAwO1xyXG5cclxuXHR2YXIgZnBzID0gZnBzO1xyXG5cdHZhciBwZW9wbGUgPSBbXTtcclxuXHR2YXIgd2lkdGggPSB3aWR0aDtcclxuXHR2YXIgaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cdHZhciByZXNvdXJjZXMgPSBbXTtcclxuXHR2YXIgYnVpbGRpbmdzID0gW107XHJcblxyXG5cdHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRmb3IodmFyIGk9MDsgaTxudW1QZW9wbGU7IGkrKykge1xyXG5cdFx0XHRwZW9wbGUucHVzaChQZXJzb24oTWF0aC5yYW5kb20oKSAqIHdpZHRoLCBNYXRoLnJhbmRvbSgpICogaGVpZ2h0KSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yKHZhciBpPTA7IGk8bnVtUmVzb3VyY2VzOyBpKyspIHtcclxuXHRcdFx0cmVzb3VyY2VzLnB1c2goUmVzb3VyY2UoMTAwLCBNYXRoLnJhbmRvbSgpICogd2lkdGgsIE1hdGgucmFuZG9tKCkgKiBoZWlnaHQpKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHR2YXIgdXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcclxuXHRcdHRpbWUgKys7XHJcblxyXG5cdFx0Zm9yKHZhciBpPTA7IGk8cGVvcGxlLmxlbmd0aDsgaSsrKSB7XHJcblxyXG5cdFx0XHRpZihwZW9wbGVbaV0uYWxpdmUpIHtcclxuXHRcdFx0XHQvL3BsYXllciBvd25zIGJ1aWxkaW5ncyB3aXRoIHJlc291cmNlXHJcblx0XHRcdFx0aWYoYXZhaWxhYmxlQnVpbGRpbmdzKHBlb3BsZVtpXSkpIHtcclxuXHJcblx0XHRcdFx0XHR2YXIgbmVhcmVzdEJ1aWxkaW5nSW5kZXggPSBuZWFyZXN0QnVpbGRpbmcocGVvcGxlW2ldKTtcclxuXHRcdFx0XHRcdHBlb3BsZVtpXS53YXlwb2ludC54ID0gYnVpbGRpbmdzW25lYXJlc3RCdWlsZGluZ0luZGV4XS5wb3NpdGlvbi54O1xyXG5cdFx0XHRcdFx0cGVvcGxlW2ldLndheXBvaW50LnkgPSBidWlsZGluZ3NbbmVhcmVzdEJ1aWxkaW5nSW5kZXhdLnBvc2l0aW9uLnk7XHJcblxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0Ly9ubyBwbGF5ZXIgYnVpbGRpbmdzIG93bmVkXHJcblx0XHRcdFx0XHRpZihhdmFpbGJhbGVSZXNvdXJjZXMoKSA+IDApIHtcclxuXHRcdFx0XHRcdFx0dmFyIHdheXBvaW50SW5kZXggPSBuZWFyZXN0UmVzb3VyY2UocGVvcGxlW2ldLnBvc2l0aW9uKTtcclxuXHRcdFx0XHRcdFx0cGVvcGxlW2ldLndheXBvaW50LnggPSByZXNvdXJjZXNbd2F5cG9pbnRJbmRleF0ucG9zaXRpb24ueDtcclxuXHRcdFx0XHRcdFx0cGVvcGxlW2ldLndheXBvaW50LnkgPSByZXNvdXJjZXNbd2F5cG9pbnRJbmRleF0ucG9zaXRpb24ueTtcclxuXHRcdFx0XHRcdFx0cGVvcGxlW2ldLmN1cnJlbnRSZXNvdXJjZUluZGV4ID0gd2F5cG9pbnRJbmRleDtcclxuXHJcblx0XHRcdFx0XHRcdHBlb3BsZVtpXS51cGRhdGUoKTtcclxuXHJcblx0XHRcdFx0XHRcdGlmKHJlc291cmNlc1twZW9wbGVbaV0uY3VycmVudFJlc291cmNlSW5kZXhdLmFtbW91bnQgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYoZGlzdGFuY2UocGVvcGxlW2ldLnBvc2l0aW9uLCByZXNvdXJjZXNbcGVvcGxlW2ldLmN1cnJlbnRSZXNvdXJjZUluZGV4XS5wb3NpdGlvbikgPCAyMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb3VyY2VzW3Blb3BsZVtpXS5jdXJyZW50UmVzb3VyY2VJbmRleF0uYW1tb3VudCAtLTtcclxuXHRcdFx0XHRcdFx0XHRcdHBlb3BsZVtpXS5yZXNvdXJjZSArKztcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRwZW9wbGVbaV0ud2F5cG9pbnQueCA9IE1hdGgucmFuZG9tKCkgKiB3aWR0aDtcclxuXHRcdFx0XHRcdFx0cGVvcGxlW2ldLndheXBvaW50LnkgPSBNYXRoLnJhbmRvbSgpICogaGVpZ2h0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQvL3BsYXllciBjYW4gYnVpbGQgYSBmYXJtIGlmIHRoZXkgaGF2ZSBlbm91Z2ggcmVzb3VyY2VcclxuXHRcdFx0aWYocGVvcGxlW2ldLnJlc291cmNlID49IDM0MCkge1xyXG5cdFx0XHRcdHZhciByZXNvdXJjZSA9IFJlc291cmNlKDMwMDAsIHBlb3BsZVtpXS5wb3NpdGlvbi54LCBwZW9wbGVbaV0ucG9zaXRpb24ueSk7XHJcblx0XHRcdFx0YnVpbGRpbmdzLnB1c2gocmVzb3VyY2UpO1xyXG5cdFx0XHRcdHBlb3BsZVtpXS5idWlsZGluZ3MucHVzaChidWlsZGluZ3MubGVuZ3RoIC0gMSk7Ly9wdXNoIGluZGV4IG9mIGxhc3QgYWRkZWQgYnVpbGRpbmdcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG5lYXJlc3QgcmVzb3VyY2UgdG8gdGhlIHBvc2l0aW9uIHBhcmFtZXRlclxyXG5cdHZhciBuZWFyZXN0UmVzb3VyY2UgPSBmdW5jdGlvbihwb3NpdGlvbikge1xyXG5cdFx0dmFyIG1pbkRpc3QgPSAxMDAwMDA7XHJcblx0XHR2YXIgbWluSW5kZXggPSAwO1xyXG5cdFx0Zm9yKHZhciBpPTA7IGk8cmVzb3VyY2VzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBkaXN0ID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvc2l0aW9uLnggLSByZXNvdXJjZXNbaV0ucG9zaXRpb24ueCwyKSBcclxuXHRcdFx0XHQrIE1hdGgucG93KHBvc2l0aW9uLnkgLSByZXNvdXJjZXNbaV0ucG9zaXRpb24ueSwyKSk7XHJcblxyXG5cdFx0XHRpZihkaXN0IDwgbWluRGlzdCAmJiByZXNvdXJjZXNbaV0uYW1tb3VudCA+IDApIHtcclxuXHRcdFx0XHRtaW5EaXN0ID0gZGlzdDtcclxuXHRcdFx0XHRtaW5JbmRleCA9IGk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBtaW5JbmRleDtcclxuXHR9O1xyXG5cclxuXHR2YXIgZGlzdGFuY2UgPSBmdW5jdGlvbihwb3MxLCBwb3MyKSB7XHJcblx0XHRyZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHBvczEueCAtIHBvczIueCwgMikgKyBNYXRoLnBvdyhwb3MxLnkgLSBwb3MyLnksIDIpKTtcclxuXHR9O1xyXG5cclxuXHQvL251bWJlciBvZiBidWlsZGluZ3Mgb3duZWQgYnkgYSBwbGF5ZXIgdGhhdCBoYXZlIHJlc291cmNlXHJcblx0dmFyIGF2YWlsYWJsZUJ1aWxkaW5ncyA9IGZ1bmN0aW9uKHBlcnNvbikge1xyXG5cdFx0dmFyIGNvdW50ID0gMDtcclxuXHRcdGZvcih2YXIgaT0wOyBpPHBlcnNvbi5idWlsZGluZ3MubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYocGVyc29uLmJ1aWxkaW5nc1tpXS5hbW1vdW50ID4gMCkge1xyXG5cdFx0XHRcdGNvdW50ICsrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY291bnQ7XHJcblx0fTtcclxuXHJcblx0dmFyIG5lYXJlc3RCdWlsZGluZyA9IGZ1bmN0aW9uKHBsYXllcikge1xyXG5cdFx0dmFyIG1pbkRpc3QgPSAxMDAwMDA7XHJcblx0XHR2YXIgbWluSW5kZXggPSAwO1xyXG5cclxuXHRcdGZvcih2YXIgaT0wOyBpPGJ1aWxkaW5ncy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgZGlzdCA9IE1hdGguc3FydChNYXRoLnBvdyhwb3NpdGlvbi54IC0gYnVpbGRpbmdzW2ldLnBvc2l0aW9uLngsMikgXHJcblx0XHRcdFx0KyBNYXRoLnBvdyhwb3NpdGlvbi55IC0gYnVpbGRpbmdzW2ldLnBvc2l0aW9uLnksMikpO1xyXG5cclxuXHRcdFx0aWYoZGlzdCA8IG1pbkRpc3QgJiYgYnVpbGRpbmdzW2ldLmFtbW91bnQgPiAwICYmIHBsYXllci5idWlsZGluZ3MuaW5kZXhPZihpKSAhPSAtMSkge1xyXG5cdFx0XHRcdG1pbkRpc3QgPSBkaXN0O1xyXG5cdFx0XHRcdG1pbkluZGV4ID0gaTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG1pbkluZGV4O1xyXG5cdH07XHJcblxyXG5cdC8vbnVtYmVyIG9mIHJlc291cmNlcyBpbiB0aGUgd29ybGQgd2hpY2ggaGF2ZSByZXNvdXJjZVxyXG5cdHZhciBhdmFpbGJhbGVSZXNvdXJjZXMgPSBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBjb3VudCA9IDA7XHJcblx0XHRmb3IodmFyIGk9MDsgaTxyZXNvdXJjZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYocmVzb3VyY2VzW2ldLmFtbW91bnQgPiAwKSB7XHJcblx0XHRcdFx0Y291bnQgKys7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBjb3VudDtcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0dGltZTogMCxcclxuXHJcblx0XHRmcHM6IGZwcyxcclxuXHRcdHBlb3BsZTogcGVvcGxlLFxyXG5cdFx0d2lkdGg6IHdpZHRoLFxyXG5cdFx0aGVpZ2h0OiBoZWlnaHQsXHJcblx0XHRyZXNvdXJjZXM6IHJlc291cmNlcyxcclxuXHRcdGJ1aWxkaW5nczogYnVpbGRpbmdzLFxyXG5cclxuXHRcdGluaXQ6IGluaXQsXHJcblx0XHR1cGRhdGU6IHVwZGF0ZVxyXG5cdH07XHJcbn07IiwidmFyIEVuZ2luZSA9IHJlcXVpcmUoJy4vZW5naW5lJyk7XHJcblxyXG52YXIgZ2FtZSA9IEVuZ2luZSg2NDAsIDQ4MCwgNjAsIDEwLCAzMCk7XHJcbmdhbWUuaW5pdCgpO1xyXG5cclxudmFyIGN0eCA9ICQoJyNjYW52YXMnKVswXS5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxudmFyIHJlbmRlciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xyXG5cdGN0eC5maWxsUmVjdCgwLCAwLCBnYW1lLndpZHRoLCBnYW1lLmhlaWdodCk7XHJcblxyXG5cdGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuXHRmb3IodmFyIGk9MDsgaTxnYW1lLnJlc291cmNlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0aWYoZ2FtZS5yZXNvdXJjZXNbaV0uYW1tb3VudCA+IDApIHtcclxuXHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRjdHguYXJjKGdhbWUucmVzb3VyY2VzW2ldLnBvc2l0aW9uLngsIGdhbWUucmVzb3VyY2VzW2ldLnBvc2l0aW9uLnksIDUsIDAsIDIqTWF0aC5QSSk7XHJcblx0XHRcdGN0eC5zdHJva2UoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGN0eC5zdHJva2VTdHlsZSA9IFwicmVkXCI7XHJcblx0Zm9yKHZhciBpPTA7IGk8Z2FtZS5wZW9wbGUubGVuZ3RoOyBpKyspIHtcclxuXHRcdGlmKGdhbWUucGVvcGxlW2ldLmFsaXZlKSB7XHJcblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHRcdFx0Y3R4LmFyYyhnYW1lLnBlb3BsZVtpXS5wb3NpdGlvbi54LCBnYW1lLnBlb3BsZVtpXS5wb3NpdGlvbi55LCAyLCAwLCAyKk1hdGguUEkpO1xyXG5cdFx0XHRjdHguc3Ryb2tlKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjdHguZmlsbFN0eWxlID0gXCJncmVlblwiO1xyXG5cdGN0eC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuXHRmb3IodmFyIGk9MDsgaTxnYW1lLmJ1aWxkaW5ncy5sZW5ndGg7IGkrKykge1xyXG5cdFx0aWYoZ2FtZS5idWlsZGluZ3NbaV0ucmVzb3VyY2UgPCAxKSB7XHJcblx0XHRcdGN0eC5maWxsU3R5bGUgPSBcImdyYXlcIjtcclxuXHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gXCJncmF5XCI7XHJcblx0XHR9XHJcblx0XHRjdHguZmlsbFJlY3QoZ2FtZS5idWlsZGluZ3NbaV0ucG9zaXRpb24ueCAtIDUsIFxyXG5cdFx0XHRnYW1lLmJ1aWxkaW5nc1tpXS5wb3NpdGlvbi55IC0gNSwgXHJcblx0XHRcdGdhbWUuYnVpbGRpbmdzW2ldLnBvc2l0aW9uLnggKyA1LCBcclxuXHRcdFx0Z2FtZS5idWlsZGluZ3NbaV0ucG9zaXRpb24ueSArIDVcclxuXHRcdCk7XHJcblx0fVxyXG59O1xyXG5cclxuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0Z2FtZS51cGRhdGUoKTtcclxuXHRyZW5kZXIoKTtcclxuXHJcbn0sIDEwMDAgLyBnYW1lLmZwcyk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih4LCB5KSB7XHJcblxyXG5cdHZhciBwb3NpdGlvbiA9IHt4OiB4LCB5OiB5fTtcclxuXHR2YXIgd2F5cG9pbnQgPSB7eDogeCwgeTogeX07XHJcblx0dmFyIGh1bmdlciA9IDEwMDA7XHJcblx0dmFyIGFsaXZlID0gdHJ1ZTtcclxuXHR2YXIgY3VycmVudFJlc291cmNlSW5kZXggPSAtMTtcclxuXHR2YXIgcmVzb3VyY2UgPSAwO1xyXG5cclxuXHR2YXIgYnVpbGRpbmdzID0gW107IC8vYXJyYXkgb2YgYnVpbGRpbmdzIGluZGV4ZXNcclxuXHJcblx0dmFyIHVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcclxuXHRcdGlmKGh1bmdlciA8IDEpIHtcclxuXHRcdFx0YWxpdmUgPSBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRtb3ZlVG8od2F5cG9pbnQpO1xyXG5cdH07XHJcblxyXG5cdHZhciBtb3ZlVG8gPSBmdW5jdGlvbihwb2ludCkge1xyXG5cdFx0dmFyIG1hZyA9IE1hdGguc3FydChNYXRoLnBvdyhwb2ludC54IC0gcG9zaXRpb24ueCwgMiksIE1hdGgucG93KHBvaW50LnkgLSBwb3NpdGlvbi55KSk7XHJcblxyXG5cdFx0aWYobWFnID4gMCkge1xyXG5cdFx0XHRwb3NpdGlvbi54ICs9ICh3YXlwb2ludC54IC0gcG9zaXRpb24ueCkgLyBtYWc7XHJcblx0XHRcdHBvc2l0aW9uLnkgKz0gKHdheXBvaW50LnkgLSBwb3NpdGlvbi55KSAvIG1hZztcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0cG9zaXRpb246IHBvc2l0aW9uLFxyXG5cdFx0d2F5cG9pbnQ6IHdheXBvaW50LFxyXG5cdFx0Y3VycmVudFJlc291cmNlSW5kZXg6IGN1cnJlbnRSZXNvdXJjZUluZGV4LFxyXG5cdFx0aHVuZ2VyOiBodW5nZXIsXHJcblx0XHRhbGl2ZTogYWxpdmUsXHJcblx0XHRidWlsZGluZ3M6IGJ1aWxkaW5ncyxcclxuXHRcdHJlc291cmNlOiByZXNvdXJjZSxcclxuXHJcblx0XHR1cGRhdGU6IHVwZGF0ZSxcclxuXHRcdG1vdmVUbzogbW92ZVRvXHJcblx0fTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFtbW91bnQsIHgsIHkpIHtcclxuXHRcclxuXHR2YXIgYW1tb3VudCA9IGFtbW91bnQ7XHJcblx0dmFyIHR5cGUgPSBcInVuZGVmXCI7XHJcblxyXG5cdHZhciBwb3NpdGlvbiA9IHtcclxuXHRcdHg6IHgsXHJcblx0XHR5OiB5XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdHBvc2l0aW9uOiBwb3NpdGlvbixcclxuXHRcdGFtbW91bnQ6IGFtbW91bnQsXHJcblx0XHR0eXBlOiB0eXBlXHJcblx0fTtcclxufTsiXX0=
