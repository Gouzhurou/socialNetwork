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
    const user = users.find(user => user.id == req.params.id);
    if (user) {
        res.render("account", {
            pageName: `Пользователь ${user.name} ${user.secondName}`
        });
    }
});

router.get("/users/:id/friends", (req, res) => {
    const user = users.find(user => user.id == req.params.id);
    if (user) {
        res.render("friends", {
            pageName: `Друзья ${user.name} ${user.secondName}`
        });
    }
});

router.get("/users/:id/messages", (req, res) => {
    const user = users.find(user => user.id == req.params.id);
    if (user) {
        res.render("messages", {
            pageName: `Сообщения ${user.name} ${user.secondName}`
        });
    }
});

router.get("/users/:id/news", (req, res) => {
    const user = users.find(user => user.id == req.params.id);
    if (user) {
        res.render("news", {
            pageName: `Новостная лента ${user.name} ${user.secondName}`
        });
    }
});

router.get("/users/get-users", (req, res) => {
    res.end(JSON.stringify(users));
});

router.get("/users/get-user/:id", (req, res) => {
    let result = [];

    const user = users.find(user => user.id == req.params.id);
    if (user) {
        result.push(user);
    }

    result = result.concat(getUserInfo(req.params.id));
    const userNews = news.find(user => user.id == req.params.id).news;
    if (userNews) {
        result = result.concat(userNews);
    }

    res.end(JSON.stringify(result));
});

function getUserInfo(id) {
    let result = [];

    const user = users.find(user => user.id == id);
    if (user) {
        result.push(user.id);
        result.push(`${user.name} ${user.secondName}`);
        result.push(user.avatar);
    }

    return result;
}

function getFriendsID(id) {
    return friends.find(user => user.id == id).friendsID;
}

router.get("/users/get-friends/:id", (req, res) => {
    let result = getUserInfo(req.params.id);

    const friendsID = getFriendsID(req.params.id);
    for(let friendID of friendsID) {
        const friend = users.find(user => user.id == friendID);
        if (friend) {
            result.push(friend);
        }
    }

    res.end(JSON.stringify(result));
});

router.get("/users/get-messages/:id", (req, res) => {
    let result = getUserInfo(req.params.id);

    // get messages
    result = result.concat(
        messages.flatMap(user =>
            user.messages.filter(message => message.receiverID === req.params.id)
        )
    );

    res.end(JSON.stringify(result));
});

router.get("/users/get-friends-news/:id", (req, res) => {
    let posts = getUserInfo(req.params.id);

    let friendsID = getFriendsID(req.params.id);
    posts = posts.concat(news.filter(user => friendsID.includes(user.id)));

    res.end(JSON.stringify(posts));
});

router.get("/users/get-news/:id", (req, res) => {
    let posts = getUserInfo(req.params.id);

    posts = posts.concat(news.find(user => user.id == req.params.id).news);

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
    const user = messages.find(user => user.id == req.params.senderid);
    if (!user) return res.status(404).send({error: "User not found"});

    const messageIndex = user.messages.findIndex(msg => msg.id == req.params.msgid);
    if (messageIndex === -1) return res.status(404).send({error: "Message not found"});

    const receiverID = user.messages[messageIndex].receiverID;
    user.messages.splice(messageIndex, 1);

    fs.writeFile("./public/json/messages.json", JSON.stringify(messages, null, 2), 'utf8', () => {});

    return res.status(200).send({
        getJSONurl: `/users/get-messages/${receiverID}`,
        userid: receiverID
    });
});

router.post("/users/:userid/:ownerid/news/:newsid", (req, res) => {
    const user = news.find(user => user.id == req.params.ownerid);
    if (!user) return res.status(404).send({error: "User not found"});

    const newsIndex = user.news.findIndex(news => news.id == req.params.newsid);
    if (newsIndex === -1) return res.status(404).send({error: "News not found"});

    user.news.splice(newsIndex, 1);

    fs.writeFile("./public/json/posts.json", JSON.stringify(news, null, 2), 'utf8', () => {});

    return res.status(200).json({
        getJSONurl: `/users/get-friends-news/${req.params.userid}`,
        userid: req.params.userid
    });
});

router.post("/users/:userid/news/:newsid", (req, res) => {
    const user = news.find(user => user.id == req.params.userid);
    if (!user) return res.status(404).send({error: "User not found"});

    const newsIndex = user.news.findIndex(news => news.id == req.params.newsid);
    if (newsIndex === -1) return res.status(404).send({error: "News not found"});

    user.news.splice(newsIndex, 1);

    fs.writeFile("./public/json/posts.json", JSON.stringify(news, null, 2), 'utf8', () => {});

    return res.status(200).json({
        getJSONurl: `/users/get-news/${req.params.userid}`,
        userid: req.params.userid
    });
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