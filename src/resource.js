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