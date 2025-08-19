import {getUserHead} from "./user.js";
import {getPosts} from "./post.js";

jQuery(() => {
  let id = window.location.pathname.split('/')[2];
  console.log("get " + id + " news");
  $.getJSON(`/users/get-news/${id}`, news => {
    getNewsList(news);
  });
});

function getNewsList(news) {
  let id = news.shift();
  let name = news.shift();
  let fileName = news.shift();

  const [$img, $name] = getUserHead(fileName, id, name);
  $(".user-intro").append($img);
  $(".user-intro").append($name);

  let $header = $('<p>').text("Новости").addClass("heading").addClass("black-text");
  $(".user-posts").append($header);

  let $posts = $('<div>').addClass("list");
  getPosts(news, $posts, id);
  $(".user-posts").append($posts);
}
