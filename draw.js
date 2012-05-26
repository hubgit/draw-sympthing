var context = document.getElementById("input").getContext("2d");

var paint = false;

var container = document.getElementById("container");

var clickX = [],
	clickY = [],
	clickDrag = [],
	canvasWidth = $("#input").width(),
	canvasHeight = $("#input").height();

var fetchDrawings = function() {
	$.ajax({
		url: "drawings.txt",
		dataType: "text",
		success: function(data) {
			var lines = data.split("\n");
			var j = Math.floor(Math.random() * (lines.length - 1));
			console.log(j + "/" + lines.length);
			var drawing = lines[j];
			drawing = JSON.parse(drawing);
			clickX = drawing["x"];
			clickY = drawing["y"];
			clickDrag = drawing["drag"];
			drawLetterBoxes(drawing.word);
			$("body").removeClass("select").removeClass("draw").addClass("guess");
			clearCanvas();
			redraw();
		},
	});
};

var drawLetterBoxes = function(word) {
	var letters = word.split("");
	console.log(letters);

	$("#boxes").empty();

	letters.forEach(function(letter){ 
		if (letter.match(/[a-z]/)) {
			$("<input/>", { "class": "letter" }).appendTo("#boxes");
		}
		else {
			$("<span/>", { "class": "letter", text: letter }).appendTo("#boxes");
		}
	});

	letters.sort(randomOrder);

	console.log(letters);

	letters.forEach(function(letter){ 
		if (!letter.match(/[a-z]/)) return;
		$("<span/>", { "class": "letter", text: letter }).appendTo("#letters");
	});

	$("#show").on("click", function() {
		alert(word + "!");
	}).show();
};

var randomOrder = function() {
  return (Math.round(Math.random())-0.5);
}

var clearCanvas = function() {
	context.clearRect(0, 0, canvasWidth, canvasHeight);
}

$("#input")
	.on("mousedown", function(e) {
	  event.preventDefault();
	  paint = true;
	  addClick(e.pageX - container.offsetLeft, e.pageY - container.offsetTop);
	  redraw();
	})
	.on("mousemove", function(e) {
	  event.preventDefault();
	  if(!paint) return;  
	  addClick(e.pageX - container.offsetLeft, e.pageY - container.offsetTop, true);
	  redraw();
	})
	.on("mouseup", function(e) {
	  event.preventDefault();
	  paint = false;
	})
	.on("mouseleave", function(e) {
	  event.preventDefault();
	  paint = false;
	});

$("#save").on("click", function() {
	var button = $("#save");
	button.text("Saving...");

	$.ajax({
		type: "POST",
		url: "save.php",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({ word: $("#word").text(), x: clickX, y: clickY, drag: clickDrag }),
		success: function(data) {
			alert("Saved!");
			window.location.reload();
		},
		failure: function(data) {
			button.text("Uh oh!");
		},
	});
});

$("#guess").on("click", fetchDrawings);

var addClick = function(x, y, dragging) {
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function redraw(){
  clearCanvas();
  
  context.strokeStyle = "#df4b26";
  context.lineJoin = "round";
  context.lineWidth = 5;

  clickX.forEach(function(click, i) {
	context.beginPath();
    if(i && clickDrag[i]){
      context.moveTo(clickX[i-1], clickY[i-1]);
    }
    else{
      context.moveTo(clickX[i]-1, clickY[i]);
    }
    context.lineTo(clickX[i], clickY[i]);
    context.closePath();
    context.stroke();
  });
}