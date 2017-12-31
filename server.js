"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const sio = require("socket.io");
let randomGameStartTile1;
let randomGameStartTile2;
let playercounter = 0;
const app = express();
app.use(express.static(__dirname));
const server = http.createServer(app);
server.listen(3000);
sio(server).on('connection', function (socket) {
    socket.emit('greet', ': Welcome to Scrabble Online');
    socket.on('placedTile', function (elmId, value) {
        socket.broadcast.emit('placedTile', elmId, value);
        socket.emit('placedTile', elmId, value);
    });
    socket.on('Gam', function (tile) {
        if (randomGameStartTile1 && !randomGameStartTile2) {
            randomGameStartTile1 = tile;
        }
        else if (!randomGameStartTile1 && randomGameStartTile2) {
            randomGameStartTile2 = tile;
        }
        else {
            if (randomGameStartTile1.charCodeAt(0) - ('A').charCodeAt(0) < randomGameStartTile2.charCodeAt(0) - ('A').charCodeAt(0)) {
            }
        }
        socket.emit('randomGameStartNumber', "Your random tile is: " + tile);
    });
});
