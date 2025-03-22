jQuery(() => {
    $.getJSON("/users/get-users", (users) => {
        initUsersTable(users);
    });
});

function initUsersTable(users){
    let $headerDiv = $('<div>').addClass("list-header");
    $headerDiv.append("Пользователи");
    $(".some-list").append($headerDiv);
    let $userInfo = $('<table></table>');
    // let $userInfo = $('<div></div>');
    users.forEach(user => {
        let $tr = $('<tr></tr>');
        let $td = $('<td></td>');
        $td.append(formUserInfo(user));
        // $userInfo.append(formUserInfo(user));
        $tr.append($td);
        $userInfo.append($tr);
    });
    // $(".usersList").append($table);
    $(".some-list").append($userInfo)
}

function formUserInfo(user){
    let $userBlock = $('<div>').addClass('user-container');
    let $infoBlock = $('<div>').addClass('user-info');
    let $top = $('<div>').addClass('top-block');
    let $bottom = $('<div>').addClass('bottom-block');

    $top.append(`<img src="/img/pfp/${user.pfp}">`);

    $infoBlock.append(`<h3><a href='/users/${user.id}'>${user.name} ${user.secondName}</a>`);
    // $infoBlock.append(`<p> id: ${user.id}`);
    // $infoBlock.append(`<p> Дата рождения: ${user.birthDate}`);
    // $infoBlock.append(`<p> Email: ${user.email}`);
    // $infoBlock.append(`<p> Роль: ${user.role}`);
    // $infoBlock.append(`<p> Статус: ${user.status}`);

    $top.append($infoBlock);

    // $bottom.append(`<button id='edit' onclick='window.settings_${user.id}.showModal()'>Редактировать`);
    $bottom.append(`<button id='rightButtons' onclick='window.location.href="/users/${user.id}/friends";'>Друзья`);
    $bottom.append(`<button id='rightButtons' onclick='window.location.href="/users/${user.id}/messages";'>Сообщения`);
    $bottom.append(`<button id='rightButtons' onclick='window.location.href="/users/${user.id}/news";'>Новости друзей`);

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

    // $userBlock.append($top);
    // $userBlock.append($bottom);

    return $userBlock;
}