import express from "express";
const router = express.Router();

import fs from "fs";
import path from "path";
import { readFile } from "fs/promises";
const users = JSON.parse(await readFile(new URL("./public/json/users.json", import.meta.url)));
const friends = JSON.parse(await readFile(new URL("./public/json/friends.json", import.meta.url)));
const messages = JSON.parse(await readFile(new URL("./public/json/messages.json", import.meta.url)));
const news = JSON.parse(await readFile(new URL("./public/json/posts.json", import.meta.url)));

import multer from "multer";
const upload = multer({ dest: "./public/img" });

router.get("/users", (req, res) => {
    res.render("users", {pageName: "Пользователи"});
});

router.get("/users/:id/user", (req, res) => {
    for(let user of users){
        if(user.id == req.params.id){
            res.render("account", {pageName: "Пользователь " + user.name + " " + user.secondName});
        }
    }
});

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
            res.render("news", {pageName: "Новостная лента " + user.name + " " + user.secondName});
        }
    }
});

router.get("/users/get-users", (req, res) => {
    res.end(JSON.stringify(users));
});

router.get("/users/get-user/:id", (req, res) => {
    let arr = []
    for(let user of users){
        if(user.id === req.params.id){
            arr.push(user);
            break;
        }
    }

    for(let user of news){
        if(user.id === req.params.id){
            arr.push(user.news);
            break;
        }
    }

    res.end(JSON.stringify(arr));
});

router.get("/users/get-friends/:id", (req, res) => {
    let arr = []
    for(let user of friends){
        if(user.id === req.params.id){
            for(let friendsOwner of users){
                if(req.params.id === friendsOwner.id){
                    arr.push(friendsOwner.id);
                    arr.push(friendsOwner.name + " " + friendsOwner.secondName);
                    arr.push(friendsOwner.avatar);
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
    let arr = [];

    // get user info
    for(let user of users){
        if(req.params.id === user.id){
            arr.push(user.id);
            arr.push(user.name + " " + user.secondName);
            arr.push(user.avatar);
            break;
        }
    }

    // get messages
    let messagesList = [];
    for(let user of messages){
        for(let message of user.messages){
            if(message.receiverID === req.params.id){
                messagesList.push(message);
            }
        }
    }
    arr.push(messagesList);

    res.end(JSON.stringify(arr));
});

router.get("/users/get-news/:id", (req, res) => {
    // get user friends
    let friendsID = [];
    for(let user of friends){
        if(user.id === req.params.id){
            friendsID = user.friendsID;
            break;
        }
    }

    // get user info
    let posts = [];
    for(let user of users){
        if(req.params.id === user.id){
            posts.push(user.id);
            posts.push(user.name + " " + user.secondName);
            posts.push(user.avatar);
            break;
        }
    }

    // get friends posts
    for(let id of friendsID){   
        for(let friend of news){
            if(friend.id === id){
                posts = posts.concat(friend);
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


router.post("/users/edit/:id", upload.single('avatar'), (req, res) => {
    for(let user of users){
        if(user.id === req.params.id){
            user.name = req.body.name;
            user.secondName = req.body.secondName;
            user.birthDate = req.body.birthDate;
            user.email = req.body.email;
            if (req.file){
                const tempPath = req.file.path;
                const targetDir = "./public/img/avatars/";
                const fileExt = path.extname(req.file.originalname);
                const newFileName = `avatar_${req.params.id}${fileExt}`;
                const targetPath = path.join(targetDir, newFileName);
                fs.rename(tempPath, targetPath, (err) => {
                    if (err) {
                        console.error("Ошибка перемещения файла:", err);
                        return res.status(500).send("Ошибка сервера");
                    }
                    user.avatar = newFileName;
                });
            }
            user.role = req.body.role;
            user.status = req.body.status;
            fs.writeFile("./public/json/users.json", JSON.stringify(users, null, 2), 'utf8', () => {});
            break;
        }
    }   
    res.redirect(`/users/${req.params.id}/user`);
});

router.post("/users/:senderid/messages/:msgid", (req, res) => {
    let receiverID = "";
    for(user of messages){
        if(user.id == req.params.senderid){
            for(let i = 0; i < user.messages.length; i++){
                if(user.messages[i].id == req.params.msgid){
                    receiverID = user.messages[i].receiverID;
                    user.messages.splice(i, 1);
                    fs.writeFile("./public/json/messages.json", JSON.stringify(messages, null, 2), 'utf8', () => {});
                    break;
                }
            }
        }
    }
    res.redirect(`/users/${receiverID}/messages`);
});

router.post("/users/:userid/:ownerid/news/:newsid", (req, res) => {
    for(userNews of news){
        if(userNews.id == req.params.ownerid){
            for(let i = 0; i < userNews.news.length; i++){
                if(userNews.news[i].id == req.params.newsid){
                    userNews.news.splice(i, 1);
                    fs.writeFile("./public/json/posts.json", JSON.stringify(news, null, 2), 'utf8', () => {});
                    break;
                }
            }
        }
    }
    res.redirect('/users/' + req.params.userid + "/news");
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
            fs.writeFile("./public/json/posts.json", JSON.stringify(news, null, 2), 'utf8', () => {});
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
    await fs.writeFile("./public/json/posts.json", JSON.stringify(news, null, 2), 'utf8', () => {});
}

export {
    router,
    users,
    friends,
    messages,
    news,
    writeUsers,
    writeFriends,
    writeMessages,
    writeNews
};