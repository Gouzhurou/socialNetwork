jQuery(() => {
    let id = window.location.pathname.split('/')[2];
    $.getJSON(`/users/get-messages/${id}`, (messages) => {
        initMessagesTable(messages);
    });
});

function initMessagesTable(messages){ 
    let name = messages.shift();
    let $headerDiv = $('<div>').addClass("headerContainer");
    $headerDiv.append("<h1> Сообщения пользователя " + name);
    $(".usersList").append($headerDiv);
    let $table = $('<table></table>');
    console.log(messages);
    messages[0].forEach(message => {
        let $tr = $('<tr></tr>');
        let $td = $('<td></td>');
        $td.append(formMessage(message));
        $tr.append($td);
        $table.append($tr);
    });
    $(".usersList").append($table);
}

function formMessage(message){
    let $userBlock = $('<div>').addClass('userContainer');
    let $messageBlock = $('<div>').addClass('messageBlock');
    let $timeBlock = $('<div>').addClass('timeBlock');


    $messageBlock.append(`<h2>${message.msg}`);

    $.getJSON(`/users/get-users`, (users) => {
        for(user of users){
            if(user.id == message.recieverID){
                $timeBlock.append(`<p>${message.time} | ${message.date} | => ${user.name + " " + user.secondName}`);
            }
        }
    });

    let id = window.location.pathname.split('/')[2];
    let $removeForm = $(`<form action='/users/${id}/messages/${message.id}' method="DELETE">`);
     
    $removeForm.append(`<button id="deleteMsg" onclick>Удалить`);

    $userBlock.append($messageBlock);
    $userBlock.append($timeBlock);
    $userBlock.append($removeForm);

    return $userBlock;
}