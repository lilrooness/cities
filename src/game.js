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