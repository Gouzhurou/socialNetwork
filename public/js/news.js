jQuery(() => {
  let id = window.location.pathname.split('/')[2];
  $.getJSON(`/users/get-news/${id}`, news => {
    initNewsTable(news);
  });
});

function initNewsTable(news) {
  let name = news.shift();
  let fileName = news.shift();

  let $top = $('<div>').addClass('top-block');
  $top.append(`<img src="/img/pfp/${fileName}">`);
  let $infoBlock = $('<div>').addClass('user-info');
  $infoBlock.append(`<p>${name}`);
  $top.append($infoBlock);
  $(".user-intro").append($top);
  console.log("asasd");

  let $headerDiv = $('<div>').addClass("list-header");
  $headerDiv.append("<p> Новости");
  $(".user-news").append($headerDiv);

  news.forEach(friendNews => {
    let mainID = friendNews.id;
    let posts = friendNews.news;
    posts.forEach(post => {
      $(".user-news").append(formNewsContainer(post, mainID));
    });
  });
}

function formNewsContainer(post, id) {
  let $postBlock = $('<div>').addClass('post-container');
  
  $postBlock.append(getPostHead(id));

  if (post.postimg != "")
  {
    let $postImg = $('<div>').addClass('post-img');
    $postImg.append(`<img src="/img/posts/${post.postimg}">`);
    $postBlock.append($postImg);
  }

  let $postMsg = $('<div>').addClass('msg');
  $postMsg.append(`<p>${post.msg}`);
  $postBlock.append($postMsg);

  let $postDate = $('<div>').addClass('post-info');
  $postDate.append(`<p>${post.date}`);
  $postBlock.append($postDate);
  
  return $postBlock;
}

function getPostHead(id)
{
  let $postHead = $('<div>').addClass('post-head');
  let $postIntro = $('<div>').addClass('post-intro');

  $.getJSON(`/users/get-users`, users => {
    for(let user of users){
      if(user.id == id){
        $postIntro.append(`<img src="/img/pfp/${user.pfp}">`);
        let $infoBlock = $('<div>').addClass('user-info');
        $infoBlock.append(`<p>${user.name} ${user.secondName}`);
        $postIntro.append($infoBlock);
      }
    }
  });

  $postHead.append($postIntro);
  return $postHead;
}