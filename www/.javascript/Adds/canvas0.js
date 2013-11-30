//joke--------------
var paintC = function(_canvas){
	var context = _canvas.getContext("2d");

	var branches = [];

	setInterval(loop, 1000/20);

	function loop(){
		if (branches.length < 500)
			branches.push(new Branch(UI.mouseX -_canvas.offsetLeft, UI.mouseY -_canvas.offsetTop));

		for (var i = 0; i < branches.length; i++){
			var branch = branches[i];
			branch.life++;

			if (branch.life > branch.lifeTo){
				branches.shift();
				continue;
			}

			context.beginPath();
			context.moveTo(branch.x, branch.y);

			branch.rw += branch.life/1000*branch.rwRate +Math.random()*.2-.1;
			branch.x += Math.cos(branch.rw);
			branch.y += Math.sin(branch.rw);

			context.strokeStyle = "rgba(255,255,255,"+Math.min(branch.life,100)/100+")";
			context.lineTo(branch.x, branch.y);

			context.stroke();
		}

		context.closePath();

	}

	var Branch = function(x, y){
		this.lifeTo = (Math.random())*100000;
		this.life = 0;
		this.x = x;
		this.y = y;
		this.rw = Math.random()*360;
		this.rwRate = -Math.pow(Math.random(),5);
	}
};
