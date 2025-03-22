jQuery(() => {
    let id = window.location.pathname.split('/')[2];
    $.getJSON(`/users/get-user/${id}`, user => {
      initUserTable(user);
    });
  });

function initUserTable(user) 
{
    $(".user-intro").append()
  let $headerDiv = $('<div>').addClass("list-header");
  $headerDiv.append("<p> Пользователи");
  $(".some-list").append($headerDiv);
  users.forEach(user => {
    $(".some-list").append(formUserInfo(user));
  });
  $(".some-list").append($table);
}