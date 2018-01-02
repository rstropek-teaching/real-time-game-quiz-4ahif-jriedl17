"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const sio = require("socket.io");
let gameStartCounter = 0;
let player1Name;
let player2Name;
const app = express();
app.use(express.static(__dirname));
const server = http.createServer(app);
server.listen(3000);
sio(server).on('connection', function (socket) {
    socket.emit('greet', ': Welcome to Scrabble Online');
    socket.on('gameStart', function (userName) {
        gameStartCounter++;
        if (gameStartCounter == 1) {
            player1Name = userName;
        }
        console.log(gameStartCounter);
        if (gameStartCounter == 2) {
            player2Name = userName;
            //socket.broadcast.emit('gameStart', player1Name);
            socket.broadcast.emit('gameStart', player1Name);
        }
    });
    socket.on('changePlayer', function (userName) {
        socket.broadcast.emit('changePlayer');
    });
    socket.on('gameEnd', function () {
        console.log("gameEnd");
        socket.broadcast.emit('gameEnd');
        socket.emit('gameEnd');
    });
    socket.on('placedTile', function (elmId, value) {
        socket.broadcast.emit('placedTile', elmId, value);
        socket.emit('placedTile', elmId, value);
    });
});
