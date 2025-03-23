jQuery(() => {
  $.getJSON("/users/get-users", users => {
    console.log("2");
    initUsersTable(users);
  });
});

function initUsersTable(users) 
{
  let $headerDiv = $('<div>').addClass("list-header");
  $headerDiv.append("<p> Пользователи");
  $(".some-list").append($headerDiv);

  users.forEach(user => {
    $(".some-list").append(formUserInfo(user));
  });
}

function formUserInfo(user) 
{
  let $userBlock = $('<div>').addClass('user-container');
  let $infoBlock = $('<div>').addClass('user-info');
  let $top = $('<div>').addClass('top-block');
  let $bottom = $('<div>').addClass('bottom-block');

  $top.append(`<img src="/img/pfp/${user.pfp}">`);
  console.log();
  $infoBlock.append(`<p><a href='/users/${user.id}/user'>${user.name} ${user.secondName}</a>`);

  $top.append($infoBlock);

  let $

  $bottom.append(`<button id='buttons' onclick='window.location.href="/users/${user.id}/friends";'>Друзья`);
  $bottom.append(`<button id='buttons' onclick='window.location.href="/users/${user.id}/news";'>Новостная лента`);
  $bottom.append(`<button id='buttons' onclick='window.location.href="/users/${user.id}/messages";'>Сообщения`);
  
  $userBlock.append($top);
  $userBlock.append($bottom);
  return $userBlock;
}