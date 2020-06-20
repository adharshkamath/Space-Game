$(function () {
  let socket = io("/chat");

  $("form").submit(function (e) {
    e.preventDefault();
    socket.emit("chat message", $("#m").val());
    $("#messages").append($("<li>").text("You : " + $("#m").val()));
    window.scrollTo(0, document.body.scrollHeight);
    $("#m").val("");
    return false;
  });
  socket.on("chat message", function (msg, sender) {
    $("#messages").append($("<li>").text(sender + " : " + msg));
    window.scrollTo(0, document.body.scrollHeight);
  });
});
