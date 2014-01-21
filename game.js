(function() {

	var closestResouce = function(x, y) {
		var minDist = 1000;
		var minIndex = 0;

		for(var i=0; i<game.resourcePoints.length; i++) {
			var dist = Math.sqrt(Math.pow(x - game.resourcePoints[i].x,  2) + Math.pow(y - game.resourcePoints[i].y, 2));

			if(dist < minDist) {
				minDist = dist;
				minIndex = i;
			}
		}
		return minIndex;
	};

	var Point = function(x, y) {
		return {
			x: x,
			y: y,
			resource: 100,
			recType: 'undef'
		};
	};

	var Person = function(x, y) {
		return {
			x: x,
			y: y,
			age: 0,
			hunger: 1000,
			atWaypoint: false,

			waypoint: {x: x, y: y},

			update: function(time) {

				this.hunger --;

				if(game.resourcePoints.length != 0) {
					var resouceIndex = closestResouce(x, y);
					this.setWayPoint({x: game.resourcePoints[resouceIndex].x, y: game.resourcePoints[resouceIndex].y});
					this.moveTo(waypoint);

					if(this.atWaypoint) {
						game.resourcePoints[resouceIndex].resource--;
						this.hunger ++;

						if(game.resourcePoints[resouceIndex].resource < 1) {
							this.atWaypoint = false;
							game.resourcePoints.splice(resouceIndex, 1);
						}
					}
				} else {
					this.moveTo({x: Math.random() * width, y: Math.random() * height});
				}
			},

			setWayPoint: function(point) {
				waypoint = {x: point.x, y: point.y};
			},

			moveTo: function(waypoint) {
				if(!this.atWaypoint) {
					var mag = Math.sqrt(Math.pow(waypoint.x - this.x, 2) + Math.pow(waypoint.y - this.y, 2));
					if(mag >10) {
						this.x += ((waypoint.x - this.x) / mag) * 10;
						this.y += ((waypoint.y - this.y) / mag) * 10;
					} else {
						this.atWaypoint = true;
					}
				}
			}
		};
	};

	var Game = function() {
		return {
			time: 0,
			fps: 60,
			people: [],
			numResources: 30,
			resourcePoints: [],

			tick: function() {
				
				this.time ++;

				if(this.time % 50 == 0) {
					this.resourcePoints.push(Point(Math.random() * width, Math.random() * height));
				}

				for(var i=0; i<this.people.length; i++) {
					this.people[i].update(1);
				}

				for(var i=0; i<this.people.length; i++) {
					if(this.people[i].hunger < 1) {
						this.people.splice(i, 1);
						i = 0;
					}
				}
			},

			render: function() {
				
				ctx.fillStyle = "white";
				ctx.fillRect(0, 0, width, height);

				ctx.fillStyle = "red";
				for(var i=0; i<this.resourcePoints.length; i++) {
					ctx.beginPath();
					ctx.arc(this.resourcePoints[i].x, this.resourcePoints[i].y, 5, 0, Math.PI*2);
					ctx.stroke();
				}

				ctx.fillStyle = "back"
				for(var i=0; i<game.people.length; i++) {
					ctx.beginPath();
					ctx.arc(this.people[i].x, this.people[i].y, 2, 0, Math.PI*2);
					ctx.stroke();
				}
			}
		};
	};

	var width = 640;
	var height = 480;

	var ctx = document.getElementById("canvas").getContext('2d');
	game = Game();

	for(var i=0; i < game.numResources; i++) {
		game.resourcePoints.push(Point(Math.random() * width, Math.random() * height));
	}

	for(var i=0; i<10; i++) {
		game.people.push(Person(Math.random() * width, Math.random() * height));
	}

	setInterval(function() {
		game.tick();
		game.render();

	}, 1000/40);

})();