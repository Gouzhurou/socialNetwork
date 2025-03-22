jQuery(() => {
    let id = window.location.pathname.split('/')[2];
    $.getJSON(`/users/get-news/${id}`, (news) => {
        initNewsTable(news);
    });
});

function initNewsTable(news){
    let name = news.shift();
    //console.log(news);
    let $headerDiv = $('<div>').addClass("headerContainer");
    $headerDiv.append("<h1> Новости друзей пользователя " + name);
    $(".usersList").append($headerDiv);
    let $table = $('<table></table>');
    news.forEach(friendNews => {
        let mainID = friendNews.id;
        let posts = friendNews.news;
        posts.forEach(post => {
            let $tr = $('<tr></tr>');
            let $td = $('<td></td>');
            $td.append(formNewsContainer(post, mainID));
            $tr.append($td);
            $table.append($tr);
        });
    });
    $(".usersList").append($table);
}

function formNewsContainer(post, id){
    console.log(post);
    let $postBlock = $('<div>').addClass('postContainer');
    let $msgBlock = $('<div>').addClass('msgContainer');

    if(post.postimg != "-"){
        $postBlock.append(`<img src='/img/posts/${post.postimg}'>`);
    }

    $.getJSON(`/users/get-users`, (users) => {
        for(user of users){
            if(user.id == id){
                $msgBlock.append(`<h3>${post.msg}`);
                $msgBlock.append(`<p>${post.time} | ${post.date} | ${user.name + " " + user.secondName}`);
            }
        }
    });

    $postBlock.append($msgBlock);
    
    return $postBlock;
}