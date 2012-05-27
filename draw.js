var context = document.getElementById("input").getContext("2d");

var paint = false;

var container = document.getElementById("container");

var clickX = [],
	clickY = [],
	clickDrag = [],
	canvasWidth = $("#input").width(),
	canvasHeight = $("#input").height();

var handleDrawing = function(drawing) {
	clickX = drawing["x"];
	clickY = drawing["y"];
	clickDrag = drawing["drag"];
	drawLetterBoxes(drawing.word);
	$("body").removeClass("select").removeClass("draw").addClass("guess");
	clearCanvas();
	redraw();
}

var fetchDrawing = function() {
	$.getJSON("draw.php", handleDrawing);
};

$("#guess").on("click", fetchDrawing);

var drawLetterBoxes = function(word) {
	var letters = word.split("");

	$("#boxes").empty().data("word", word);

	letters.forEach(function(letter){ 
		if (letter.match(/[A-Z]/)) {
			$("<input/>", { "class": "letter" }).appendTo("#boxes");
		}
		else {
			$("<span/>", { "class": "letter", text: letter }).appendTo("#boxes");
		}
	});

	letters.sort(randomOrder);

	letters.forEach(function(letter){ 
		if (!letter.match(/[A-Z]/)) return;
		$("<span/>", { "class": "letter", text: letter }).appendTo("#letters");
	});

	$("#show")
		.on("click", function() { alert(word + "!") })
		.show();
};

var detectWord = function() {
	var letters = [];
	$("#boxes .letter").each(function() {
		switch(this.nodeName) {
			case 'INPUT':
				letters.push($(this).val());
			break;

			case 'SPAN':
				letters.push($(this).text());
			break;
		}
	});
	return letters.join("");
}

$("#boxes").on("keyup", ".letter", function(event) {
	var node = $(event.target);
	node.val(node.val().toUpperCase());

	if (detectWord() == $("#boxes").data("word")) {
		alert("YES!!!!!!");
		window.location.reload();
	}
	node.nextAll("input.letter").first().select();
});

$("#boxes").on("focus", ".letter", function(event) {
	$(event.target).val("");
});

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
		url: "draw.php",
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

var fetchWord = function() {
	$.ajax({
		"url": "data/words.txt",
		"dataType": "text",
	})
	.then(function(data){
		$("#words").empty();
		var lines = data.split("\n");
		for (var i = 0; i < 3; i++) {
			var word = lines[Math.floor(Math.random()*lines.length)];
			$("<li/>", { class: "word", text: word }).appendTo("#words");
		}
	});
};

$("#words").on("click", ".word", function(event) {
	var node = $(this);
	$("#message .word").text(node.text());
	$("body").removeClass("select").removeClass("guess").addClass("draw");
	$("#save").text("Save");
});

fetchWord();