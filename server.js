"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const sio = require("socket.io");
let gameStartCounter = 0;
let player1Name;
let player2Name;
let player1Score;
let player2Score;
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
        else if (gameStartCounter == 2) {
            player2Name = userName;
            socket.broadcast.emit('gameStart', player1Name);
            gameStartCounter = 0;
        }
    });
    socket.on('changePlayer', function (userName) {
        socket.broadcast.emit('changePlayer');
    });
    socket.on('gameEnd', function (score) {
        let winnerscore = 0;
        if (!player1Score) {
            player1Score = parseInt(score);
        }
        else if (!player2Score) {
            player2Score = parseInt(score);
            if (player1Score > player2Score) {
                winnerscore = player1Score;
            }
            else if (player1Score < player2Score) {
                winnerscore = player2Score;
            }
            else {
                socket.broadcast.emit("gameEnd", 0);
            }
            socket.broadcast.emit('gameEnd', winnerscore);
            socket.emit('gameEnd', winnerscore);
        }
    });
    socket.on('placedTile', function (elmId, value) {
        socket.broadcast.emit('placedTile', elmId, value);
        socket.emit('placedTile', elmId, value);
    });
});
