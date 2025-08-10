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

  let $img = $(`<img src="/img/avatars/${fileName}">`);
  $img.addClass("round-img").addClass("account__img");
  let $name = $(`<a href='/users/${id}/user'>${name}</a>`);
  $name.addClass('account__name').addClass("black-text");
  $(".user-intro").append($img);
  $(".user-intro").append($name);

  let $header = $('<p>').text("Друзья").addClass("heading").addClass("black-text");
  $(".users-list").append($header);

  let $users = $('<div>').addClass("list");
  users.forEach(user => {
    $users.append(getUserInfo(user));
  });

  $(".users-list").append($users);
}

function getUserInfo(user)
{
  let $user = $('<div>').addClass('user');

  let $top = $('<div>').addClass('user__info');
  let $img = $(`<img src="/img/avatars/${user.avatar}">`);
  $img.addClass('round-img').addClass('user__img');
  $top.append($img);
  let $name = $(`<a href='/users/${user.id}/user'>${user.name} ${user.secondName}</a>`);
  $name.addClass('user__name').addClass("black-text")
  $top.append($name);

  let $bottom = $('<div>').addClass('user__buttons');
  let $friends = $(`<button onclick='window.location.href="/users/${user.id}/friends";'>Друзья</button>`);
  $friends.addClass("button").addClass("black-text");
  $bottom.append($friends);
  let $news = $(`<button onclick='window.location.href="/users/${user.id}/news";'>Новостная лента</button>`);
  $news.addClass("button").addClass("black-text");
  $bottom.append($news);
  let $massages = $(`<button onclick='window.location.href="/users/${user.id}/messages";'>Сообщения</button>`);
  $massages.addClass("button").addClass("black-text");
  $bottom.append($massages);

  $user.append($top);
  $user.append($bottom);
  return $user;
}