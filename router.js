const express = require("express");
const router = express.Router();

var fs = require("fs").promises
var users = require("./public/json/users.json");
var friends = require("./public/json/friends.json");
var messages = require("./public/json/messages.json");
var news = require("./public/json/news.json");

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/users", (req, res) => {
    res.render("users", {pageName: "Пользователи"});
});

// router.get("/users/:id", (req, res) => {
//     for(let user of users){
//         if(user.id == req.params.id){
//             res.render("user", {pageName: "Пользователь " + user.name + " " + user.secondName});
//         }
//     }
// });

router.get("/users/:id/friends", (req, res) => {
    for(let user of users){
        if(user.id == req.params.id){
            res.render("friends", {pageName: "Друзья " + user.name + " " + user.secondName});
        }
    }
});

router.get("/users/:id/messages", (req, res) => {
    for(let user of users){
        if(user.id == req.params.id){
            res.render("messages", {pageName: "Сообщения " + user.name + " " + user.secondName});
        }
    }
});

router.get("/users/:id/news", (req, res) => {
    for(let user of users){
        if(user.id == req.params.id){
            res.render("news", {pageName: "Новости друзей пользователя " + user.name + " " + user.secondName});
        }
    }
});

router.get("/users/get-users", (req, res) => {
    res.end(JSON.stringify(users));
});

router.get("/users/get-friends/:id", (req, res) => {
    let arr = []
    for(let user of friends){
        if(user.id === req.params.id){
            for(let friendsOwner of users){
                if(req.params.id === friendsOwner.id){
                    arr.push(friendsOwner.name + " " + friendsOwner.secondName);
                    arr.push(friendsOwner.pfp);
                    break;
                }
            }
            for(let friendID of user.friendsID){
                for(let friend of users){
                    if(friend.id === friendID){
                        arr.push(friend);
                        break;
                    }
                }
            }
            break;
        }
    }
    res.end(JSON.stringify(arr));
});

router.get("/users/get-messages/:id", (req, res) => {
    let arr = []
    for(let user of messages){
        if(user.id === req.params.id){
            for(let messagesOwner of users){
                if(req.params.id == messagesOwner.id){
                    arr.push(messagesOwner.name + " " + messagesOwner.secondName);
                    arr.push(messagesOwner.pfp);
                    break;
                }
            }
            arr.push(user.messages);
            break;
        }
    }
    res.end(JSON.stringify(arr));
});

router.get("/users/get-news/:id", (req, res) => {
    let friendsID = [];
    for(let user of friends){
        if(user.id === req.params.id){
            friendsID = user.friendsID;
            break;
        }
    }

    let posts = [];
    for(let user of users){
        if(req.params.id === user.id){
            posts.push(user.name + " " + user.secondName);
            posts.push(user.pfp);
            break;
        }
    }

    for(let id of friendsID){   
        for(let friendPosts of news){
            if(friendPosts.id === id){
                posts = posts.concat(friendPosts);
            }
        }
    }

    res.end(JSON.stringify(posts));
});

router.get("/users/get-all-news/:id", (req, res) => {
    let friendsID = [];
    for(let user of friends){
        if(user.id === req.params.id){
            friendsID = user.friendsID;
            break;
        }
    }

    let posts = [];
    for(let user of news){
        if(req.params.id === user.id){
            for(let userPost of user.news){
                posts = posts.concat({id: user.id, post: userPost});
            }
        }
    }
    for(let id of friendsID){   
        for(let friendPosts of news){
            if(friendPosts.id == id){
                for(let userPost of friendPosts.news){
                    posts = posts.concat({id: id, post: userPost});
                }
            }
        }
    }

    res.end(JSON.stringify(posts));
});


router.post("/users/edit/:id", (req, res) => {
    for(let user of users){
        if(user.id === req.params.id){
            user.name = req.body.name;
            user.secondName = req.body.secondName;
            user.patronymic = req.body.patronymic;
            user.birthDate = req.body.birthDate;
            if(req.body.email.indexOf('@') != -1) user.email = req.body.email;
            if(req.files && Object.keys(req.files).length !== 0){
                const photo = req.files.pfp;
                user.pfp = photo.name;
                photo.mv("./public/img/pfp/" + photo.name);
            }
            user.role = req.body.role;
            user.status = req.body.status;
            fs.writeFile("./public/json/users.json", JSON.stringify(users, null, 2), 'utf8', () => {});
            break;
        }
    }   
    res.redirect('/users');
});

router.post("/users/:userid/remove-message/:msgid", (req, res) => {
    for(msgOwner of messages){
        if(msgOwner.id == req.params.userid){
            for(let i = 0; i < msgOwner.messages.length; i++){
                if(msgOwner.messages[i].id == req.params.msgid){
                    msgOwner.messages.splice(i, 1);
                    fs.writeFile("./public/json/messages.json", JSON.stringify(messages, null, 2), 'utf8', () => {});
                    break;
                }
            }
        }
    }
    res.redirect('/users/' + req.params.userid + "/messages");
});

router.post("/addUser", (req, res) => {
    if(req.body.user){
        let friendsArr = [];
        let messagesArr = [];
        let newsArr = [];

        users.push(req.body.user);
        friends.push({id: req.body.user.id, friendsID: friendsArr});
        messages.push({id: req.body.user.id, messages: messagesArr});
        news.push({id: req.body.user.id, news: newsArr});

        writeUsers();
        writeFriends();
        writeMessages();
        writeNews();
    }
    res.end();
})

router.post("/add-post", upload.single('photo'), (req, res) => {
    let currDate = new Date();
    let name = '';
    if(req.file) name = req.file.originalname;
    for(user of news){
        if(user.id === req.body.id){
            user.news.push({
                msg: req.body.msg,
                postimg: name,
                date: currDate.getFullYear() + '-' + currDate.getMonth() + '-' + currDate.getDate(),
                time: currDate.getHours() + ':' + currDate.getMinutes()
            });
        
            if(req.file) fs.writeFile("./public/img/posts/" + req.file.originalname, req.file.buffer, () => {});
            fs.writeFile("./public/json/news.json", JSON.stringify(news, null, 2), 'utf8', () => {});
        }
    }

    res.end();
})

async function writeUsers(){
    await fs.writeFile("./public/json/users.json", JSON.stringify(users, null, 2), 'utf8', () => {});
}

async function writeFriends(){
    await fs.writeFile("./public/json/friends.json", JSON.stringify(friends, null, 2), 'utf8', () => {});
}

async function writeMessages(){
    await fs.writeFile("./public/json/messages.json", JSON.stringify(messages, null, 2), 'utf8', () => {});
}

async function writeNews(){
    await fs.writeFile("./public/json/news.json", JSON.stringify(news, null, 2), 'utf8', () => {});
}

module.exports = {router, 
    users, 
    friends, 
    messages, 
    news,
    writeUsers,
    writeFriends,
    writeMessages,
    writeNews
};