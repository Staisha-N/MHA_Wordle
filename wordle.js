// const sqlite3 = require(sqlite3).verbose();
// const db = new sqlite3.Database("./words.db", sqlite3.OPEN_READWRITE, (err) => {
//     if (err) return console.error(err.message);
// });

// sql = 'CREATE TABLE users(id INTEGER PRIMARY KEY, name)';
// db.run(sql);

var height = 6; // number of guesses
var width = 5; // number of letters

var row = 0; // current guess (attempt #)
var col = 0; // current letter for that attempt

var gameOver = false;
var word = "SQUID";

// word_array = ["SQUID", "APPLE"]
// word = words [random index]

window.onload = function (){
    initialize();
}

function initialize() {
    // create the board
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            // <span id= "0-0" class="tile"></span>
            let tile = document.createElement("span");
            tile.id = i.toString() + "-" + j.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
            // adds the spans to the board element in HTML file
        }
    }

    //Listen for key press
    document.addEventListener("keyup", (e) => {
        if (gameOver) return;
        //alert(e.code); the page will say which key was pressed

        if ("KeyA"  <= e.code && e.code <= "KeyZ") {
            if (col < width) {
                let currTile = document.getElementById(row.toString() + '-' + col.toString());
                if (currTile.innerText == "") {
                    currTile.innerText = e.code[3];
                    col+= 1;
                }
            }
        } else if (e.code == "Backspace") {
            if (col > 0 && col <= width) {
                col -= 1;
                let currTile = document.getElementById(row.toString() + '-' + col.toString());
                currTile.innerText ="";
            }
        } else if (e.code == "Enter") {
            update();
            row += 1;
            col = 0;
        }

        if (!gameOver && row == height) {
            gameOver = true;
            document.getElementById("answer").innerText = word;
        }
    })
}

function update() {
    let correct = 0;
    let letterCount = {}; //APPLE -> {A:1, P:2, L:1, E:1}
    for (let i = 0; i < word.length; i++) {
        letter = word[i];
        if(letterCount[letter]) {
            letterCount[letter] +=1;
             
        } else {
            letterCount[letter] = 1;
        }
    }

    //check correct
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        if (word[c] == letter) {
            currTile.classList.add("correct");
            correct +=1;
            letterCount[letter] -= 1;
        }

        if (correct == width) {
            gameOver = true;
        }

    }

    //check which ones are correct but in the wrong position
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;


        if (!currTile.classList.contains("correct")){
            if (word.includes(letter) && letterCount[letter] > 0) {
                currTile.classList.add("present");
                letterCount[letter] -= 1;
            } else {
                currTile.classList.add("absent");
            }
        }
        
    }
}