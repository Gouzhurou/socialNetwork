import {getUserBlock, getUserHead} from "./user.js";

jQuery(() => {
  let id = window.location.pathname.split('/')[2];
  console.log("get " + id + " friends");
  $.getJSON(`/users/get-friends/${id}`, users => {
    initUsersTable(users);
  });
});

function initUsersTable(users) {
  let id = users.shift();
  let name = users.shift();
  let fileName = users.shift();

  const [$img, $name] = getUserHead(fileName, id, name);
  $(".user-intro").append($img);
  $(".user-intro").append($name);

  let $header = $('<p>').text("Друзья").addClass("heading").addClass("black-text");
  $(".users-list").append($header);

  let $users = $('<div>').addClass("list");
  users.forEach(user => {
    $users.append(getUserBlock(user));
  });

  $(".users-list").append($users);
}
