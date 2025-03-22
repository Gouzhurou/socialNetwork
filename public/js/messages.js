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
  $top.append(`<img src="/img/pfp/${fileName}">`);
  let $infoBlock = $('<div>').addClass('user-info');
  $infoBlock.append(`<p>${name}`);
  $top.append($infoBlock);
  $(".user-intro").append($top);
  console.log("asasd");

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
    for(let user of users){
      if(user.id == message.recieverID){
        $msgIntro.append(`<img src="/img/pfp/${user.pfp}">`);

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
  // $messageBlock.append(`<h2>${message.msg}`);
  // $.getJSON(`/users/get-users`, users => {
  //   for (user of users) {
  //     if (user.id == message.recieverID) {
  //       $timeBlock.append(`<p>${message.time} | ${message.date} | => ${user.name + " " + user.secondName}`);
  //     }
  //   }
  // });
  // let id = window.location.pathname.split('/')[2];
  // let $removeForm = $(`<form action='/users/${id}/remove-message/${message.id}' method="POST">`);
  // $removeForm.append(`<button id="deleteMsg" onclick>Удалить`);
  // $userBlock.append($messageBlock);
  // $userBlock.append($timeBlock);
  // $userBlock.append($removeForm);
  return $msgBlock;
}