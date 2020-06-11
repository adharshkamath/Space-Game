$(function () {
	let socket = io("/chat");
	let typingArray = new Map();
	function checkTyping() {
		typingArray.forEach((value, key) => {
			if (value) {
				$("#messages").remove(":contains(" + key + " typing...)");
				$("#messages").append($("<li>").text(key + " typing..."));
				window.scrollTo(0, document.body.scrollHeight);
			} else {
				$("#messages").remove(":contains(" + key + " typing...)");
			}
		});
	}
	$("form").on("change", function () {
		socket.emit("typing");
	});
	socket.on("typing", function (id) {
		typingArray.set(id, true);
		checkTyping();
		window.scrollTo(0, document.body.scrollHeight);
	});
	$("form").submit(function (e) {
		e.preventDefault();
		socket.emit("chat message", $("#m").val());
		$("#messages").append($("<li>").text("you : " + $("#m").val()));
		window.scrollTo(0, document.body.scrollHeight);
		$("#m").val("");
		return false;
	});
	socket.on("chat message", function (msg, sender) {
		$("#messages").append($("<li>").text(sender + " : " + msg));
		window.scrollTo(0, document.body.scrollHeight);
	});
	socket.on("new user", function (id) {
		typingArray.set(id, false);
		alert(id);
	});
});
