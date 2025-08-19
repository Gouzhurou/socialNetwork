import {getUserHead} from "./user.js";
import {getMessages} from "./post.js";

jQuery(() => {
  let id = window.location.pathname.split('/')[2];
  console.log("get " + id + " messages");
  $.getJSON(`/users/get-messages/${id}`, messages => {
    getMessagesList(messages);
  });
});

function getMessagesList(messages) {
  let id = messages.shift();
  let name = messages.shift();
  let fileName = messages.shift();

  const [$img, $name] = getUserHead(fileName, id, name);
  $(".user-intro").append($img);
  $(".user-intro").append($name);

  let $header = $('<p>').text("Сообщения").addClass("heading").addClass("black-text");
  $(".user-messages").append($header);

  let $messages = $('<div>').addClass("list");
  getMessages(messages, $messages);
  $('.user-messages').append($messages);
}
