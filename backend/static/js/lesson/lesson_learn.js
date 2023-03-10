console.log(phrasesObj)
console.log(sentencesObj)
var challengesList = []
var wordsList = []

function speakS(string) {
    speechSynthesis.cancel()
    var voice = new SpeechSynthesisUtterance(string)
    window.speechSynthesis.speak(voice)
}

// word-select-the-meaning
for (i in wordsObj.words) {
    if (wordsObj.words[i].missing_translation) {
        continue
    }
    else {
        wordsList.push(wordsObj.words[i].word)
        var wc1 = {
            wordObj: wordsObj.words[i],
            complete: false,
            listening: 0,
            speaking: 0,
            reading: 0,
            writing: 0,
            name_challenge: "word-select-the-meaning"
        }
        challengesList.push(wc1)
    }
}

// word-select-the-word-by-the-meanings
for (i in wordsObj.words) {
    if (wordsObj.words[i].missing_translation) {
        continue
    }
    else {
        var wc2 = {
            wordObj: wordsObj.words[i],
            complete: false,
            listening: 0,
            speaking: 0,
            reading: 0,
            writing: 0,
            name_challenge: "word-select-the-word-by-the-meanings"
        }
        challengesList.push(wc2)
    }
}

// word-select-the-word-by-the-definition
for (i in wordsObj.words) {
    if (wordsObj.words[i].missing_translation) {
        continue
    }
    else {
        if (wordsObj.words[i].translation != null) {
            var wc4 = {
                wordObj: wordsObj.words[i],
                complete: false,
                listening: 0,
                speaking: 0,
                reading: 0,
                writing: 0,
                name_challenge: "word-select-the-word-by-the-definition"
            }
            challengesList.push(wc4)
        }
    }
}

// word-listen-the-word
for (i in wordsObj.words) {
    if (wordsObj.words[i].missing_translation) {
        continue
    }
    else {
        var wc3 = {
            wordObj: wordsObj.words[i],
            complete: false,
            listening: 0,
            speaking: 0,
            reading: 0,
            writing: 0,
            name_challenge: "word-listen-the-word"
        }
        challengesList.push(wc3)
    }
}

// word-fill-the-word

// phrase-translate-the-phrase
for (i in phrasesObj.phrases) {
    if (phrasesObj.phrases[i].missing_translation) {
        continue
    }
    else {
        var pc1 = {
            phraseObj: phrasesObj.phrases[i],
            complete: false,
            listening: 0,
            speaking: 0,
            reading: 0,
            writing: 0,
            name_challenge: "phrase-translate-the-phrase"
        }

        challengesList.push(pc1);
    }
}

// phrase-translate-the-meaning
for (i in phrasesObj.phrases) {
    if (phrasesObj.phrases[i].missing_translation) {
        continue
    }
    else {
        var pc2 = {
            phraseObj: phrasesObj.phrases[i],
            complete: false,
            listening: 0,
            speaking: 0,
            reading: 0,
            writing: 0,
            name_challenge: "phrase-translate-the-meaning"
        }

        challengesList.push(pc2);
    }
}

//phrase-listen-the-phrase
for (i in phrasesObj.phrases) {
    if (phrasesObj.phrases[i].missing_translation) {
        continue
    }
    else {
        var pc3 = {
            phraseObj: phrasesObj.phrases[i],
            complete: false,
            listening: 0,
            speaking: 0,
            reading: 0,
            writing: 0,
            name_challenge: "phrase-listen-the-phrase"
        }
        challengesList.push(pc3);
    }
}

for (i in sentencesObj.sentences) {
    var ec1 = {
        sentenceObj: sentencesObj.sentences[i],
        complete: false,
        name_challenge: "sentence-translate-the-sentence"
    }
    var ec2 = {
        sentenceObj: sentencesObj.sentences[i],
        complete: false,
        name_challenge: "sentence-translate-the-translation"
    }
    var ec3 = {
        sentenceObj: sentencesObj.sentences[i],
        complete: false,
        name_challenge: "sentence-listen-the-sentence"
    }
    challengesList.push(ec1, ec2, ec3)
}


var challenge = document.getElementById('challenge');
var footer = document.getElementById('footer');

var currentIndex = 0;
const challengeEndIndex = challengesList.length;
var cSuccess = 0;

var userUseKeyboard = true;
var userUseWordBank = false;
function ChallengeGenerate(currentIndexInFunc) {
    if (currentIndexInFunc >= challengeEndIndex && cSuccess < challengeEndIndex) {
        currentIndex = 0;
        currentIndexInFunc = currentIndex;
    }
    if (challengesList[currentIndexInFunc].complete == false) {
        cSuccess = 0;
        // word challenges
        if (challengesList[currentIndexInFunc].name_challenge == "word-select-the-word-by-the-meanings") {
            challengeWordSelectTheWord(challengesList[currentIndexInFunc]);
        }
        else if (challengesList[currentIndexInFunc].name_challenge == "word-select-the-meaning") {
            challengeWordSelectTheMeaning(challengesList[currentIndexInFunc]);
        }
        else if (challengesList[currentIndexInFunc].name_challenge == "word-listen-the-word") {
            challengeWordListenTheWord(challengesList[currentIndexInFunc]);
        }
        // phrase challenges
        else if (challengesList[currentIndexInFunc].name_challenge == "phrase-translate-the-phrase") {
            challengePhraseTranslateThePhrase(challengesList[currentIndexInFunc]);
        }
        else if (challengesList[currentIndexInFunc].name_challenge == "phrase-translate-the-meaning") {
            challengePhraseTranslateTheMeaning(challengesList[currentIndexInFunc]);
        }
        else if (challengesList[currentIndexInFunc].name_challenge == "phrase-listen-the-phrase") {
            challengePhraseListenThePhrase(challengesList[currentIndexInFunc]);
        }
        // sentence challenges
        if (challengesList[currentIndexInFunc].name_challenge == "sentence-translate-the-sentence") {
            challengeSentenceTranslateTheSentence(challengesList[currentIndexInFunc]);
        }
        else if (challengesList[currentIndexInFunc].name_challenge == "sentence-translate-the-translation") {
            challengeSentenceTranslateTheTranslation(challengesList[currentIndexInFunc]);
        }
        else if (challengesList[currentIndexInFunc].name_challenge == "sentence-listen-the-sentence") {
            challengeSentenceListenTheSentence(challengesList[currentIndexInFunc]);
        }
        currentIndex += 1;
    }
    else {
        cSuccess += 1;
        if (cSuccess < challengeEndIndex) {
            currentIndex += 1;
            ChallengeGenerate(currentIndex);
        }
        else if (cSuccess === challengeEndIndex) {
            ScoreBoard();
            var challenge = document.getElementById("challenge");
            var scoreBoard = document.getElementById("score-board");

            scoreBoard.style.display = "block";
            scoreBoard.innerHTML = `
                Superrrrrrrrrrrrrrrr
                `
            var footer = document.getElementById("footer");
            footer.innerHTML = `<button id="done-btn" class="btn btn-outline-success">Done</button>
                `
            var doneBtn = document.getElementById('done-btn');
            doneBtn.focus();
            doneBtn.addEventListener("click", function () {
                fetchData(dataSendBack);
                Redirect();
            });
            doneBtn.addEventListener("keydown", function (event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    fetchData(dataSendBack);
                    Redirect();
                }
            });
        }
    }
}

var dataSendBack = {
    "words": [],
    "phrases": []
}
var wordPushedlist = []
var phrasePushedlist = []

function ScoreBoard() {
    for (i in challengesList) {
        if (Object.keys(challengesList[i])[0] === "wordObj") {
            var wrdid = challengesList[i].wordObj.word_id;
            var lsn = challengesList[i].listening;
            var spk = challengesList[i].speaking;
            var rd = challengesList[i].reading;
            var wrt = challengesList[i].writing;
            var word = {
                word_id: wrdid,
                listening: lsn,
                speaking: spk,
                reading: rd,
                writing: wrt,
            }
            if (dataSendBack.words.length > 0) {
                if (wordPushedlist.includes(wrdid)) {
                    for (o in dataSendBack.words) {
                        if (dataSendBack.words[o].word_id === wrdid) {
                            if (lsn > 0) {
                                dataSendBack.words[o].listening += lsn
                                dataSendBack.words[o].listening = dataSendBack.words[o].listening.toFixed(1)
                            }
                            if (spk > 0) {
                                dataSendBack.words[o].speaking += spk
                                dataSendBack.words[o].speaking = dataSendBack.words[o].speaking.toFixed(1)
                            }
                            if (rd > 0) {
                                dataSendBack.words[o].reading += rd
                                dataSendBack.words[o].reading = dataSendBack.words[o].reading.toFixed(1)
                            }
                            if (wrt > 0) {
                                dataSendBack.words[o].writing += wrt
                                dataSendBack.words[o].writing = dataSendBack.words[o].writing.toFixed(1)
                            }
                            break
                        }
                    }
                }
                else {
                    dataSendBack.words.push(word)
                    wordPushedlist.push(wrdid)
                }
            }
            else {
                dataSendBack.words.push(word)
                wordPushedlist.push(wrdid)
            }
        }
        else if (Object.keys(challengesList[i])[0] === "phraseObj") {
            var phrid = challengesList[i].phraseObj.phrase_id
            var lsn = challengesList[i].listening
            var spk = challengesList[i].speaking
            var rd = challengesList[i].reading
            var wrt = challengesList[i].writing
            var phrase = {
                phrase_id: phrid,
                listening: lsn,
                speaking: spk,
                reading: rd,
                writing: wrt,
            }
            if (dataSendBack.phrases.length > 0) {
                if (phrasePushedlist.includes(phrid)) {
                    for (o in dataSendBack.phrases) {
                        if (dataSendBack.phrases[o].phrase_id === phrid) {
                            if (lsn > 0) {
                                dataSendBack.phrases[o].listening += lsn
                                dataSendBack.phrases[o].listening = dataSendBack.phrases[o].listening.toFixed(1)
                            }
                            if (spk > 0) {
                                dataSendBack.phrases[o].speaking += spk
                                dataSendBack.phrases[o].speaking = dataSendBack.phrases[o].speaking.toFixed(1)
                            }
                            if (rd > 0) {
                                dataSendBack.phrases[o].reading += rd
                                dataSendBack.phrases[o].reading = dataSendBack.phrases[o].reading.toFixed(1)
                            }
                            if (wrt > 0) {
                                dataSendBack.phrases[o].writing += wrt
                                dataSendBack.phrases[o].writing = dataSendBack.phrases[o].writing.toFixed(1)
                            }
                            break
                        }
                    }
                }
                else {
                    dataSendBack.phrases.push(phrase)
                    phrasePushedlist.push(phrid)
                }
            }
            else {
                dataSendBack.phrases.push(phrase)
                phrasePushedlist.push(phrid)
            }
        }
    }

    console.log(dataSendBack)
}

function Redirect() {
    window.location = lessonURL;
}

function fetchData(data) {
    fetch(lessonCompleteURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

challenge.addEventListener("load", ChallengeGenerate(currentIndex));

function continueBtnEvents() {
    var continueBtn = document.getElementById('continue-btn');
    continueBtn.focus();
    continueBtn.addEventListener("click", function () {
        ChallengeGenerate(currentIndex);
    });
    continueBtn.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            ChallengeGenerate(currentIndex);
        }
    });
};

function specialCharactersEvents() {
    var specialCharsInGerman = document.getElementById('special-characters-in-german');
    if (languageLearning === "German" || languageSpeaking === "German") {
        specialChars.style.display = "block";
    };

    const specialCharsBtn = document.querySelectorAll('.special-characters');
    specialCharsBtn.forEach(specialCharBtn => specialCharBtn.addEventListener('click', event => {
        answer.value += specialCharBtn.firstChild.textContent;
        answer.focus();
    }));
};

function FooterEvents() {
    document.getElementById("footer").innerHTML = `
    <button id="skip-btn" style="cursor: pointer; " class="btn btn-outline-danger">SKIP</button>
    <button id="use-keyboard-or-wordbank-btn" style="cursor: pointer;" class="btn btn-outline-secondary"></button>
    <button id="check-btn" style="cursor: pointer; " disabled class="btn btn-outline-secondary">CHECK</button>
    `;

    var skipBtn = document.getElementById('skip-btn');
    skipBtn.addEventListener("click", function () {
        ChallengeGenerate(currentIndex);
    });
}

function answerEvents() {
    var answer = document.getElementById('answer');
    answer.focus();
    answer.addEventListener("input", function (event) {
        var checkBtn = document.getElementById('check-btn');

        if (this.value.length > 0) {
            if (checkBtn.disabled === true)
                checkBtn.disabled = false;
        }
        else if (this.value.length === 0) {
            checkBtn.disabled = true;
        }
    });
}

// ~ split words into letters
function tapEventsWithSpeak() {
    var linesInput = document.getElementById('lines-input');
    var checkBtn = document.getElementById('check-btn');

    const wordsBtn = document.querySelectorAll('.word-btn');
    wordsBtn.forEach(wrdBtn => wrdBtn.addEventListener('click', event => {
        wrdBtn.disabled = true;
        //wrdBtn.style.visibility = "hidden"; //"visible";
        wrdBtn.style.opacity = "0.5";
        speakS(wrdBtn.firstChild.textContent);

        if (checkBtn.disabled) {
            checkBtn.disabled = false
        }
        checkBtn.focus()

        linesInput.innerHTML += `
        <button class="btn btn-outline-secondary word-btn-input">${wrdBtn.firstChild.textContent}</button>
        `
        const wordsInputBtns = document.querySelectorAll('.word-btn-input');
        wordsInputBtns.forEach(wrdInputBtn => wrdInputBtn.addEventListener('click', event => {
            wordsBtn.forEach(wrdBtn => {
                if (wrdInputBtn.firstChild.textContent === wrdBtn.firstChild.textContent) {
                    wrdBtn.disabled = false;
                    wrdBtn.style.opacity = "1";
                }
            });
            wrdInputBtn.remove()
            checkBtn.focus()
            linesInputContent = linesInput.textContent.replace(/\s\s+/g, ' ').trim();
            if (linesInputContent.length <= 0)
                checkBtn.disabled = true;
        }));
    }));
}

function tapEventsWithOutSpeak() {
    var linesInput = document.getElementById('lines-input');
    var checkBtn = document.getElementById('check-btn');

    const wordsBtn = document.querySelectorAll('.word-btn');
    wordsBtn.forEach(wrdBtn => wrdBtn.addEventListener('click', event => {
        wrdBtn.disabled = true;
        //wrdBtn.style.visibility = "hidden"; //"visible";
        wrdBtn.style.opacity = "0.5";

        if (checkBtn.disabled) {
            checkBtn.disabled = false
        }
        checkBtn.focus()

        linesInput.innerHTML += `
        <button class="btn btn-outline-secondary word-btn-input">${wrdBtn.firstChild.textContent}</button>
        `
        const wordsInputBtns = document.querySelectorAll('.word-btn-input');
        wordsInputBtns.forEach(wrdInputBtn => wrdInputBtn.addEventListener('click', event => {
            wordsBtn.forEach(wrdBtn => {
                if (wrdInputBtn.firstChild.textContent === wrdBtn.firstChild.textContent) {
                    wrdBtn.disabled = false;
                    wrdBtn.style.opacity = "1";
                }
            });
            wrdInputBtn.remove()
            checkBtn.focus()
            linesInputContent = linesInput.textContent.replace(/\s\s+/g, ' ').trim();
            if (linesInputContent.length <= 0)
                checkBtn.disabled = true;
        }));
    }));
}

function useKeyboardOrWordbank() {
    var useKeyboardOrWordbankBtn = document.getElementById("use-keyboard-or-wordbank-btn");
    var useKeyboard = document.getElementById("use-keyboard");
    var useWordBank = document.getElementById("use-word-bank");
    var answer = document.getElementById('answer');


    useKeyboardOrWordbankBtn.addEventListener("click", function () {
        if (userUseKeyboard) {
            userUseKeyboard = false;
            userUseWordBank = true;

            useWordBank.style.display = 'block';
            useKeyboard.style.display = 'none';
            useKeyboardOrWordbankBtn.innerText = "USE KEYBOARD";
        }
        else if (userUseWordBank) {
            userUseKeyboard = true;
            userUseWordBank = false;

            useWordBank.style.display = 'none';
            useKeyboard.style.display = 'block';
            answer.focus();
            useKeyboardOrWordbankBtn.innerText = "USE WORD BANK";
        }
    });

    if (userUseKeyboard) {
        useKeyboard.style.display = 'block';
        useWordBank.style.display = 'none';
        useKeyboardOrWordbankBtn.innerText = "USE WORD BANK";
    }
    else if (userUseWordBank) {
        useWordBank.style.display = 'block';
        useKeyboard.style.display = 'none';
        useKeyboardOrWordbankBtn.innerText = "USE KEYBOARD";
    }
}

function useKeyboardOrWordbankAndChangeChallengeHeader() {
    var challengeHeader = document.getElementById("challenge-header");
    var useKeyboardOrWordbankBtn = document.getElementById("use-keyboard-or-wordbank-btn");
    var useKeyboard = document.getElementById("use-keyboard");
    var useWordBank = document.getElementById("use-word-bank");
    var answer = document.getElementById('answer');

    useKeyboardOrWordbankBtn.addEventListener("click", function () {
        if (userUseKeyboard) {
            userUseKeyboard = false;
            userUseWordBank = true;

            challengeHeader.innerHTML = `<span>Tap what you hear</span>`;
            useWordBank.style.display = 'block';
            useKeyboard.style.display = 'none';
            useKeyboardOrWordbankBtn.innerText = "USE KEYBOARD";
        }
        else if (userUseWordBank) {
            userUseKeyboard = true;
            userUseWordBank = false;

            challengeHeader.innerHTML = `<span>Type what you hear</span>`;
            useWordBank.style.display = 'none';
            useKeyboard.style.display = 'block';
            answer.focus();
            useKeyboardOrWordbankBtn.innerText = "USE WORD BANK";
        }
    });

    if (userUseKeyboard == true) {
        useKeyboard.style.display = 'block';
        useWordBank.style.display = 'none';
        useKeyboardOrWordbankBtn.innerText = "USE WORD BANK";
    }
    else if (userUseWordBank) {
        useWordBank.style.display = 'block';
        useKeyboard.style.display = 'none';
        useKeyboardOrWordbankBtn.innerText = "USE KEYBOARD";
    }
}


// Challenges for word
function challengeWordSelectTheWord(bigObj) {
    const wordObj = bigObj.wordObj;
    const meaningList = wordObj.meaning.toLowerCase().split('/')
    for (i in meaningList) {
        meaningList[i] = meaningList[i].trim()
    }
    var rdn = Math.floor(Math.random() * meaningList.length)
    var word_meaning = meaningList[rdn].trim()
    challenge.innerHTML = `
        <h1>
            <span>Write this in ${languageLearning}?</span>
        </h1>
        <div>
            <div id="word-meaning" class="word-s">
                ${word_meaning}
                <span class="word-meaning-hint">
                    ${wordObj.word}
                </span>
            </div>
            <hr>
            <div id="answer-input">
                <div id="use-keyboard">
                    <textarea id="answer" maxlength='${wordObj.word.length}' placeholder="Type in ${languageLearning}" style="margin: 0px; width: 390px; height: 91px;" autofocus></textarea>
                    <hr>
                    <div id="special-characters-in-german" style="display: none;">
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                    </div>
                </div>
                <div id="use-word-bank">
                    <div id="lines-input" dir="ltr"></div>
                    <hr>
                    <div id="word-bank" dir="ltr"></div>
                </div>
            </div>
        </div>
        `
    answerEvents();
    var answer = document.getElementById('answer');
    answer.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            if (this.value.length > 0) {
                answer.disabled = true;
                Check();
            }
        }
    });

    function Check() {
        var useKeyboard = document.getElementById("use-keyboard");
        var useWordBank = document.getElementById("use-word-bank");
        var linesInput = document.getElementById('lines-input');

        if (window.getComputedStyle(useKeyboard).display === "block") {
            if (answer.value.toLowerCase() === wordObj.word.toLowerCase()) {
                displayFooter(true);
                bigObj.complete = true;
                bigObj.writing += 0.1;
                bigObj.reading += 0.1;
            }
            else {
                displayFooter(false);
            }
        }
        else if (window.getComputedStyle(useWordBank).display === "block") {
            // Given that you also want to cover tabs, newlines, etc, just replace \s\s + with ' ':
            // string = string.replace(/\s\s+/g, ' ');

            // If you really want to cover only spaces(and thus not tabs, newlines, etc), do so:
            // string = string.replace(/  +/g, ' ');
            linesInputContent = linesInput.textContent.replace(/\s\s+/g, ' ').trim();
            if (linesInputContent.toLowerCase() === wordObj.word.toLowerCase()) {
                displayFooter(true);
                bigObj.complete = true;
                bigObj.reading += 0.1;
            }
            else {
                displayFooter(false);
            }
        }
    };

    var complimentList = ['Awesome!', 'Great!', 'Correct!', 'Good job!', 'Nice job!', 'Nice!', 'Nicely done!', 'Amazing!'];
    function displayFooter(bool) {
        if (bool) {
            answer.disabled = true;
            var i = Math.floor(Math.random() * complimentList.length);
            footer.innerHTML = `
                    <h2>${complimentList[i]}</h2>
                    <br>
                    <button id="continue-btn" class="btn btn-outline-success">
                        Continue
                    </button>
                `;
        }
        else {
            answer.disabled = true;
            footer.innerHTML = `
                    <h2>Correct answer:</h2>
                    <div class="correct-answer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" id="speak-word" style="cursor: pointer" class="bi bi-soundwave" viewBox="0 0 22 22">
                            <path fill-rule="evenodd" d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5zm-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5zm12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z"></path>
                        </svg>
                        ${wordObj.word}
                        <br>
                        ${wordObj.meaning}
                    </div>
                    <br>
                    <button id="continue-btn" class="btn btn-outline-success">
                        Continue
                    </button>
                `;
            document.getElementById("speak-word").addEventListener("click", function () {
                speakS(wordObj.word);
            });
        }
        continueBtnEvents();
    };

    specialCharactersEvents();
    FooterEvents();

    var checkBtn = document.getElementById('check-btn');
    checkBtn.addEventListener("click", function () {
        Check();
    });

    checkBtn.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            Check();
        }
    });


    var wordsBankList = wordsList.slice()
    wordsBankList.splice(wordsBankList.indexOf(wordObj.word), 1);

    var wordsBank = document.getElementById('word-bank');
    wordsBank.innerHTML += `
                            <button class="btn btn-outline-secondary word-btn">${wordObj.word}</button>   
                        `
    // afterbegin   beforeend   
    const o = wordsBankList.length
    for (var i = 0; i < 2; i++) {
        if (i >= o)
            break
        else {
            const random = Math.floor(Math.random() * wordsBankList.length);
            if (Math.round(Math.random()) == 0)
                wordsBank.insertAdjacentHTML("afterbegin", `<button class="btn btn-outline-secondary word-btn">${wordsBankList[random]}</button>`)
            else
                wordsBank.insertAdjacentHTML("beforeend", `<button class="btn btn-outline-secondary word-btn">${wordsBankList[random]}</button>`)
            wordsBankList.splice(random, 1);
        }
    }
    useKeyboardOrWordbank();
    challenge.style.display = "block";
    tapEventsWithSpeak();
};

function challengeWordSelectTheMeaning(bigObj) {
    const wordObj = bigObj.wordObj;
    speakS(wordObj.word);
    const meaningList = wordObj.meaning.toLowerCase().split('/')
    for (i in meaningList) {
        meaningList[i] = meaningList[i].trim()
    }

    challenge.innerHTML = `
        <h1>
            <span>Write this in ${languageSpeaking}?</span>
        </h1>
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" id="speak-button" style="cursor: pointer" class="bi bi-soundwave" viewBox="0 0 22 22">
                <path fill-rule="evenodd" d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5zm-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5zm12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z"></path>
            </svg>
            <div id="word" class="word-s">
                ${wordObj.word}
                <span class="word-meaning-hint">
                    ${wordObj.meaning}
                </span>
            </div>
            </div>
            <hr>
            <div id="answer-input">
                <div id="use-keyboard">
                    <textarea id="answer" maxlength='${wordObj.meaning.length}' placeholder="Type in ${languageSpeaking}" style="margin: 0px; width: 390px; height: 91px;" autofocus></textarea>
                    <hr>
                    <div id="special-characters-in-german" style="display: none;">
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                    </div>
                </div>
                <div id="use-word-bank">
                    <div id="lines-input" dir="ltr"></div>
                    <hr>
                    <div id="word-bank" dir="ltr"></div>
                </div>
            </div>
        </div>
        `

    document.getElementById("speak-button").addEventListener("click", function () {
        speakS(wordObj.word);
    });

    var complimentList = ['Awesome!', 'Great!', 'Correct!', 'Good job!', 'Nice job!', 'Nice!', 'Nicely done!', 'Amazing!'];

    answerEvents();
    var answer = document.getElementById('answer');
    answer.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            if (this.value.length > 0) {
                answer.disabled = true;
                Check();
            }
        }
    });

    function Check() {
        var useKeyboard = document.getElementById("use-keyboard");
        var useWordBank = document.getElementById("use-word-bank");
        var linesInput = document.getElementById('lines-input');

        if (window.getComputedStyle(useKeyboard).display === "block") {
            if (meaningList.indexOf(answer.value.toLowerCase()) >= 0) {
                displayFooter(true);
                bigObj.complete = true;
                bigObj.reading += 0.1;
            }
            else {
                displayFooter(false);
            }
        }
        else if (window.getComputedStyle(useWordBank).display === "block") {
            linesInputContent = linesInput.textContent.replace(/\s\s+/g, ' ').trim();
            if (meaningList.indexOf(linesInputContent.toLowerCase()) >= 0) {
                displayFooter(true);
                bigObj.complete = true;
                bigObj.reading += 0.1;
            }
            else {
                displayFooter(false);
            }
        }
    }

    function displayFooter(bool) {
        if (bool) {
            answer.disabled = true;
            var i = Math.floor(Math.random() * complimentList.length);
            footer.innerHTML = `
                    <h2>${complimentList[i]}</h2>
                    <button id="continue-btn" class="btn btn-outline-success">
                        Continue
                    </button>
                `
        }
        else {
            answer.disabled = true;
            footer.innerHTML = `
                    <h2>Correct answer:</h2>
                    <div class="correct-answer">
                        ${wordObj.meaning}
                    </div>
                    <button id="continue-btn" class="btn btn-outline-success">
                        Continue
                    </button>
                `
        }

        continueBtnEvents()
    }

    specialCharactersEvents();
    FooterEvents();

    var checkBtn = document.getElementById('check-btn');
    checkBtn.addEventListener("click", function () {
        Check();
    });

    checkBtn.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            Check();
        }
    });

    const wrd = document.getElementById('word');
    wrd.addEventListener('mouseover', event => {
        speakS(wrd.firstChild.textContent);
    });

    //split the meaning -> word bank
    var wordsBank = document.getElementById('word-bank');
    var rdn = Math.floor(Math.random() * meaningList.length)
    var word_meaning = meaningList[rdn].trim()
    var wordsList = word_meaning.split(" ")

    for (let i = 0; i < wordsList.length; i++) {
        if (Math.round(Math.random()) == 0)
            wordsBank.insertAdjacentHTML("afterbegin", `<button class="btn btn-outline-secondary word-btn">${wordsList[i]}</button>`)
        else
            wordsBank.insertAdjacentHTML("afterbegin", `<button class="btn btn-outline-secondary word-btn">${wordsList[i]}</button>`)
    }

    useKeyboardOrWordbank();
    challenge.style.display = "block";
    tapEventsWithOutSpeak();
};

function challengeWordListenTheWord(bigObj) {
    const wordObj = bigObj.wordObj;
    speakS(wordObj.word);

    challenge.innerHTML = `
        <div>
        <h1 id="challenge-header">
            <span>Type what you hear</span>
        </h1>
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" id="speak-btn" style="cursor: pointer" class="bi bi-soundwave" viewBox="0 0 22 22">
                <path fill-rule="evenodd" d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5zm-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5zm12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z"></path>
            </svg>
            <br>
            <hr>
            <div id="answer-input">
                <div id="use-keyboard">
                    <textarea id="answer" maxlength='${wordObj.word.length}' placeholder="Type in ${languageLearning}" style="margin: 0px; width: 390px; height: 91px;" autofocus></textarea>
                    <hr>
                    <div id="special-characters-in-german" style="display: none;">
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                    </div>
                </div>
                <div id="use-word-bank">
                    <div id="lines-input" dir="ltr"></div>
                    <hr>
                    <div id="word-bank" dir="ltr"></div>
                </div>
            </div>
        </div>
        `

    document.getElementById("speak-btn").addEventListener("click", function () {
        speakS(wordObj.word);
    });

    var complimentList = ['Awesome!', 'Great!', 'Correct!', 'Good job!', 'Nice job!', 'Nice!', 'Nicely done!', 'Amazing!'];
    answerEvents();
    var answer = document.getElementById('answer');
    answer.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            if (this.value.length > 0) {
                answer.disabled = true;
                Check();
            }
        }
    });

    function Check() {
        var useKeyboard = document.getElementById("use-keyboard");
        var useWordBank = document.getElementById("use-word-bank");
        var linesInput = document.getElementById('lines-input');

        if (window.getComputedStyle(useKeyboard).display === "block") {
            if (answer.value.toLowerCase() === wordObj.word.toLowerCase()) {
                displayFooter(true);
                bigObj.complete = true;
                bigObj.listening += 0.1;
                bigObj.writing += 0.1;
            }
            else {
                displayFooter(false);
            }
        }
        else if (window.getComputedStyle(useWordBank).display === "block") {
            linesInputContent = linesInput.textContent.replace(/\s\s+/g, ' ').trim();
            if (linesInputContent.toLowerCase() === wordObj.word.toLowerCase()) {
                displayFooter(true);
                bigObj.complete = true;
                bigObj.listening += 0.1;
                bigObj.reading += 0.1;
            }
            else {
                displayFooter(false);
            }
        }
    }

    function displayFooter(bool) {
        if (bool) {
            answer.disabled = true;
            var i = Math.floor(Math.random() * complimentList.length);
            footer.innerHTML = `
                    <h2>${complimentList[i]}</h2>
                    <button id="continue-btn" class="btn btn-outline-success">
                        Continue
                    </button>
                `
        }
        else {
            answer.disabled = true;
            footer.innerHTML = `
                    <h2>Correct answer:</h2>
                    <div class="correct-answer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" id="speak-word" style="cursor: pointer" class="bi bi-soundwave" viewBox="0 0 22 22">
                            <path fill-rule="evenodd" d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5zm-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5zm12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z"></path>
                        </svg>
                        ${wordObj.word}
                        <br>
                        ${wordObj.meaning}
                    </div>
                    <button id="continue-btn" class="btn btn-outline-success">
                        Continue
                    </button>
                `
            document.getElementById("speak-word").addEventListener("click", function () {
                speakS(wordObj.word);
            });
        }

        continueBtnEvents()
    }

    specialCharactersEvents();
    FooterEvents();

    var checkBtn = document.getElementById('check-btn');
    checkBtn.addEventListener("click", function () {
        Check();
    });

    checkBtn.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            Check();
        }
    });

    var wordsBankList = wordsList.slice()
    wordsBankList.splice(wordsBankList.indexOf(wordObj.word), 1);
    var wordsBank = document.getElementById('word-bank');
    wordsBank.innerHTML += `
                            <button class="btn btn-outline-secondary word-btn">${wordObj.word}</button>   
                        `
    // afterbegin   beforeend   
    const o = wordsBankList.length
    for (var i = 0; i < 2; i++) {
        if (i >= o)
            break
        else {
            const random = Math.floor(Math.random() * wordsBankList.length);
            if (Math.round(Math.random()) == 0)
                wordsBank.insertAdjacentHTML("afterbegin", `<button class="btn btn-outline-secondary word-btn">${wordsBankList[random]}</button>`)
            else
                wordsBank.insertAdjacentHTML("beforeend", `<button class="btn btn-outline-secondary word-btn">${wordsBankList[random]}</button>`)
            wordsBankList.splice(random, 1);
        }
    }

    useKeyboardOrWordbankAndChangeChallengeHeader();
    challenge.style.display = "block";
    tapEventsWithSpeak();
};

// Challenges for phrase 
function challengePhraseTranslateThePhrase(bigObj) {
    const phraseObj = bigObj.phraseObj;
    speakS(phraseObj.phrase);
    const meaningList = phraseObj.meaning.toLowerCase().split('/')
    for (i in meaningList) {
        meaningList[i] = meaningList[i].trim()
    }

    challenge.innerHTML = `
        <h1>
            <span>Translate this phrase</span>
        </h1>
        <div>
            <div id="words-in-phrase">
                <svg xmlns="http://www.w3.org/2000/svg" id="speak-btn" width="32" height="32" fill="currentColor" style="cursor: pointer" class="bi bi-soundwave" viewBox="0 0 22 22">
                    <path fill-rule="evenodd" d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5zm-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5zm12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z"></path>
                </svg>
            </div>
            <hr>
            <div id="answer-input">
                <div id="use-keyboard">
                    <textarea id="answer" maxlength='${phraseObj.meaning.length}' placeholder="Type in ${languageSpeaking}" style="margin: 0px; width: 390px; height: 91px;" autofocus></textarea>
                    <hr>
                    <div id="special-characters-in-german" style="display: none;">
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                    </div>
                </div>
                <div id="use-word-bank">
                    <div id="lines-input" dir="ltr"></div>
                    <hr>
                    <div id="word-bank" dir="ltr"></div>
                </div>
            </div>
        </div>
        `

    var complimentList = ['Awesome!', 'Great!', 'Correct!', 'Good job!', 'Nice job!', 'Nice!', 'Nicely done!', 'Amazing!'];

    // function sleep(ms) {
    //     return new Promise(resolve => setTimeout(resolve, ms));
    // }
    // async function sleepF() {
    //     await sleep(500);
    //     answer.focus();
    // };
    // sleepF();
    //setTimeout('Redirect()', 10000);

    answerEvents();
    var answer = document.getElementById('answer');
    answer.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            if (this.value.length > 0) {
                answer.disabled = true;
                Check();
            }
        }
    });

    function Check() {
        var useKeyboard = document.getElementById("use-keyboard");
        var useWordBank = document.getElementById("use-word-bank");
        var linesInput = document.getElementById('lines-input');

        if (window.getComputedStyle(useKeyboard).display === "block") {
            if (meaningList.indexOf(answer.value.toLowerCase()) >= 0) {
                displayFooter(true);
                bigObj.complete = true;
                bigObj.reading += 0.1;
            }
            else {
                displayFooter(false);
            }
        }
        else if (window.getComputedStyle(useWordBank).display === "block") {
            linesInputContent = linesInput.textContent.replace(/\s\s+/g, ' ').trim();
            if (meaningList.indexOf(linesInputContent.toLowerCase()) >= 0) {
                displayFooter(true);
                bigObj.complete = true;
                bigObj.reading += 0.1;
            }
            else {
                displayFooter(false);
            }
        }
    }

    function displayFooter(bool) {
        if (bool) {
            answer.disabled = true;
            var i = Math.floor(Math.random() * complimentList.length);
            footer.innerHTML = `
                    <h2>${complimentList[i]}</h2>
                    <button id="continue-btn" class="btn btn-outline-success">
                        Continue
                    </button>
                `
        }
        else {
            answer.disabled = true;
            footer.innerHTML = `
                    <h2>Correct answer:</h2>
                    <div class="correct-answer ">
                        ${phraseObj.meaning}
                    </div>
                    <br>
                    <button id="continue-btn" class="btn btn-outline-success">
                        Continue
                    </button>
                `
        }
        continueBtnEvents()
    }

    specialCharactersEvents();
    FooterEvents();

    var checkBtn = document.getElementById('check-btn');
    checkBtn.addEventListener("click", function () {
        Check();
    });

    checkBtn.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            Check();
        }
    });

    var wordsInPhrase = document.getElementById('words-in-phrase')
    for (i in phraseObj.words_in_phrase) {
        if (phraseObj.words_in_phrase[i].missing_translation) {
            wordsInPhrase.innerHTML += `
                <div class="words-in-phrase">${phraseObj.words_in_phrase[i].word}
                    <span class="word-meanings-hint">
                        Missing translation  
                    </span>
                </div>
                `
        }
        else {
            wordsInPhrase.innerHTML += `
                <div class="words-in-phrase">${phraseObj.words_in_phrase[i].word}
                    <span class="word-meanings-hint">
                        Meaning:${phraseObj.words_in_phrase[i].meaning}
                        <hr>
                        Definition: ${phraseObj.words_in_phrase[i].definition}
                    </span>
                </div>
                `
        }
    };

    document.getElementById("speak-btn").addEventListener("click", function () {
        speakS(phraseObj.phrase);
    });

    //document.querySelector('.someParentDiv span').firstChild.textContent;
    const words = document.querySelectorAll('.words-in-phrase');
    words.forEach(wrd => wrd.addEventListener('mouseover', event => {
        //console.log(wrd.firstChild.textContent)
        speakS(wrd.firstChild.textContent);
    }));

    //split the meaning -> word bank
    var rdn = Math.floor(Math.random() * meaningList.length)
    var phrase_meaning = meaningList[rdn].trim()
    var wordsList = phrase_meaning.split(" ")
    var wordsBank = document.getElementById('word-bank');

    for (let i = 0; i < wordsList.length; i++) {
        if (Math.round(Math.random()) == 0)
            wordsBank.insertAdjacentHTML("afterbegin", `<button class="btn btn-outline-secondary word-btn">${wordsList[i]}</button>`)
        else
            wordsBank.insertAdjacentHTML("afterbegin", `<button class="btn btn-outline-secondary word-btn">${wordsList[i]}</button>`)
    }

    useKeyboardOrWordbank();
    challenge.style.display = "block";
    tapEventsWithOutSpeak();
}

function challengePhraseTranslateTheMeaning(bigObj) {
    const phraseObj = bigObj.phraseObj;
    const meaningList = phraseObj.meaning.toLowerCase().split('/')
    for (i in meaningList) {
        meaningList[i] = meaningList[i].trim()
    }
    var rdn = Math.floor(Math.random() * meaningList.length)
    var phrase_meaning = meaningList[rdn].trim()

    challenge.innerHTML = `
        <h1>
            <span>Write this in ${languageLearning}</span>
        </h1>
        <div>
            <div id="words-in-meaning"></div>
            <hr>
            <div id="answer-input">
                <div id="use-keyboard">
                    <textarea id="answer" maxlength='${phraseObj.phrase.length}' placeholder="Type in ${languageLearning}" style="margin: 0px; width: 390px; height: 91px;" autofocus></textarea>
                    <hr>
                    <div id="special-characters-in-german" style="display: none">
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                    </div>
                </div>
                <div id="use-word-bank">
                    <div id="lines-input" dir="ltr"></div>
                    <hr>
                    <div id="word-bank" dir="ltr"></div>
                </div>
            </div>
        </div>
        `

    var complimentList = ['Awesome!', 'Great!', 'Correct!', 'Good job!', 'Nice job!', 'Nice!', 'Nicely done!', 'Amazing!'];
    answerEvents();
    var answer = document.getElementById('answer');
    answer.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            if (this.value.length > 0) {
                answer.disabled = true;
                Check();
            }
        }
    });

    function Check() {
        var useKeyboard = document.getElementById("use-keyboard");
        var useWordBank = document.getElementById("use-word-bank");
        var linesInput = document.getElementById('lines-input');

        if (window.getComputedStyle(useKeyboard).display === "block") {
            if (answer.value.toLowerCase() === phraseObj.phrase.toLowerCase()) {
                displayFooter(true)
                bigObj.complete = true
                bigObj.reading += 0.1
                bigObj.writing += 0.1
            }
            else {
                displayFooter(false)
            }
        }
        else if (window.getComputedStyle(useWordBank).display === "block") {
            linesInputContent = linesInput.textContent.replace(/\s\s+/g, ' ').trim();
            if (linesInputContent.toLowerCase() === phraseObj.phrase.toLowerCase()) {
                displayFooter(true)
                bigObj.complete = true
                bigObj.reading += 0.1
            }
            else {
                displayFooter(false)
            }
        }
    }

    function displayFooter(bool) {
        if (bool) {
            answer.disabled = true;
            var i = Math.floor(Math.random() * complimentList.length);
            footer.innerHTML = `
                    <h2>${complimentList[i]}</h2>
                    <button id="continue-btn" class="btn btn-outline-success">
                        Continue
                    </button>
                `
        }
        else {
            answer.disabled = true;
            footer.innerHTML = `
                    <h2>Correct answer:</h2>
                    <div class="correct-answer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" id="speak-phrase" style="cursor: pointer" class="bi bi-soundwave" viewBox="0 0 22 22">
                            <path fill-rule="evenodd" d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5zm-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5zm12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z"></path>
                        </svg>
                        ${phraseObj.phrase}
                        <br>
                        ${phraseObj.meaning}
                    </div>
                    <button id="continue-btn" class="btn btn-outline-success">
                        Continue
                    </button>
                `
            document.getElementById("speak-phrase").addEventListener("click", function () {
                speakS(phraseObj.phrase);
            })
        }

        continueBtnEvents()
    }

    specialCharactersEvents();
    FooterEvents();

    var checkBtn = document.getElementById('check-btn');
    checkBtn.addEventListener("click", function () {
        Check();
    });

    checkBtn.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            Check();
        }
    });

    var wordsInMeaning = document.getElementById('words-in-meaning');

    // printout the meaning
    // var meaningLow = phraseObj.meaning.toLowerCase();
    // var meaningSplit = meaningLow.split(' ');

    // for (i in meaningSplit) {
    //     for (x in phraseObj.words_in_phrase) {
    //         var meaningLower = phraseObj.words_in_phrase[x].meaning.toLowerCase();
    //         console.log(meaningSplit[i]);
    //         console.log(meaningLower);
    //         console.log(meaningLower.includes(meaningSplit[i]));

    //         if (meaningLower.includes(meaningSplit[i])) {
    //             // modify class to tooltip boostrap
    //             wordsInMeaning.innerHTML += `
    //                 <div class="words-in-meaning">${meaningSplit[i]}
    //                     <span class="words-hint">
    //                         ${phraseObj.words_in_phrase[x].word}                   
    //                     </span>
    //                 </div>
    //                 `
    //         }
    //     }
    // };

    wordsInMeaning.innerHTML = `<div >${phrase_meaning}</div>`

    //split the phrase -> word bank
    var wordsBank = document.getElementById('word-bank');

    var wordList = phraseObj.phrase.split(" ")
    var wordsBankList = wordsList.slice()
    const o = wordsBankList.length
    var mess_words = 0

    for (let i = 0; i < wordList.length; i++) {
        const random = Math.floor(Math.random() * wordsBankList.length);
        if (Math.random() > 0.3) {
            if (mess_words < 4) {
                if (Math.round(Math.random()) == 0)
                    wordsBank.insertAdjacentHTML("afterbegin", `<button class="btn btn-outline-secondary word-btn">${wordsBankList[random]}</button>`)
                else
                    wordsBank.insertAdjacentHTML("beforeend", `<button class="btn btn-outline-secondary word-btn">${wordsBankList[random]}</button>`)
                wordsBankList.splice(random, 1);
                mess_words++
            }
        }

        if (Math.round(Math.random()) == 0)
            wordsBank.insertAdjacentHTML("afterbegin", `<button class="btn btn-outline-secondary word-btn">${wordList[i]}</button>`)
        else
            wordsBank.insertAdjacentHTML("beforeend", `<button class="btn btn-outline-secondary word-btn">${wordList[i]}</button>`)
    }

    useKeyboardOrWordbank();
    challenge.style.display = "block";
    tapEventsWithSpeak();
}

function challengePhraseListenThePhrase(bigObj) {
    const phraseObj = bigObj.phraseObj;
    speakS(phraseObj.phrase);
    challenge.innerHTML = `
        <h1 id="challenge-header">
            <span>Type what you hear</span>
        </h1>
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" id="speak-btn" style="cursor: pointer" class="bi bi-soundwave" viewBox="0 0 22 22">
                <path fill-rule="evenodd" d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5zm-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5zm12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z"></path>
            </svg>
            <br>
            <hr>
            <div id="answer-input">
                <div id="use-keyboard">
                    <textarea id="answer" maxlength='${phraseObj.phrase.length}' placeholder="Type in ${languageSpeaking}" style="margin: 0px; width: 390px; height: 91px;" autofocus></textarea>
                    <hr>
                    <div id="special-characters-in-german" style="display: none">
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                    </div>
                </div>
                <div id="use-word-bank">
                    <div id="lines-input" dir="ltr"></div>
                    <hr>
                    <div id="word-bank" dir="ltr"></div>
                </div>
            </div>
        </div>
        `

    document.getElementById("speak-btn").addEventListener("click", function () {
        speakS(phraseObj.phrase);
    });

    var complimentList = ['Awesome!', 'Great!', 'Correct!', 'Good job!', 'Nice job!', 'Nice!', 'Nicely done!', 'Amazing!'];
    answerEvents();
    var answer = document.getElementById('answer');
    answer.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            if (this.value.length > 0) {
                answer.disabled = true;
                Check();
            }
        }
    });

    function Check() {
        var useKeyboard = document.getElementById("use-keyboard");
        var useWordBank = document.getElementById("use-word-bank");
        var linesInput = document.getElementById('lines-input');

        if (window.getComputedStyle(useKeyboard).display === "block") {
            if (answer.value.toLowerCase() === phraseObj.phrase.toLowerCase()) {
                displayFooter(true);
                bigObj.complete = true;
                bigObj.listening += 0.1;
                bigObj.writing += 0.1;
            }
            else {
                displayFooter(false);
            }
        }
        else if (window.getComputedStyle(useWordBank).display === "block") {
            linesInputContent = linesInput.textContent.replace(/\s\s+/g, ' ').trim();
            if (linesInputContent.toLowerCase() === phraseObj.phrase.toLowerCase()) {
                displayFooter(true);
                bigObj.complete = true;
                bigObj.listening += 0.1;
                bigObj.reading += 0.1;
            }
            else {
                displayFooter(false);
            }
        }
    }

    function displayFooter(bool) {
        if (bool) {
            answer.disabled = true;
            var i = Math.floor(Math.random() * complimentList.length);
            footer.innerHTML = `
                <h2>${complimentList[i]}</h2>
                <button id="continue-btn" class="btn btn-outline-success">
                    Continue
                </button>
            `
        }
        else {
            answer.disabled = true;
            footer.innerHTML = `
                <h2>Correct answer:</h2>
                <div class="correct-answer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" id="speak-phrase" style="cursor: pointer" class="bi bi-soundwave" viewBox="0 0 22 22">
                            <path fill-rule="evenodd" d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5zm-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5zm12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z"></path>
                    </svg>
                    ${phraseObj.phrase}
                    <br>
                    ${phraseObj.meaning}
                </div>
                <button id="continue-btn" class="btn btn-outline-success">
                    Continue
                </button>
            `
            document.getElementById("speak-phrase").addEventListener("click", function () {
                speakS(phraseObj.phrase);
            });
        }
        continueBtnEvents()
    }

    specialCharactersEvents();
    FooterEvents();

    var checkBtn = document.getElementById('check-btn');
    checkBtn.addEventListener("click", function () {
        Check();
    });

    checkBtn.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            Check();
        }
    });

    var wordsBank = document.getElementById('word-bank');

    //split the phrase -> word bank
    wordList = phraseObj.phrase.split(" ")
    var wordsBankList = wordsList.slice()
    const o = wordsBankList.length
    var mess_words = 0

    for (let i = 0; i < wordList.length; i++) {
        const random = Math.floor(Math.random() * wordsBankList.length);
        if (Math.random() > 0.3) {
            if (mess_words < 4) {
                if (Math.round(Math.random()) == 0)
                    wordsBank.insertAdjacentHTML("afterbegin", `<button class="btn btn-outline-secondary word-btn">${wordsBankList[random]}</button>`)
                else
                    wordsBank.insertAdjacentHTML("beforeend", `<button class="btn btn-outline-secondary word-btn">${wordsBankList[random]}</button>`)
                wordsBankList.splice(random, 1);
                mess_words++
            }
        }

        if (Math.round(Math.random()) == 0)
            wordsBank.insertAdjacentHTML("afterbegin", `<button class="btn btn-outline-secondary word-btn">${wordList[i]}</button>`)
        else
            wordsBank.insertAdjacentHTML("beforeend", `<button class="btn btn-outline-secondary word-btn">${wordList[i]}</button>`)
    }

    useKeyboardOrWordbankAndChangeChallengeHeader();
    challenge.style.display = "block";
    tapEventsWithSpeak();
}

// Challenges for sentence 
function challengeSentenceTranslateTheSentence(bigObj) {
    const sentenceObj = bigObj.sentenceObj;
    speakS(sentenceObj.sentence);
    const meaningList = sentenceObj.translation.toLowerCase().split('/')
    for (i in meaningList) {
        meaningList[i] = meaningList[i].trim()
    }

    challenge.innerHTML = `
        <h1>
            <span>Translate this sentence in ${languageSpeaking}</span>
        </h1>
        <div>
            <div id="words-in-sentence">
                <svg xmlns="http://www.w3.org/2000/svg" id="speak-btn" width="32" height="32" fill="currentColor" style="cursor: pointer" class="bi bi-soundwave" viewBox="0 0 22 22">
                    <path fill-rule="evenodd" d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5zm-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5zm12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z"></path>
                </svg>
            </div>
            <hr>
            <div id="answer-input">
                <div id="use-keyboard">
                    <textarea id="answer" maxlength='${sentenceObj.translation.length}' placeholder="Type in ${languageSpeaking}" style="margin: 0px; width: 390px; height: 91px;" autofocus></textarea>
                    <hr>
                    <div id="special-characters-in-german" style="display: none;">
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                    </div>
                </div>
                <div id="use-word-bank">
                    <div id="lines-input" dir="ltr"></div>
                    <hr>
                    <div id="word-bank" dir="ltr"></div>
                </div>
            </div>
        </div>
        `

    var complimentList = ['Awesome!', 'Great!', 'Correct!', 'Good job!', 'Nice job!', 'Nice!', 'Nicely done!', 'Amazing!'];
    answerEvents();
    var answer = document.getElementById('answer');
    answer.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            if (this.value.length > 0) {
                answer.disabled = true;
                Check();
            }
        }
    });

    function Check() {
        var useKeyboard = document.getElementById("use-keyboard");
        var useWordBank = document.getElementById("use-word-bank");
        var linesInput = document.getElementById('lines-input');

        if (window.getComputedStyle(useKeyboard).display === "block") {
            if (meaningList.indexOf(answer.value.toLowerCase()) >= 0) {
                displayFooter(true);
                bigObj.complete = true;
            }
            else {
                displayFooter(false);
            }
        }
        else if (window.getComputedStyle(useWordBank).display === "block") {
            linesInputContent = linesInput.textContent.replace(/\s\s+/g, ' ').trim();
            if (meaningList.indexOf(linesInputContent.toLowerCase()) >= 0) {
                displayFooter(true);
                bigObj.complete = true;
            }
            else {
                displayFooter(false);
            }
        }
    }

    function displayFooter(bool) {
        if (bool) {
            answer.disabled = true;
            var i = Math.floor(Math.random() * complimentList.length);
            footer.innerHTML = `
                    <h2>${complimentList[i]}</h2>
                    <button id="continue-btn" class="btn btn-outline-success">
                        Continue
                    </button>
                `
        }
        else {
            answer.disabled = true;
            footer.innerHTML = `
                    <h2>Correct answer:</h2>
                    <div class="correct-answer ">
                        ${sentenceObj.translation}
                    </div>
                    <br>
                    <button id="continue-btn" class="btn btn-outline-success">
                        Continue
                    </button>
                `
        }
        continueBtnEvents()
    }

    specialCharactersEvents();
    FooterEvents();

    var checkBtn = document.getElementById('check-btn');
    checkBtn.addEventListener("click", function () {
        Check();
    });

    checkBtn.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            Check();
        }
    });

    var wordsInSentence = document.getElementById('words-in-sentence')
    for (i in sentenceObj.words_in_sentence) {
        if (sentenceObj.words_in_sentence[i].missing_translation) {
            wordsInSentence.innerHTML += `
                <div class="words-in-sentence">${sentenceObj.words_in_sentence[i].word}
                    <span class="word-meanings-hint">
                        Missing translation  
                    </span>
                </div>
                `
        }
        else {
            wordsInSentence.innerHTML += `
                <div class="words-in-sentence">${sentenceObj.words_in_sentence[i].word}
                    <span class="word-meanings-hint">
                        Meaning:${sentenceObj.words_in_sentence[i].meaning}
                        <hr>
                        Definition: ${sentenceObj.words_in_sentence[i].definition}
                    </span>
                </div>
                `
        }
    };

    document.getElementById("speak-btn").addEventListener("click", function () {
        speakS(sentenceObj.sentence);
    });

    //document.querySelector('.someParentDiv span').firstChild.textContent;
    const words = document.querySelectorAll('.words-in-sentence');
    words.forEach(wrd => wrd.addEventListener('mouseover', event => {
        //console.log(wrd.firstChild.textContent)
        speakS(wrd.firstChild.textContent);
    }));

    //split the meaning -> word bank
    var rdn = Math.floor(Math.random() * meaningList.length)
    var sentence_translation = meaningList[rdn].trim()
    var wordsList = sentence_translation.split(" ")
    var wordsBank = document.getElementById('word-bank');

    for (let i = 0; i < wordsList.length; i++) {
        if (Math.round(Math.random()) == 0)
            wordsBank.insertAdjacentHTML("afterbegin", `<button class="btn btn-outline-secondary word-btn">${wordsList[i]}</button>`)
        else
            wordsBank.insertAdjacentHTML("afterbegin", `<button class="btn btn-outline-secondary word-btn">${wordsList[i]}</button>`)
    }

    useKeyboardOrWordbank();
    challenge.style.display = "block";
    tapEventsWithOutSpeak();
}

function challengeSentenceTranslateTheTranslation(bigObj) {
    const sentenceObj = bigObj.sentenceObj;
    const meaningList = sentenceObj.translation.toLowerCase().split('/')
    for (i in meaningList) {
        meaningList[i] = meaningList[i].trim()
    }
    var rdn = Math.floor(Math.random() * meaningList.length)
    var sentence_translation = meaningList[rdn].trim()

    challenge.innerHTML = `
        <h1>
            <span>Write this in ${languageLearning}</span>
        </h1>
        <div>
            <div id="words-in-meaning"></div>
            <hr>
            <div id="answer-input">
                <div id="use-keyboard">
                    <textarea id="answer" maxlength='${sentenceObj.sentence.length}' placeholder="Type in ${languageLearning}" style="margin: 0px; width: 390px; height: 91px;" autofocus></textarea>
                    <hr>
                    <div id="special-characters-in-german" style="display: none">
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                    </div>
                </div>
                <div id="use-word-bank">
                    <div id="lines-input" dir="ltr"></div>
                    <hr>
                    <div id="word-bank" dir="ltr"></div>
                </div>
            </div>
        </div>
        `

    var complimentList = ['Awesome!', 'Great!', 'Correct!', 'Good job!', 'Nice job!', 'Nice!', 'Nicely done!', 'Amazing!'];
    answerEvents();
    var answer = document.getElementById('answer');
    answer.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            if (this.value.length > 0) {
                answer.disabled = true;
                Check();
            }
        }
    });

    function Check() {
        var useKeyboard = document.getElementById("use-keyboard");
        var useWordBank = document.getElementById("use-word-bank");
        var linesInput = document.getElementById('lines-input');

        if (window.getComputedStyle(useKeyboard).display === "block") {
            if (answer.value.toLowerCase() === sentenceObj.sentence.toLowerCase()) {
                displayFooter(true);
                bigObj.complete = true;
            }
            else {
                displayFooter(false);
            }
        }
        else if (window.getComputedStyle(useWordBank).display === "block") {
            linesInputContent = linesInput.textContent.replace(/\s\s+/g, ' ').trim();
            if (linesInputContent.toLowerCase() === sentenceObj.sentence.toLowerCase()) {
                displayFooter(true);
                bigObj.complete = true;
            }
            else {
                displayFooter(false);
            }
        }
    }

    function displayFooter(bool) {
        if (bool) {
            answer.disabled = true;
            var i = Math.floor(Math.random() * complimentList.length);
            footer.innerHTML = `
                    <h2>${complimentList[i]}</h2>
                    <button id="continue-btn" class="btn btn-outline-success">
                        Continue
                    </button>
                `
        }
        else {
            answer.disabled = true;
            footer.innerHTML = `
                    <h2>Correct answer:</h2>
                    <div class="correct-answer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" id="speak-sentence" style="cursor: pointer" class="bi bi-soundwave" viewBox="0 0 22 22">
                            <path fill-rule="evenodd" d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5zm-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5zm12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z"></path>
                        </svg>
                        ${sentenceObj.sentence}
                        <br>
                        ${sentenceObj.translation}
                    </div>
                    <button id="continue-btn" class="btn btn-outline-success">
                        Continue
                    </button>
                `
            document.getElementById("speak-sentence").addEventListener("click", function () {
                speakS(sentenceObj.sentence);
            });
        }
        continueBtnEvents()

    }

    specialCharactersEvents();
    FooterEvents();

    var checkBtn = document.getElementById('check-btn');
    checkBtn.addEventListener("click", function () {
        Check();
    });

    checkBtn.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            Check();
        }
    });

    var wordsInMeaning = document.getElementById('words-in-meaning');
    wordsInMeaning.innerHTML = `<div >${sentence_translation}</div>`

    //split the sentence -> word bank
    var wordsBank = document.getElementById('word-bank');

    var wordList = sentenceObj.sentence.split(" ")
    var wordsBankList = wordsList.slice()
    const o = wordsBankList.length
    var mess_words = 0

    for (let i = 0; i < wordList.length; i++) {
        const random = Math.floor(Math.random() * wordsBankList.length);
        if (Math.random() > 0.3) {
            if (mess_words < 4) {
                if (Math.round(Math.random()) == 0)
                    wordsBank.insertAdjacentHTML("afterbegin", `<button class="btn btn-outline-secondary word-btn">${wordsBankList[random]}</button>`)
                else
                    wordsBank.insertAdjacentHTML("beforeend", `<button class="btn btn-outline-secondary word-btn">${wordsBankList[random]}</button>`)
                wordsBankList.splice(random, 1);
                mess_words++
            }
        }

        if (Math.round(Math.random()) == 0)
            wordsBank.insertAdjacentHTML("afterbegin", `<button class="btn btn-outline-secondary word-btn">${wordList[i]}</button>`)
        else
            wordsBank.insertAdjacentHTML("beforeend", `<button class="btn btn-outline-secondary word-btn">${wordList[i]}</button>`)
    }

    useKeyboardOrWordbank();
    challenge.style.display = "block";
    tapEventsWithSpeak();
}

function challengeSentenceListenTheSentence(bigObj) {
    const sentenceObj = bigObj.sentenceObj;
    speakS(sentenceObj.sentence);
    challenge.innerHTML = `
        <h1 id="challenge-header">
            <span>Type what you hear</span>
        </h1>
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" id="speak-btn" style="cursor: pointer" class="bi bi-soundwave" viewBox="0 0 22 22">
                <path fill-rule="evenodd" d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5zm-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5zm12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z"></path>
            </svg>
            <br>
            <hr>
            <div id="answer-input">
                <div id="use-keyboard">
                    <textarea id="answer" maxlength='${sentenceObj.sentence.length}' placeholder="Type in ${languageSpeaking}" style="margin: 0px; width: 390px; height: 91px;" autofocus></textarea>
                    <hr>
                    <div id="special-characters-in-german" style="display: none">
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                        <button class="btn special-characters" type="submit">??</button>
                    </div>
                </div>
                <div id="use-word-bank">
                    <div id="lines-input" dir="ltr"></div>
                    <hr>
                    <div id="word-bank" dir="ltr"></div>
                </div>
            </div>
        </div>
        `

    document.getElementById("speak-btn").addEventListener("click", function () {
        speakS(sentenceObj.sentence);
    });

    var complimentList = ['Awesome!', 'Great!', 'Correct!', 'Good job!', 'Nice job!', 'Nice!', 'Nicely done!', 'Amazing!'];
    answerEvents();
    var answer = document.getElementById('answer');
    answer.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            if (this.value.length > 0) {
                answer.disabled = true;
                Check();
            }
        }
    });

    function Check() {
        var useKeyboard = document.getElementById("use-keyboard");
        var useWordBank = document.getElementById("use-word-bank");
        var linesInput = document.getElementById('lines-input');

        if (window.getComputedStyle(useKeyboard).display === "block") {
            if (answer.value.toLowerCase() === sentenceObj.sentence.toLowerCase()) {
                displayFooter(true);
                bigObj.complete = true;
            }
            else {
                displayFooter(false);
            }
        }
        else if (window.getComputedStyle(useWordBank).display === "block") {
            linesInputContent = linesInput.textContent.replace(/\s\s+/g, ' ').trim();
            if (linesInputContent.toLowerCase() === sentenceObj.sentence.toLowerCase()) {
                displayFooter(true);
                bigObj.complete = true;
            }
            else {
                displayFooter(false);
            }
        }
    }

    function displayFooter(bool) {
        if (bool) {
            answer.disabled = true;
            var i = Math.floor(Math.random() * complimentList.length);
            footer.innerHTML = `
                <h2>${complimentList[i]}</h2>
                <button id="continue-btn" class="btn btn-outline-success">
                    Continue
                </button>
            `
        }
        else {
            answer.disabled = true;
            footer.innerHTML = `
                <h2>Correct answer:</h2>
                <div class="correct-answer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" id="speak-sentence" style="cursor: pointer" class="bi bi-soundwave" viewBox="0 0 22 22">
                            <path fill-rule="evenodd" d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5zm-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5zm12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z"></path>
                    </svg>
                    ${sentenceObj.sentence}
                    <br>
                    Translation:
                    ${sentenceObj.translation}
                </div>
                <button id="continue-btn" class="btn btn-outline-success">
                    Continue
                </button>
            `
            document.getElementById("speak-sentence").addEventListener("click", function () {
                speakS(sentenceObj.sentence);
            });
        }
        continueBtnEvents()
    }

    specialCharactersEvents();
    FooterEvents();

    var checkBtn = document.getElementById('check-btn');
    checkBtn.addEventListener("click", function () {
        Check();
    });

    checkBtn.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            Check();
        }
    });

    var wordsBank = document.getElementById('word-bank');

    //split the sentence -> word bank
    wordList = sentenceObj.sentence.split(" ")
    var wordsBankList = wordsList.slice()
    const o = wordsBankList.length
    var mess_words = 0

    for (let i = 0; i < wordList.length; i++) {
        const random = Math.floor(Math.random() * wordsBankList.length);
        if (Math.random() > 0.3) {
            if (mess_words < 4) {
                if (Math.round(Math.random()) == 0)
                    wordsBank.insertAdjacentHTML("afterbegin", `<button class="btn btn-outline-secondary word-btn">${wordsBankList[random]}</button>`)
                else
                    wordsBank.insertAdjacentHTML("beforeend", `<button class="btn btn-outline-secondary word-btn">${wordsBankList[random]}</button>`)
                wordsBankList.splice(random, 1);
                mess_words++
            }
        }

        if (Math.round(Math.random()) == 0)
            wordsBank.insertAdjacentHTML("afterbegin", `<button class="btn btn-outline-secondary word-btn">${wordList[i]}</button>`)
        else
            wordsBank.insertAdjacentHTML("beforeend", `<button class="btn btn-outline-secondary word-btn">${wordList[i]}</button>`)
    }

    useKeyboardOrWordbankAndChangeChallengeHeader();
    challenge.style.display = "block";
    tapEventsWithSpeak();
}
