jQuery(() => {
  let id = window.location.pathname.split('/')[2];
  $.getJSON(`/users/get-messages/${id}`, messages => {
    initMessagesTable(messages);
  });
});

function initMessagesTable(messages) {
  let name = messages.shift();
  let fileName = messages.shift();

  let $top = $('<div>').addClass('top-block');
  $top.append(`<img src="/img/avatars/${fileName}">`);
  let $infoBlock = $('<div>').addClass('user-info');
  $infoBlock.append(`<p>${name}`);
  $top.append($infoBlock);
  $(".user-intro").append($top);

  let $headerDiv = $('<div>').addClass("list-header");
  $headerDiv.append("<p> Сообщения");
  $(".user-msgs").append($headerDiv);

  messages[0].forEach(message => {
    $(".user-msgs").append(formMessage(message));
  });
}

function formMessage(message) {
  let $msgBlock = $('<div>').addClass('msg-block');
  let $msgIntro = $('<div>').addClass('top-block');
  
  $.getJSON(`/users/get-users`, users => {
    console.log("json");
    for(let user of users){
      if(user.id == message.receiverID){
        console.log("user", user.id);
        $msgIntro.append(`<img src="/img/avatars/${user.avatar}">`);

        let $msgBox = $('<div>').addClass('msg-box');

        let $infoBlock = $('<div>').addClass('user-info');
        $infoBlock.append(`<p>${user.name} ${user.secondName}`);
        $msgBox.append($infoBlock);

        let $msgText = $('<div>').addClass('message');
        $msgText.append(`<p>${message.msg}`);
        $msgBox.append($msgText);

        $msgIntro.append($msgBox);
      }
    }
  });

  $msgBlock.append($msgIntro);

  let id = window.location.pathname.split('/')[2];
  let $removeForm = $(`<form action='/users/${id}/messages/${message.id}' method="POST">`);
  $removeForm.append(`<button id="delete-msg" onclick>Удалить`);
  
  $msgBlock.append($removeForm);

  return $msgBlock;
}