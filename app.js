import express from 'express';
import path from 'path';
import { router } from './router.js';
import bodyParser from 'body-parser';
import http from 'http';
import https from 'https';
import fs from 'fs';
import cors from 'cors';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';

const app = express();

const corsOptions = { 
    'credentials': true, 
    'origin': true, 
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    'allowedHeaders': 'Authorization,X-Requested-With,X-HTTPMethod-Override,Content-Type,Cache-Control,Accept'}

app.use(cors(corsOptions));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/jquery-ui', express.static(__dirname + '/node_modules/jquery-ui/dist/'));
app.use('/', router);

const privateKey = fs.readFileSync('public/ssl/example.key', 'utf-8');
const certificate = fs.readFileSync('public/ssl/example.crt', 'utf-8');

const credentials = {
    key: privateKey,
    cert: certificate
};

const httpApp = http.createServer(app);
const io = new Server(httpApp, {
    cors: {
      origin: true,  
      methods: ['GET', 'POST'],
      credentials: true,
    }
  });

export { app, io };

io.on('connection', (socket) => {
  console.log('Пользователь подключился:', socket.id);

  socket.on('newsUpdated', news => {
    console.log(news);
    io.emit('getNewsUpdates', news)
  })

  socket.on('disconnect', () => {
    console.log('Пользователь отключился:', socket.id);
  });
});

var httpsApp = https.createServer(credentials, app);

httpApp.listen(8080);
httpsApp.listen(8443, () => {
    console.log('Server started on https://localhost:8443/users');
});