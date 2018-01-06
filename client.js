"use strict";
// needed Classes
class Tile {
    constructor(val, pts) {
        this.value = val;
        this.points = pts;
    }
    getValue() {
        return this.value;
    }
    getPoints() {
        return this.points;
    }
    toString() {
        return "" + this.value;
    }
}
class ScrabbleBag {
    // 10 Pts.: X(1 time), Q(1 time)
    // 8 Pts.: J(1 time), Y(1 time), Z(1 time)
    // 4 Pts.: V(2 times), W(2 times)
    // 3 Pts: M(3 times), C(2 times), H(3 times), F(2 times), P(2 times), K(2 times), B(2 times)
    // 2 Pts.: L(3 times), G(3 times), D(4 times), Ö(1 time), Ä(1 time), Ü(1 time)
    // 1 Pts.: S(6 times), N(8 times), E(14 times), I(8 times), R(6 times), U(3 times); A(6 times), T(6 times), O(3 times)
    constructor() {
        this.tiles = new Array();
        this.points = {
            "A": 1,
            "B": 3,
            "C": 4,
            "D": 2,
            "E": 1,
            "F": 4,
            "G": 2,
            "H": 2,
            "I": 1,
            "J": 6,
            "K": 2,
            "L": 3,
            "M": 3,
            "N": 1,
            "O": 2,
            "P": 4,
            "Q": 10,
            "R": 1,
            "S": 1,
            "T": 1,
            "U": 1,
            "V": 6,
            "W": 3,
            "X": 8,
            "Y": 10,
            "Z": 3,
            "Ä": 6,
            "Ü": 6,
            "Ö": 8
        };
        //10 Points
        this.pushTile('X', 10, 1);
        this.pushTile('Q', 10, 1);
        //8 Points
        this.pushTile('J', 8, 1);
        this.pushTile('Y', 8, 1);
        this.pushTile('Z', 8, 1);
        //4 Points
        this.pushTile('V', 4, 2);
        this.pushTile('W', 4, 2);
        //3 Points
        this.pushTile('M', 3, 3);
        this.pushTile('C', 3, 2);
        this.pushTile('H', 3, 3);
        this.pushTile('F', 3, 2);
        this.pushTile('P', 3, 2);
        this.pushTile('K', 3, 2);
        this.pushTile('B', 3, 2);
        //2 Points
        this.pushTile('L', 2, 3);
        this.pushTile('G', 2, 3);
        this.pushTile('D', 2, 4);
        this.pushTile('Ö', 2, 1);
        this.pushTile('Ä', 2, 1);
        this.pushTile('Ü', 2, 1);
        //1 Point
        this.pushTile('S', 1, 6);
        this.pushTile('N', 1, 8);
        this.pushTile('E', 1, 14);
        this.pushTile('I', 1, 8);
        this.pushTile('R', 1, 6);
        this.pushTile('U', 1, 3);
        this.pushTile('A', 1, 6);
        this.pushTile('T', 1, 6);
        this.pushTile('O', 1, 3);
    }
    setTile(tile) {
        this.tiles.push(tile);
    }
    getTiles() {
        return this.tiles;
    }
    getPoints() {
        return this.points;
    }
    pushTile(val, points, times) {
        for (let i = 0; i < times; i++) {
            this.setTile(new Tile(val, points));
        }
    }
    getRandomTile() {
        const random = Math.floor(Math.random() * (this.getTiles().length - 0) + 0);
        return this.getTiles()[random];
    }
    deleteTile(value) {
        const deleteTile = new Array();
        let deleted = false;
        for (let i = 0; i < this.getTiles().length; i++) {
            if (this.getTiles()[i].getValue() == value && !deleted) {
            }
            else {
                deleteTile.push(this.getTiles()[i]);
                deleted = true;
            }
        }
        /*if (scrabbleBag.getTiles.length == 0) {
            socket.emit('gameEnd');
        }*/
        return deleteTile;
    }
}
class UserBag {
    constructor() {
        this.tiles = new Array();
    }
    setTile(tile) {
        this.tiles.push(tile);
    }
    getTiles() {
        return this.tiles;
    }
    getTile(index) {
        return this.getTiles()[index];
    }
}
class Player {
    constructor() {
    }
    getRandomStartTile() {
        return this.randomStartTile;
    }
    setRandomStartTile(randTile) {
        this.randomStartTile = randTile;
    }
    getUserName() {
        return this.userName;
    }
    setUserName(usrName) {
        this.userName = usrName;
    }
}
const socket = io();
let letterCounter = 0;
let boolLayWord = false;
let boolChangeOneTile = false;
let userBag = new UserBag();
let scrabbleBag = new ScrabbleBag();
function login() {
    let selector = {
        "selector": {
            "userName": { "$eq": $('#loginTxtName').val() }
        },
        "fields": ["userName", "userPw", "games", "won", "lost"]
    };
    let data = doPost(selector, "http://127.0.0.1:5984/scrabble/_find");
    if (data.docs[0] != undefined) {
        if ($('#loginTxtPassword').val() == data.docs[0].userPw) {
            saveThisUserData(data);
            document.location.href = "/gamemenu.html";
        }
        else {
            alert("Password wrong!");
        }
    }
    else {
        alert("Account doesn't exist!");
    }
}
function register() {
    if (!$('#registerTxtName').val() || !$('#registerTxtPassword').val()) {
        alert("Paramters missing!");
    }
    else {
        let selector = {
            "selector": {
                "userName": { "$eq": $('#registerTxtName').val() }
            },
            "fields": ["userName", "userPw"]
        };
        let data = doPost(selector, "http://127.0.0.1:5984/scrabble/_find");
        if (data.docs[0] != undefined) {
            alert("Account already exists!");
        }
        else {
            let newUser = {
                "userName": $('#registerTxtName').val(),
                "userPw": $('#registerTxtPassword').val(),
                "games": 0,
                "won": 0,
                "lost": 0
            };
            let data = doPost(newUser, "http://127.0.0.1:5984/scrabble");
            if (data != undefined) {
                alert("Account created!");
                document.location.href = "/login.html";
            }
        }
    }
}
function doPost(object, searchUrl) {
    let returnData;
    $.ajax({
        type: "POST",
        url: searchUrl,
        contentType: "application/json",
        data: JSON.stringify(object),
        dataType: "json",
        async: false,
        success: function (data) {
            returnData = data;
        }
    });
    return returnData;
}
function doPut(object, searchUrl) {
    let returnData;
    $.ajax({
        type: "PUT",
        url: searchUrl,
        contentType: "application/json",
        data: JSON.stringify(object),
        async: false,
        success: function (data) {
            returnData = data;
        }
    });
    return returnData;
}
function logout() {
    document.location.href = "/login.html";
}
function setStats() {
    $("#statsTdUsername").text(sessionStorage.currentUserName);
    $("#statsTdGames").text(sessionStorage.currentUserGames);
    $("#statsTdWon").text(sessionStorage.currentUserWon);
    $("#statsTdLost").text(sessionStorage.currentUserLost);
}
function generateTable() {
    let table = '<table>';
    let id = 0;
    for (let i = 0; i < 15; i++) {
        table += `<tr>`;
        for (let j = 0; j < 15; j++) {
            console.log("reihe " + i + ": " + id);
            table += '<td><input type = "text" id = "' + id + '" onclick = "placeBagItem(document.getElementById(' + id + '))" readonly></td>';
            id++;
        }
        table += `</tr>`;
    }
    table += '</table>';
    $("#scrabbleboard").html(table);
}
function safeBagitem(element) {
    if (boolLayWord) {
        sessionStorage.bagitem = element.textContent;
        sessionStorage.bagitemId = element.id;
    }
    if (boolChangeOneTile) {
        sessionStorage.bagitem = element.textContent;
        sessionStorage.bagitemId = element.id;
        changeOneTile();
    }
}
function placeBagItem(element) {
    if (!boolChangeOneTile) {
        if (sessionStorage.wordDirection != "" && sessionStorage.bagitem != "") {
            if (letterCounter == 0) {
                sessionStorage.firstLetterId = element.id;
                console.log("Firstletter: " + sessionStorage.firstLetterId);
            }
            sessionStorage.letterId = element.id;
            console.log("Letter: " + sessionStorage.letterId);
            letterCounter++;
        }
        socket.emit('placedTile', element.id, sessionStorage.bagitem);
    }
}
function saveThisUserData(data) {
    sessionStorage.currentUserName = data.docs[0].userName;
    sessionStorage.currentUserGames = data.docs[0].games;
    sessionStorage.currentUserWon = data.docs[0].won;
    sessionStorage.currentUserLost = data.docs[0].lost;
}
function setValue(elmId, val) {
    $('#' + elmId).val(val);
}
function gameStart() {
    generateTable();
    setParametersToStart();
    let tile;
    for (let i = 1; i < 8; i++) {
        tile = scrabbleBag.getRandomTile();
        userBag.setTile(tile);
        const id = '#bagItem' + i;
        $(id).text(tile.getValue());
        scrabbleBag.deleteTile(tile.getValue());
    }
    socket.emit('gameStart', sessionStorage.currentUserName);
}
function game(player) {
    alert("it's your turn! ;)");
    enableButtons();
}
function pass() {
    let passCounter = parseInt(sessionStorage.passCounter);
    if (passCounter >= 2) {
        socket.emit('gameEnd', sessionStorage.score);
    }
    passCounter++;
    sessionStorage.passCounter = passCounter;
    disableButtons();
    socket.emit('changePlayer', sessionStorage.currentUserName);
}
function changeOneTile() {
    let val = $('#' + sessionStorage.bagitemId).text();
    $('#' + sessionStorage.bagitemId).text(scrabbleBag.getRandomTile().getValue());
    scrabbleBag.setTile(new Tile(val, scrabbleBag.getPoints().val));
    boolChangeOneTile = false;
    sessionStorage.passCounter = "0";
    disableButtons();
}
function changeAllTiles() {
    let tile;
    for (let i = 1; i < 8; i++) {
        const id = '#bagItem' + i;
        let val = $(id).text();
        $(id).text(scrabbleBag.getRandomTile().getValue());
        scrabbleBag.setTile(new Tile(val, scrabbleBag.getPoints().val));
    }
    sessionStorage.passCounter = "0";
    disableButtons();
}
function proofWord() {
    let firstLetterId = parseInt(sessionStorage.firstLetterId);
    let word = "";
    let counterid = firstLetterId;
    //proof where the word was layed, and get the word
    if (sessionStorage.wordDirection == 'h') {
        let lastLetterId = getLastIndex(firstLetterId, "h");
        while (counterid < lastLetterId) {
            word += $('#' + counterid).val();
            counterid += 15;
        }
    }
    else if (sessionStorage.wordDirection == 'v') {
        let lastLetterId = getLastIndex(firstLetterId, "v");
        while (counterid < lastLetterId) {
            word += $('#' + counterid).val();
            counterid += 1;
        }
    }
    //proof if the word really exists
    //calculate the points of the word
    let score = 0;
    for (let i = 0; i < word.length; i++) {
        let letter = word.charAt(i);
        score += scrabbleBag.getPoints()[letter];
    }
    score += parseInt(sessionStorage.score);
    sessionStorage.score = score;
    $('#lblScore').text(sessionStorage.score);
    sessionStorage.passCounter = "0";
    letterCounter = 0;
    sessionStorage.wordDirection = "";
    sessionStorage.bagitem = "";
    sessionStorage.bagitemId = "";
    boolLayWord = false;
    disableButtons();
}
function getLastIndex(firstIndex, direction) {
    let counterid = firstIndex;
    let letter = " ";
    if (direction == "h") {
        while (letter != "" && letter != undefined) {
            letter = $('#' + counterid).val();
            counterid += 15;
        }
        counterid -= 15;
    }
    else if (direction == "v") {
        while (letter != "" && letter != undefined) {
            letter = $('#' + counterid).val();
            counterid += 1;
        }
        counterid -= 1;
    }
    return counterid;
}
function showDirectionButtons() {
    let gameOptions = $('#gameOptions').html();
    boolLayWord = true;
    sessionStorage.word = "";
    $("#btnHorizontal").show();
    $("#btnVertical").show();
    $("#btnFinished").show();
}
function enableButtons() {
    $('#btnPass').prop("disabled", false);
    $('#btnChangeOneTile').prop("disabled", false);
    $('#btnChangeAllTiles').prop("disabled", false);
    $('#btnLayAWord').prop("disabled", false);
}
function disableButtons() {
    $('#btnChangeOneTile').prop("disabled", true);
    $('#btnChangeAllTiles').prop("disabled", true);
    $('#btnLayAWord').prop("disabled", true);
    $("#btnHorizontal").hide();
    $("#btnVertical").hide();
    $("#btnFinished").hide();
}
function setParametersToStart() {
    sessionStorage.passCounter = "0";
    sessionStorage.bagitem = "";
    sessionStorage.bagitemId = "";
    sessionStorage.wordDirection = "";
    sessionStorage.score = "0";
}
socket.on('greet', function (message) {
    $("#divGreeting").text(sessionStorage.currentUserName + message);
});
socket.on('placedTile', function (elmId, val) {
    setValue(elmId, val);
    $('#' + sessionStorage.bagitemId).text(scrabbleBag.getRandomTile().getValue());
});
socket.on('gameStart', function (player) {
    gameStart();
    game(player);
});
socket.on('changePlayer', function (player) {
    game(player);
});
socket.on('gameEnd', function (winnerscore) {
    let selector = {
        "selector": {
            "userName": { "$eq": sessionStorage.currentUserName }
        },
        "fields": ["_id", "_rev", "userName", "userPw", "games", "lost", "won"]
    };
    let data = doPost(selector, "http://127.0.0.1:5984/scrabble/_find");
    const gamesMade = data.docs[0].games + 1;
    if (winnerscore.toString() == sessionStorage.score) {
        const gamesWon = data.docs[0].won + 1;
        const gamesLost = data.docs[0].lost;
        updateUser(data, gamesMade, gamesWon, gamesLost);
        document.location.href = "./winner.html";
    }
    else if (winnerscore.toString() !== sessionStorage.score) {
        const gamesWon = data.docs[0].won;
        const gamesLost = data.docs[0].lost + 1;
        updateUser(data, gamesMade, gamesWon, gamesLost);
        document.location.href = "./loser.html";
    }
});
function updateUser(data, gamesMade, gamesWon, gamesLost) {
    let updateUser = {
        "_rev": data.docs[0]._rev,
        "userName": data.docs[0].userName,
        "userPw": data.docs[0].userPw,
        "games": gamesMade,
        "won": gamesWon,
        "lost": gamesLost
    };
    sessionStorage.currentUserGames = gamesMade;
    sessionStorage.currentUserWon = gamesWon;
    sessionStorage.currentUserLost = gamesLost;
    doPut(updateUser, "http://127.0.0.1:5984/scrabble/" + data.docs[0]._id);
}
