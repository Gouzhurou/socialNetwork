jQuery(() => {
    let id = window.location.pathname.split('/')[2];
    console.log(id)
    $.getJSON(`/users/get-user/${id}`, user => {
      initUserTable(user);
    });
  });

function initUserTable(userParam) 
{
  let user = userParam.shift();

  let $top = $('<div>').addClass('top-block');
  $top.append(`<img src="/img/pfp/${user.pfp}">`);
  let $infoBlock = $('<div>').addClass('user-info');
  $infoBlock.append(`<p>${user.name} ${user.secondName}`);
  $top.append($infoBlock);
  $(".user-intro").append($top);

  let $infoDiv = $('<div>').addClass("list-header");
  $infoDiv.append("<p> Информация");
  $(".user-information").append($infoDiv);

  let $info = $('<div>').addClass("info-block");
  let $infoText = $('<div>').addClass("info-text");
  $infoText.append(`<p> Дата рождения: ${user.birthDate}`);
  $infoText.append(`<p> Email: ${user.email}`);
  $infoText.append(`<p> Роль: ${user.role}`);
  $infoText.append(`<p> Статус: ${user.status}`);
  $info.append($infoText);

  // $info.append(`<button id='edit' onclick='window.settings_${user.id}.showModal()'>Редактировать`);

  $(".user-information").append($info);

  // let $dialog = $(`<dialog id='settings_${user.id}'>`);
  // let $form = $(`<form action='/users/edit/${user.id}' method='POST' enctype="multipart/form-data">`);
  // let $formDiv = $('<div>').addClass('formDiv');
  // $formDiv.append(`<button id="close" onclick='window.settings_${user.id}.close()' type='reset'>x`);
  // $formDiv.append('<p>ФИО:');
  // $formDiv.append(`<input required name='name' id='name' placeholder='Имя' value=${user.name}>`);
  // $formDiv.append(`<input required name='secondName' id='secondName' placeholder='Фамилия' value=${user.secondName}>`);
  // $formDiv.append(`<input name='patronymic' id='patronymic' placeholder='Отчество' value=${user.patronymic}>`);
  // $formDiv.append('<p>Дата рождения:');
  // $formDiv.append(`<input required type='date' name='birthDate' id='birthDate' value="${user.birthDate}">`);
  // $formDiv.append('<p>E-mail:');
  // $formDiv.append(`<input name='email' id='email' placeholder='e-mail' value=${user.email}>`);
  // $formDiv.append('<p>Фотография профиля:');
  // $formDiv.append(`<input type='file' name='pfp'>`);
  // $formDiv.append('<p>Роль:');
  // let $role = $(`<select id='role' name="role">`);
  // $role.append('<option value="Пользователь">Пользователь');
  // $role.append('<option value="Администратор">Администратор');
  // $role.val(user.role);
  // $formDiv.append($role);
  // $formDiv.append('<p>Статус:');
  // let $status = $(`<select id='status' name="status">`);
  // $status.append('<option value="Не подтвержден">Не подтвержден');
  // $status.append('<option value="Активный">Активный');
  // $status.append('<option value="Заблокированный">Заблокированный');
  // $status.val(user.status);
  // $formDiv.append($status);
  // $formDiv.append('<p>');
  // $formDiv.append(`<button id="sub" type='Submit'>OK`);
  // $form.append($formDiv);
  // $dialog.append($form);
  // $bottom.append($dialog);
}