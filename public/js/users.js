import {getUserBlock} from "./user.js";

jQuery(() => {
  $.getJSON("/users/get-users", users => {
    console.log("get users list");
    initUsersTable(users);
  });
});

function initUsersTable(users) 
{
  let $header = $('<p>').text("Пользователи").addClass("heading").addClass("black-text");
  $(".users-list").append($header);

  let $users = $('<div>').addClass("list");
  users.forEach(user => {
    $users.append(getUserBlock(user));
  });

  $(".users-list").append($users);
}
