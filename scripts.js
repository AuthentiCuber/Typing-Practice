const wordsToTypeContainer = document.getElementById("words-to-type-container");
const words = document.getElementsByClassName("word");
const typing = document.getElementById("typing-box");
const buttons = document.getElementsByClassName("mode-selector");
const WPM = document.getElementById("wpm");
const time = document.getElementById("timer");
let typingTimeSeconds;
let rawWPM;
let accuracy;
let correctCharsTyped = 0;
let timer;
let wordIndex = 0;
let wordsToType =
    "hello there my very good friend hello there my very good friend hello there my very good friend";
let currentWord;
let prevWord;
// Used for setInterval
var timing;

const toMilliseconds = (secs) => secs * 1000;

const initialiseWords = (wordsList) => {
    const wordsToTypeList = wordsList.split(" ");

    let i = 0;
    wordsToTypeList.forEach((word) => {
        i++;
        const div = document.createElement("div");
        div.classList.add("word");
        div.textContent = word;
        newWord = wordsToTypeContainer.appendChild(div);
    });
    updateCurrentWord();
};

const setTime = (timeToSetSeconds) => {
    typingTimeSeconds = timeToSetSeconds;
    timer = typingTimeSeconds - 1;
    time.textContent = `${typingTimeSeconds}s`;

    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].value == timeToSetSeconds.toString()) {
            buttons[i].classList.add("selected-button");
        } else {
            buttons[i].classList.remove("selected-button");
        }
    }
    typing.focus();
};

const countCorrectChars = () => {
    //* Remove spaces using regex
    const typingNoSpaces = typing.value.replace(/\s+/g, "");
    if (typingNoSpaces == currentWord.innerText) {
        correctCharsTyped += typingNoSpaces.length;
    }
};

const updateCurrentWord = () => {
    currentWord = words[wordIndex];
    prevWord = words[wordIndex - 1];

    currentWord.classList.add("current-word");

    if (wordIndex > 0) {
        prevWord.classList.remove("current-word");
    }
};

const startTest = (event) => {
    handleTyping(event);
    updateCurrentWord();
    setTimeout(finishTest, toMilliseconds(typingTimeSeconds));
    timing = setInterval(updateTime, 1000);

    typing.setAttribute(
        "onkeydown",
        "setTimeout(() => {handleTyping(event)}, 1)"
    );
};

const updateTime = () => {
    if (timer < typingTimeSeconds) {
        time.textContent = `${timer}s`;
        timer--;
    }
};

const finishTest = () => {
    const AVERAGE_WORD_LENGTH = 5;
    const ONE_MINUTE = 60;
    typing.setAttribute("disabled", "");
    rawWPM =
        (parseInt(correctCharsTyped) / AVERAGE_WORD_LENGTH) *
        (ONE_MINUTE / typingTimeSeconds);
    WPM.textContent = Math.round(rawWPM).toString() + " WPM";
    clearInterval(timing);
    typing.setAttribute("onkeydown", "setTimeout(() => {startTest(event)}, 1)");
};

const preventKeys = (event) => {
    if (event.key == "Enter" || event.key == " ") {
        event.preventDefault();
    }
};

const handleTyping = (event) => {
    //! TODO: Fix becoming incorrect after word update
    if (currentWord.textContent.startsWith(typing.value)) {
        currentWord.classList.remove("incorrect");
    } else {
        currentWord.classList.add("incorrect");
    }

    if (event.key == " ") {
        if (wordIndex < wordsToType.split(" ").length - 1) {
            countCorrectChars();
            wordIndex++;
            updateCurrentWord();
        }
        typing.value = "";
    }
};

initialiseWords(wordsToType);
setTime(10);
