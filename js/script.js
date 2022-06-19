const light_dark_toggle = document.getElementById("mode-toggle");

light_dark_toggle.addEventListener("change", handleLightDarkMode);

function handleLightDarkMode() {
    document.body.classList.toggle("dark");
    document.getElementsByClassName("ball")[0].classList.toggle("dark");
}

const imgArea = document.getElementsByClassName("img-area")[0];
const wordArea = document.getElementsByClassName("word-area")[0];
let word = "";
let error;
let inputText;

/* game logic  */

async function getRandomWord() {
    const word = (
        await (await fetch("https://random-word-api.herokuapp.com/word")).json()
    )[0];
    inputText = new Array(word.length).fill(-1);
    return word;
}

async function start() {
    word = await getRandomWord();
    document.addEventListener("keyup", handleKeyUp);
    error = 0;
    console.clear();
    console.log(word);
    updateImg();
    generateWordInput(word);
}

start();

function generateWordInput(word = "") {
    wordArea.innerHTML = "";
    for (let i = 0; i < word.length; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = "1";
        input.readOnly = true;
        input.dataset.index = "" + i;
        input.classList.add("letter-input");
        wordArea.append(input);
    }
}

function handleKeyUp({ key }) {
    let hasGuessed = false;
    word.split("").forEach((letter, i) => {
        if (letter === key) {
            wordArea.querySelector(`[data-index="${i}"]`).value = letter;
            inputText[i] = 1;
            hasGuessed = true;
        }
    });
    if (!hasGuessed) error++;
    checkStatus();
    updateImg();
}

function updateImg() {
    imgArea.style.backgroundImage = `url("img/${error}.png")`;
}

function checkStatus() {
    if (error == 6) {
        // ha perso
        handleEndGame(false);
    }

    if (!inputText.includes(-1)) {
        // ha vinto
        handleEndGame(true);
    }
}

function handleEndGame(vittoria = false) {
    const dialog = document.querySelector("dialog");

    dialog.children[1].innerHTML = vittoria
        ? `Bravo hai indovinato la parona`
        : `Hai sbagliato troppe volte, la parola era <b>${word}</b>`;

    dialog.open = true;

    dialog.children[2].onclick = () => {
        dialog.open = false;
        start();
    };
}
