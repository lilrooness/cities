(function() {

	var width = 640;
	var height = 480;

	var ctx = document.getElementById("canvas").getContext('2d');
	
	var xResolution = 20; //number of squares on X axis
	var yResolution = 14; //number of squares on Y axis 

	var sink = {
		x: 320,
		y: 480
	};

	var source = {
		x: 320,
		y: 0
	};

	var squares = [];
	var visited = [];
	for(var y = 0; y < yResolution; y++) {

		squares.push(new Array(xResolution));
		visited.push(new Array(xResolution));
		for(var x =0; x < xResolution; x++) {
			squares[y][x] = Math.random() * (yResolution - y) * 10;
			visited[y][x] = false;
		}
	}
	console.table(squares);
	ctx.fillStyle = "blue";

	var distToSink = function(x, y) {
		// return Math.sqrt(Math.pow(x - sink.x, 2) + Math.pow(y - sink.y, 2));
		return yResolution - y;
	};

	var river = function(x, y, dist, depth) {
		if(depth != 0 && visited[y][x] == false) {
			visited[y][x] = true;
			flowed = false;
			console.log(x);
			console.log(y);
			ctx.fillRect(x*(width/xResolution), y*(height/yResolution), width/xResolution, height/yResolution);
			// ctx.beginPath();
			// ctx.arc(x*(width/xResolution), y*(height/yResolution)+ 50, 5, 0, Math.PI*2);
			// ctx.stroke();
			if(dist != 0) {
				if(y < squares.length - 2) {

					if(squares[y+1][x] < squares[y][x]) {
						console.log('first');
						river(x, y+1, distToSink(x, y+1), depth-1);
						flowed = true;
					}
					if(!flowed) {
						if(x > 0) {
							if(squares[y+1][x-1] < squares[y][x]) {
								console.log('second');
								river(x-1, y+1, distToSink(x-1, y+1), depth-1);
								flowed = true;
							}
						}
					}	
					if(!flowed) {
						if(x < squares[0].length - 1) {
							if(squares[y+1][x+1] < squares[y][x]) {
								console.log('third');
								river(x+1, y+1, distToSink(x+1, y+1), depth-1);
								flowed = true;
							}
						}
					}


					if(!flowed) {
						river(x+1, y, distToSink(x+1, y), depth-1);
					}
				}
			}
		}
	};

	river(source.x / xResolution, source.y / yResolution, distToSink(source.x, source.y), 10);
})();