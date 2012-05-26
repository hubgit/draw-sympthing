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
});

fetchWord();