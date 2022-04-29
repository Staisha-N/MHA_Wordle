var height = 6; // number of guesses
var width = 5; // number of letters

var row = 0; // current guess (attempt #)
var col = 0; // current letter for that attempt

var gameOver = false;

async function populate() {

    const requestURL = 'https://staisha-n.github.io/MHA_words/MHA_words.json';
    const request = new Request(requestURL);
    
    const response = await fetch(request);
    const superHeroes = await response.json();
    var variable = superHeroes["members"][Math.floor(Math.random()*20)]["word"];

    return variable;
    
    // const header = document.querySelector('header');
    // const myH1 = document.createElement('h1');
    // myH1.textContent = variable;
    // header.appendChild(myH1);
    
    
}

async function mainFunction (){
    const result = await populate();
    // const header = document.querySelector('header');
    // const myH1 = document.createElement('h1');
    // myH1.textContent = result;
    // header.appendChild(myH1);

    initialize(result);
}
function initialize(word) {
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
            update(word);
            row += 1;
            col = 0;
        }

        if (!gameOver && row == height) {
            gameOver = true;
            document.getElementById("answer").innerText = word;
        }
    })
}

function update(word) {
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

mainFunction();
       
    


// let word = "SQUID";

// word_array = ["SQUID", "APPLE"]
// word = words [random index]

// window.onload = function (){
//     initialize();
// }

