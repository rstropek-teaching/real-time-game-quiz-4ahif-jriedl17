import * as express from 'express';
import * as http from 'http';
import * as sio from 'socket.io';

let gameStartCounter = 0;
let player1Name: string;
let player2Name: string;
let player1Score : number;
let player2Score : number;
const app = express();
app.use(express.static(__dirname));
const server = http.createServer(app);
server.listen(3000);

sio(server).on('connection', function (socket) {

    socket.emit('greet', ': Welcome to Scrabble Online');

    socket.on('gameStart', function (userName: string) {
        gameStartCounter++;
        if (gameStartCounter == 1) {
            player1Name = userName;
        } else if (gameStartCounter == 2) {
            player2Name = userName;
            socket.broadcast.emit('gameStart', player1Name);
            gameStartCounter = 0;
        }
    });

    socket.on('changePlayer', function (userName: string) {
        socket.broadcast.emit('changePlayer');
    });

    socket.on('gameEnd', function (score : string) {
        let winnerscore : number = 0;

        if(!player1Score){
            player1Score = parseInt(score);
        }else if(!player2Score){
            player2Score = parseInt(score);
            if(player1Score > player2Score){
                winnerscore = player1Score;
            }else if(player1Score < player2Score){
                winnerscore = player2Score;
            }else{
                socket.broadcast.emit("gameEnd", 0);
            }
            socket.broadcast.emit('gameEnd',winnerscore);
            socket.emit('gameEnd', winnerscore);
        }
    });

    socket.on('placedTile', function (elmId: number, value: any) {
        socket.broadcast.emit('placedTile', elmId, value);
        socket.emit('placedTile', elmId, value);
    });

});




