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
},{"./people":3,"./resource":4}],2:[function(require,module,exports){
var Engine = require('./engine');

var game = Engine(640, 480, 60, 10, 30);
game.init();

var ctx = $('#canvas')[0].getContext('2d');

var render = function() {

	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, game.width, game.height);

	ctx.fillStyle = "black";
	for(var i=0; i<game.resources.length; i++) {
		if(game.resources[i].ammount > 0) {
			ctx.beginPath();
			ctx.arc(game.resources[i].position.x, game.resources[i].position.y, 5, 0, 2*Math.PI);
			ctx.stroke();
		}
	}

	ctx.fillStyle = "red";
	for(var i=0; i<game.people.length; i++) {
		if(game.people[i].alive) {
			ctx.beginPath();
			ctx.arc(game.people[i].position.x, game.people[i].position.y, 2, 0, 2*Math.PI);
			ctx.stroke();
		}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEpvZVxcRG9jdW1lbnRzXFxHaXRIdWJcXGNpdGllc1xcbm9kZV9tb2R1bGVzXFxncnVudC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkM6L1VzZXJzL0pvZS9Eb2N1bWVudHMvR2l0SHViL2NpdGllcy9zcmMvZW5naW5lLmpzIiwiQzovVXNlcnMvSm9lL0RvY3VtZW50cy9HaXRIdWIvY2l0aWVzL3NyYy9nYW1lLmpzIiwiQzovVXNlcnMvSm9lL0RvY3VtZW50cy9HaXRIdWIvY2l0aWVzL3NyYy9wZW9wbGUuanMiLCJDOi9Vc2Vycy9Kb2UvRG9jdW1lbnRzL0dpdEh1Yi9jaXRpZXMvc3JjL3Jlc291cmNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBQZXJzb24gPSByZXF1aXJlKCcuL3Blb3BsZScpO1xyXG52YXIgUmVzb3VyY2UgPSByZXF1aXJlKCcuL3Jlc291cmNlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQsIGZwcywgbnVtUGVvcGxlLCBudW1SZXNvdXJjZXMpIHtcclxuXHJcblx0dmFyIHRpbWUgPSAwO1xyXG5cclxuXHR2YXIgZnBzID0gZnBzO1xyXG5cdHZhciBwZW9wbGUgPSBbXTtcclxuXHR2YXIgd2lkdGggPSB3aWR0aDtcclxuXHR2YXIgaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cdHZhciByZXNvdXJjZXMgPSBbXTtcclxuXHJcblx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcclxuXHRcdGZvcih2YXIgaT0wOyBpPG51bVBlb3BsZTsgaSsrKSB7XHJcblx0XHRcdHBlb3BsZS5wdXNoKFBlcnNvbihNYXRoLnJhbmRvbSgpICogd2lkdGgsIE1hdGgucmFuZG9tKCkgKiBoZWlnaHQpKTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IodmFyIGk9MDsgaTxudW1SZXNvdXJjZXM7IGkrKykge1xyXG5cdFx0XHRyZXNvdXJjZXMucHVzaChSZXNvdXJjZSgxMDAsIE1hdGgucmFuZG9tKCkgKiB3aWR0aCwgTWF0aC5yYW5kb20oKSAqIGhlaWdodCkpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdHZhciB1cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuXHRcdFxyXG5cdFx0dGltZSArKztcclxuXHJcblx0XHRmb3IodmFyIGk9MDsgaTxwZW9wbGUubGVuZ3RoOyBpKyspIHtcclxuXHJcblx0XHRcdGlmKHBlb3BsZVtpXS5hbGl2ZSkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGF2YWlsYmFsZVJlc291cmNlcygpKTtcclxuXHRcdFx0XHRpZihhdmFpbGJhbGVSZXNvdXJjZXMoKSA+IDApIHtcclxuXHRcdFx0XHRcdHZhciB3YXlwb2ludEluZGV4ID0gbmVhcmVzdFJlc291cmNlKHBlb3BsZVtpXS5wb3NpdGlvbik7XHJcblx0XHRcdFx0XHRwZW9wbGVbaV0ud2F5cG9pbnQueCA9IHJlc291cmNlc1t3YXlwb2ludEluZGV4XS5wb3NpdGlvbi54O1xyXG5cdFx0XHRcdFx0cGVvcGxlW2ldLndheXBvaW50LnkgPSByZXNvdXJjZXNbd2F5cG9pbnRJbmRleF0ucG9zaXRpb24ueTtcclxuXHRcdFx0XHRcdHBlb3BsZVtpXS5jdXJyZW50UmVzb3VyY2VJbmRleCA9IHdheXBvaW50SW5kZXg7XHJcblxyXG5cdFx0XHRcdFx0cGVvcGxlW2ldLnVwZGF0ZSgpO1xyXG5cclxuXHRcdFx0XHRcdGlmKHJlc291cmNlc1twZW9wbGVbaV0uY3VycmVudFJlc291cmNlSW5kZXhdLmFtbW91bnQgPiAwKSB7XHJcblx0XHRcdFx0XHRcdGlmKGRpc3RhbmNlKHBlb3BsZVtpXS5wb3NpdGlvbiwgcmVzb3VyY2VzW3Blb3BsZVtpXS5jdXJyZW50UmVzb3VyY2VJbmRleF0ucG9zaXRpb24pIDwgMjApIHtcclxuXHRcdFx0XHRcdFx0cmVzb3VyY2VzW3Blb3BsZVtpXS5jdXJyZW50UmVzb3VyY2VJbmRleF0uYW1tb3VudCAtLTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRwZW9wbGVbaV0ud2F5cG9pbnQueCA9IE1hdGgucmFuZG9tKCkgKiB3aWR0aDtcclxuXHRcdFx0XHRcdHBlb3BsZVtpXS53YXlwb2ludC55ID0gTWF0aC5yYW5kb20oKSAqIGhlaWdodDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHR2YXIgbmVhcmVzdFJlc291cmNlID0gZnVuY3Rpb24ocG9zaXRpb24pIHtcclxuXHRcdHZhciBtaW5EaXN0ID0gMTAwMDAwO1xyXG5cdFx0dmFyIG1pbkluZGV4ID0gMDtcclxuXHRcdGZvcih2YXIgaT0wOyBpPHJlc291cmNlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgZGlzdCA9IE1hdGguc3FydChNYXRoLnBvdyhwb3NpdGlvbi54IC0gcmVzb3VyY2VzW2ldLnBvc2l0aW9uLngsMikgXHJcblx0XHRcdFx0KyBNYXRoLnBvdyhwb3NpdGlvbi55IC0gcmVzb3VyY2VzW2ldLnBvc2l0aW9uLnksMikpO1xyXG5cclxuXHRcdFx0aWYoZGlzdCA8IG1pbkRpc3QgJiYgcmVzb3VyY2VzW2ldLmFtbW91bnQgPiAwKSB7XHJcblx0XHRcdFx0bWluRGlzdCA9IGRpc3Q7XHJcblx0XHRcdFx0bWluSW5kZXggPSBpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbWluSW5kZXg7XHJcblx0fTtcclxuXHJcblx0dmFyIGRpc3RhbmNlID0gZnVuY3Rpb24ocG9zMSwgcG9zMikge1xyXG5cdFx0cmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyhwb3MxLnggLSBwb3MyLngsIDIpICsgTWF0aC5wb3cocG9zMS55IC0gcG9zMi55LCAyKSk7XHJcblx0fTtcclxuXHJcblx0dmFyIGF2YWlsYmFsZVJlc291cmNlcyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGNvdW50ID0gMDtcclxuXHRcdGZvcih2YXIgaT0wOyBpPHJlc291cmNlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZihyZXNvdXJjZXNbaV0uYW1tb3VudCA+IDApIHtcclxuXHRcdFx0XHRjb3VudCArKztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNvdW50O1xyXG5cdH07XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHR0aW1lOiAwLFxyXG5cclxuXHRcdGZwczogZnBzLFxyXG5cdFx0cGVvcGxlOiBwZW9wbGUsXHJcblx0XHR3aWR0aDogd2lkdGgsXHJcblx0XHRoZWlnaHQ6IGhlaWdodCxcclxuXHRcdHJlc291cmNlczogcmVzb3VyY2VzLFxyXG5cclxuXHRcdGluaXQ6IGluaXQsXHJcblx0XHR1cGRhdGU6IHVwZGF0ZVxyXG5cdH07XHJcbn07IiwidmFyIEVuZ2luZSA9IHJlcXVpcmUoJy4vZW5naW5lJyk7XHJcblxyXG52YXIgZ2FtZSA9IEVuZ2luZSg2NDAsIDQ4MCwgNjAsIDEwLCAzMCk7XHJcbmdhbWUuaW5pdCgpO1xyXG5cclxudmFyIGN0eCA9ICQoJyNjYW52YXMnKVswXS5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxudmFyIHJlbmRlciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xyXG5cdGN0eC5maWxsUmVjdCgwLCAwLCBnYW1lLndpZHRoLCBnYW1lLmhlaWdodCk7XHJcblxyXG5cdGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcblx0Zm9yKHZhciBpPTA7IGk8Z2FtZS5yZXNvdXJjZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdGlmKGdhbWUucmVzb3VyY2VzW2ldLmFtbW91bnQgPiAwKSB7XHJcblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHRcdFx0Y3R4LmFyYyhnYW1lLnJlc291cmNlc1tpXS5wb3NpdGlvbi54LCBnYW1lLnJlc291cmNlc1tpXS5wb3NpdGlvbi55LCA1LCAwLCAyKk1hdGguUEkpO1xyXG5cdFx0XHRjdHguc3Ryb2tlKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjdHguZmlsbFN0eWxlID0gXCJyZWRcIjtcclxuXHRmb3IodmFyIGk9MDsgaTxnYW1lLnBlb3BsZS5sZW5ndGg7IGkrKykge1xyXG5cdFx0aWYoZ2FtZS5wZW9wbGVbaV0uYWxpdmUpIHtcclxuXHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRjdHguYXJjKGdhbWUucGVvcGxlW2ldLnBvc2l0aW9uLngsIGdhbWUucGVvcGxlW2ldLnBvc2l0aW9uLnksIDIsIDAsIDIqTWF0aC5QSSk7XHJcblx0XHRcdGN0eC5zdHJva2UoKTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5zZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuXHRnYW1lLnVwZGF0ZSgpO1xyXG5cdHJlbmRlcigpO1xyXG5cclxufSwgMTAwMCAvIGdhbWUuZnBzKTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHJcblx0dmFyIHBvc2l0aW9uID0ge3g6IHgsIHk6IHl9O1xyXG5cdHZhciB3YXlwb2ludCA9IHt4OiB4LCB5OiB5fTtcclxuXHR2YXIgaHVuZ2VyID0gMTAwMDtcclxuXHR2YXIgYWxpdmUgPSB0cnVlO1xyXG5cdHZhciBjdXJyZW50UmVzb3VyY2VJbmRleCA9IC0xO1xyXG5cclxuXHR2YXIgdXBkYXRlID0gZnVuY3Rpb24odGltZSkge1xyXG5cdFx0aWYoaHVuZ2VyIDwgMSkge1xyXG5cdFx0XHRhbGl2ZSA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0bW92ZVRvKHdheXBvaW50KTtcclxuXHR9O1xyXG5cclxuXHR2YXIgbW92ZVRvID0gZnVuY3Rpb24ocG9pbnQpIHtcclxuXHRcdHZhciBtYWcgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9pbnQueCAtIHBvc2l0aW9uLngsIDIpLCBNYXRoLnBvdyhwb2ludC55IC0gcG9zaXRpb24ueSkpO1xyXG5cclxuXHRcdGlmKG1hZyA+IDApIHtcclxuXHRcdFx0cG9zaXRpb24ueCArPSAod2F5cG9pbnQueCAtIHBvc2l0aW9uLngpIC8gbWFnO1xyXG5cdFx0XHRwb3NpdGlvbi55ICs9ICh3YXlwb2ludC55IC0gcG9zaXRpb24ueSkgLyBtYWc7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdHBvc2l0aW9uOiBwb3NpdGlvbixcclxuXHRcdHdheXBvaW50OiB3YXlwb2ludCxcclxuXHRcdGN1cnJlbnRSZXNvdXJjZUluZGV4OiBjdXJyZW50UmVzb3VyY2VJbmRleCxcclxuXHRcdGh1bmdlcjogaHVuZ2VyLFxyXG5cdFx0YWxpdmU6IGFsaXZlLFxyXG5cclxuXHRcdHVwZGF0ZTogdXBkYXRlLFxyXG5cdFx0bW92ZVRvOiBtb3ZlVG9cclxuXHR9O1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYW1tb3VudCwgeCwgeSkge1xyXG5cdFxyXG5cdHZhciBhbW1vdW50ID0gYW1tb3VudDtcclxuXHR2YXIgdHlwZSA9IFwidW5kZWZcIjtcclxuXHJcblx0dmFyIHBvc2l0aW9uID0ge1xyXG5cdFx0eDogeCxcclxuXHRcdHk6IHlcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0cG9zaXRpb246IHBvc2l0aW9uLFxyXG5cdFx0YW1tb3VudDogYW1tb3VudCxcclxuXHRcdHR5cGU6IHR5cGVcclxuXHR9O1xyXG59OyJdfQ==
