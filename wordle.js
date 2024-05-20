var height = 6; // number of guesses
var width = 5; // number of letters

var row = 0; // current guess (attempt #)
var col = 0; // current letter for that attempt

var gameOver = false;
var currentWord = "";

window.onload = function() {
    mainFunction();
}

async function populate() {
    const requestURL = 'MHA_words.json';
    const response = await fetch(requestURL);
    const superHeroes = await response.json();
    var variable = superHeroes["members"][Math.floor(Math.random() * 20)]["word"];
    return variable;
}

async function mainFunction() {
    currentWord = await populate();
    initialize(currentWord);
}

function initialize(word) {
    gameOver = false;
    row = 0;
    col = 0;
    document.getElementById("board").innerHTML = ""; // Clear the board
    document.getElementById("answer").innerText = ""; // Clear the answer
    document.getElementById("play-again").style.display = "none"; // Hide the play again button

    // create the board
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let tile = document.createElement("span");
            tile.id = i.toString() + "-" + j.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    // Listen for key press
    document.addEventListener("keyup", handleKeyPress);
}

function handleKeyPress(e) {
    if (gameOver) return;

    if ("KeyA" <= e.code && e.code <= "KeyZ") {
        if (col < width) {
            let currTile = document.getElementById(row.toString() + '-' + col.toString());
            if (currTile.innerText == "") {
                currTile.innerText = e.code[3];
                col += 1;
            }
        }
    } else if (e.code == "Backspace") {
        if (col > 0 && col <= width) {
            col -= 1;
            let currTile = document.getElementById(row.toString() + '-' + col.toString());
            currTile.innerText = "";
        }
    } else if (e.code == "Enter") {
        if (col === width) { // Ensure the row is full before submitting
            update(currentWord);
            row += 1;
            col = 0;
        }
    }

    if (!gameOver && row == height) {
        gameOver = true;
        document.getElementById("answer").innerText = currentWord;
        document.getElementById("play-again").style.display = "block"; // Show the play again button
    }
}

function update(word) {
    let correct = 0;
    let letterCount = {}; // APPLE -> {A:1, P:2, L:1, E:1}
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];
        if (letterCount[letter]) {
            letterCount[letter] += 1;
        } else {
            letterCount[letter] = 1;
        }
    }

    // check correct
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        if (word[c] == letter) {
            currTile.classList.add("correct");
            correct += 1;
            letterCount[letter] -= 1;
        }

        if (correct == width) {
            gameOver = true;
            document.getElementById("play-again").style.display = "block"; // Show the play again button
        }
    }

    // check which ones are correct but in the wrong position
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        if (!currTile.classList.contains("correct")) {
            if (word.includes(letter) && letterCount[letter] > 0) {
                currTile.classList.add("present");
                letterCount[letter] -= 1;
            } else {
                currTile.classList.add("absent");
            }
        }
    }
}

function resetGame() {
    mainFunction(); // Reinitialize the game with a new word
}

// Initial call to start the game
mainFunction();
