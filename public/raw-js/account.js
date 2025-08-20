import {getUserHead} from "./user.js";
import {getPosts} from "./post.js";

jQuery(() => {
    let id = window.location.pathname.split('/')[2];
    console.log("get " + id + " account");
    $.getJSON(`/users/get-user/${id}`, user => {
      initUserTable(user);
    });
  });

function initUserTable(userParam) 
{
  let user = userParam.shift();

  const [$img, $name] = getUserHead(user.avatar, user.id, user.name + " " + user.secondName);
  $(".user-intro").append($img);
  $(".user-intro").append($name);

  let $header = $('<p>').text("Информация").addClass("heading").addClass("black-text");
  $(".user-information").append($header);

  let $row = $('<div>').addClass("row");

  let $info = getInfo(user);
  $row.append($info);

  let $button = $(`<button id='edit' onclick='window.settings_${user.id}.showModal()'>Редактировать</button>`);
  $button.addClass("button");
  $row.append($button);

  let $dialog = getForm(user);
  $row.append($dialog);

  $(".user-information").append($row);

  $header = $('<p>').text("Новости").addClass("heading").addClass("black-text");
  $(".user-posts").append($header);

  let id = userParam.shift();
  let name = userParam.shift();
  let fileName = userParam.shift();

  let $posts = $('<div>').addClass("list");
  getPosts(userParam, $posts, user.id);
  $(".user-posts").append($posts);
}

function getInfo(user)
{
  let $info = $('<div>').addClass("info-block");

  let $birthDate = $('<p>').text(`Дата рождения: ${user.birthDate}`).addClass("text");
  $info.append($birthDate);
  let $email = $('<p>').text(`Email: ${user.email}`).addClass("text");
  $info.append($email);
  let $role = $('<p>').text(`Роль: ${user.role}`).addClass("text");
  $info.append($role);
  let $status = $('<p>').text(`Статус: ${user.status}`).addClass("text");
  $info.append($status);

  return $info;
}

function getForm(user)
{
  let $dialog = $(`<dialog id='settings_${user.id}'>`).addClass("white-block").addClass("user-settings");
  let $form = $(`<form action='/users/edit/${user.id}' method='POST' enctype="multipart/form-data">`);

  let $closeButtonBlock = $('<div>').addClass("close-button-block");
  let $closeButton = $(`<button onclick='window.settings_${user.id}.close()' type='reset'>×</button>`);
  $closeButton.addClass("button").addClass("close-button");
  $closeButtonBlock.append($closeButton);
  $form.append($closeButtonBlock);

  let $list = $('<div>').addClass("info-block");

  let $nameFieldName = $('<p>').text("Имя").addClass("text").addClass("user-settings__field-name");
  $list.append($nameFieldName);
  let $nameInput = $(`<input required name='name' placeholder='Имя' value=${user.name}>`);
  $nameInput.addClass("user-settings__input").addClass("text");
  $list.append($nameInput);

  let $secondNameFieldName = $('<p>').text("Фамилия").addClass("text").addClass("user-settings__field-name");
  $list.append($secondNameFieldName);
  let $secondNameInput = $(`<input required name='secondName' placeholder='Фамилия' value=${user.secondName}>`);
  $secondNameInput.addClass("user-settings__input").addClass("text");
  $list.append($secondNameInput);

  let $birthFieldName = $('<p>').text("Дата рождения").addClass("text").addClass("user-settings__field-name");
  $list.append($birthFieldName);
  let $birthInput = $(`<input required type='date' name='birthDate' value="${user.birthDate}">`);
  $birthInput.addClass("user-settings__input").addClass("text");
  $list.append($birthInput);

  let $emailFieldName = $('<p>').text("E-mail").addClass("text").addClass("user-settings__field-name");
  $list.append($emailFieldName);
  let $emailInput = $(`<input type='email' name='email' placeholder='e-mail' value=${user.email}>`);
  $emailInput.addClass("user-settings__input").addClass("text");
  $list.append($emailInput);

  let $imgFieldName = $('<p>').text("Фотография профиля").addClass("text").addClass("user-settings__field-name");
  $list.append($imgFieldName);
  let $imgInput = $(`<input type='file' name='avatar'>`);
  $imgInput.addClass("user-settings__input").addClass("text");
  $list.append($imgInput);

  let $roleFieldName = $('<p>').text("Роль").addClass("text").addClass("user-settings__field-name");
  $list.append($roleFieldName);
  let $selectRole = $(`<select name="role">`).addClass("user-settings__input").addClass("text");
  $selectRole.append('<option value="Пользователь">Пользователь');
  $selectRole.append('<option value="Администратор">Администратор');
  $selectRole.val(user.role);
  $list.append($selectRole);

  let $statusFieldName = $('<p>').text("Статус").addClass("text").addClass("user-settings__field-name");
  $list.append($statusFieldName);
  let $selectStatus = $(`<select name="status">`).addClass("user-settings__input").addClass("text");
  $selectStatus.append('<option value="Не подтвержден">Не подтвержден');
  $selectStatus.append('<option value="Активный">Активный');
  $selectStatus.append('<option value="Заблокированный">Заблокированный');
  $selectStatus.val(user.status);
  $list.append($selectStatus);

  let $submitButton = $(`<button type='Submit'>OK</button>`).addClass("button").addClass("submit-button");
  $list.append($submitButton);

  $form.append($list);
  $dialog.append($form);

  return $dialog;
}
