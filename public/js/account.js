jQuery(() => {
    let id = window.location.pathname.split('/')[2];
    console.log("get user: " + id);
    $.getJSON(`/users/get-user/${id}`, user => {
      initUserTable(user);
    });
  });

function initUserTable(userParam) 
{
  let user = userParam.shift();
  console.log(user);

  let $img = $(`<img src="/img/avatars/${user.avatar}">`);
  $img.addClass("round-img").addClass("account__img");
  let $name = $(`<a href='/users/${user.id}/user'>${user.name} ${user.secondName}</a>`);
  $name.addClass('account__name').addClass("black-text");
  $(".user-intro").append($img);
  $(".user-intro").append($name);

  let $header = $('<p>').text("Информация").addClass("heading").addClass("black-text");
  let $info = $('<div>').addClass("info-block");
  $birthDate = $('<p>').text(`Дата рождения: ${user.birthDate}`).addClass("text");
  $info.append($birthDate);
  $email = $('<p>').text(`Email: ${user.email}`).addClass("text");
  $info.append($email);
  $role = $('<p>').text(`Роль: ${user.role}`).addClass("text");
  $info.append($role);
  $status = $('<p>').text(`Статус: ${user.status}`).addClass("text");
  $info.append($status);
  $(".user-information").append($header);
  $(".user-information").append($info);

  // $info.append(`<button id='edit' onclick='window.settings_${user.id}.showModal()'>Редактировать`);

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
  // $formDiv.append(`<input type='file' name='avatars'>`);
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