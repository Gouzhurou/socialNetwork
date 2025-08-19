export function getPosts(posts, $posts, id) {
    posts.forEach(friendNews => {
        let postOwnerID = friendNews.id;
        let posts = friendNews.news;
        posts.forEach(post => {
            $posts.append(
                getPost(
                    getPosts,
                    post,
                    postOwnerID,
                    `/users/${id}/${postOwnerID}/news/${post.id}`,
                    post.img != ""
                )
            );
        });
    });
}

export function getMessages(messages, $messages, id) {
    messages.forEach(message => {
        $messages.append(
            getPost(
                getMessages,
                message,
                message.senderID,
                `/users/${message.senderID}/messages/${message.id}`
            )
        );
    });
}

function getPost(getFunction, post, postOwnerID, url, hasImg) {
    let $post = $('<div>').addClass('post');

    // get post head
    let $postHead = getPostHead($post, postOwnerID, url, getFunction);
    $post.append($postHead);

    // get post image
    if (hasImg)
    {
        let $postImgContainer = $('<div>').addClass('post__img-container');
        let $postImg = $(`<img src="/img/posts/${post.img}">`).addClass('post__img');
        $postImgContainer.append($postImg);
        $post.append($postImgContainer);
    }

    // get post text
    let $postMsg = $('<p>').text(`${post.msg}`).addClass('text');
    $post.append($postMsg);

    // get post date
    let $postDate = $('<div>').addClass('post__date-container');
    let $date = $('<p>').text(`${post.date} ${post.time}`);
    $date.addClass('text').addClass('post__date');
    $postDate.append($date);
    $post.append($postDate);

    return $post;
}

function getPostHead(post, ownerID, url, getFunction)
{
    let $postHead = $('<div>').addClass('row');
    let $postIntro = $('<div>').addClass('post__intro');

    $.getJSON(`/users/get-users`, users => {
        for(let user of users){
            if(user.id == ownerID){
                let $img = $(`<img src="/img/avatars/${user.avatar}">`);
                $img.addClass('round-img').addClass('post__user-img');
                $postIntro.append($img);
                let $name = $(`<a href='/users/${user.id}/user'>${user.name} ${user.secondName}</a>`);
                $name.addClass('user__name').addClass("black-text");
                $postIntro.append($name);
            }
        }
    });

    let $removeForm = $(`<form>`);

    $postHead.append($postIntro);
    let $removeBtn = $(`<button type="button">Удалить</button>`);
    $removeBtn.addClass("button");

    setAction($removeBtn, url, getFunction);
    $removeForm.append($removeBtn);
    $postHead.append($removeForm);

    return $postHead;
}

function setAction(button, url, getFunction) {
    button.on('click', function(event) {
        event.preventDefault(); // Отменяем стандартное поведение
        if (confirm("Вы уверены, что хотите удалить пост?")) {
            $.ajax({
                url: url,
                type: 'POST',
                success: function(response) {
                    $('.list').empty();
                    $.getJSON(response.getJSONurl, function(posts) {
                        let id = posts.shift();
                        let name = posts.shift();
                        let fileName = posts.shift();
                        getFunction(posts, $('.list'), response.userid);
                    });
                },
                error: function(error) {
                    console.error("Ошибка при удалении:", error);
                    alert("Не удалось удалить пост.");
                }
            });
        }
    });
}