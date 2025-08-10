jQuery(() => {
  let id = window.location.pathname.split('/')[2];
  console.log("get user: " + id);
  $.getJSON(`/users/get-news/${id}`, news => {
    initNewsTable(news);
  });
});

function initNewsTable(news) {
  let id = news.shift();
  let name = news.shift();
  let fileName = news.shift();

  let $img = $(`<img src="/img/avatars/${fileName}">`);
  $img.addClass("account__img");
  let $name = $(`<a href='/users/${id}/user'>${name}</a>`);
  $name.addClass('account__name').addClass("black-text");
  $(".user-intro").append($img);
  $(".user-intro").append($name);

  let $header = $('<p>').text("Новости").addClass("heading").addClass("black-text");
  $(".user-posts").append($header);

  let $news = $('<div>').addClass("list");
  news.forEach(friendNews => {
    let mainID = friendNews.id;
    let posts = friendNews.news;
    posts.forEach(post => {
      $news.append(getNews(post, mainID, id));
    });
  });
  $(".user-posts").append($news);
}

function getNews(post, ownerID, userID) {
  let $post = $('<div>').addClass('post');

  $post.append(getPostHead(post, ownerID, userID));

  if (post.postimg != "")
  {
    $postImgContainer = $('<div>').addClass('post__img-container');
    $postImg = $(`<img src="/img/posts/${post.postimg}">`).addClass('post__img')
    $postImgContainer.append($postImg);
    $post.append($postImgContainer);
  }

  let $postMsg = $('<p>').text(`${post.msg}`).addClass('text');
  $post.append($postMsg);

  let $postDate = $('<div>').addClass('post__date-container');
  let $date = $('<p>').text(`${post.date}`).addClass('text').addClass('post__date');
  $postDate.append($date);
  $post.append($postDate);
  
  return $post;
}

function getPostHead(post, ownerID, userID)
{
  let $postHead = $('<div>').addClass('post__header');
  let $postIntro = $('<div>').addClass('post__intro');

  $.getJSON(`/users/get-users`, users => {
    for(let user of users){
      if(user.id == ownerID){
        let $img = $(`<img src="/img/avatars/${user.avatar}">`).addClass('post__user-img');
        $postIntro.append($img);
        let $name = $(`<a href='/users/${user.id}/user'>${user.name} ${user.secondName}</a>`);
        $name.addClass('user__name').addClass("black-text")
        $postIntro.append($name);
      }
    }
  });

  $postHead.append($postIntro);

  let $removeForm = $(`<form action='/users/${userID}/${ownerID}/news/${post.id}' method="POST">`);
  let $removeBtn = $(`<button onclick>Удалить</button>`);
  $removeBtn.addClass("button").addClass("black-text");
  $removeForm.append($removeBtn);
  $postHead.append($removeForm);

  return $postHead;
}