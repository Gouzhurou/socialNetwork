export function getPost(post, postOwnerID, action, hasImg) {
    let $post = $('<div>').addClass('post');

    // get post head
    let $postHead = getPostHead($post, postOwnerID, action);
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

function getPostHead(post, ownerID, action)
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

    $postHead.append($postIntro);

    let $removeForm = $(`<form action='${action}' method="POST">`);
    let $removeBtn = $(`<button onclick>Удалить</button>`);
    $removeBtn.addClass("button");
    $removeForm.append($removeBtn);
    $postHead.append($removeForm);

    return $postHead;
}