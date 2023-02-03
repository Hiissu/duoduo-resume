var scrollUpBtn = document.getElementById("scroll-up-btn");
window.onscroll = () => {
  if (
    document.body.scrollTop > 220 ||
    document.documentElement.scrollTop > 220
  ) {
    scrollUpBtn.style.display = "block";
  } else {
    scrollUpBtn.style.display = "none";
  }
};

scrollUpBtn.addEventListener("click", () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

var showWordsBtn = document.getElementById("words-btn");
var showPhrasesBtn = document.getElementById("phrases-btn");
var showSentencesBtn = document.getElementById("sentences-btn");
var showCollectionsBtn = document.getElementById("lessons-btn");

var wordSection = document.getElementById("word-section");
var phraseSection = document.getElementById("phrase-section");
var sentenceSection = document.getElementById("sentence-section");
var lessonSection = document.getElementById("lesson-section");

var searchWord = document.getElementById("search-word");
var searchPhrase = document.getElementById("search-phrase");
var searchSentence = document.getElementById("search-sentence");
var searchCollection = document.getElementById("search-lesson");

function showWords() {
  if (wordSection.style.display == "none") {
    showWordsBtn.classList.replace("btn-outline-secondary", "btn-secondary");
    showPhrasesBtn.classList.replace("btn-secondary", "btn-outline-secondary");
    showSentencesBtn.classList.replace(
      "btn-secondary",
      "btn-outline-secondary"
    );
    showCollectionsBtn.classList.replace(
      "btn-secondary",
      "btn-outline-secondary"
    );

    wordSection.style.display = "block";
    searchWord.focus();
    phraseSection.style.display = "none";
    sentenceSection.style.display = "none";
    lessonSection.style.display = "none";
    // history.pushState(null,  course-detail' course_learning.id %}?section=word`);
  } else {
    wordSection.style.display = "none";
    showWordsBtn.classList.replace("btn-secondary", "btn-outline-secondary");
  }
}

showWordsBtn.addEventListener("click", () => {
  showWords();
});

function showPhrases() {
  if (phraseSection.style.display == "none") {
    showPhrasesBtn.classList.replace("btn-outline-secondary", "btn-secondary");
    showWordsBtn.classList.replace("btn-secondary", "btn-outline-secondary");
    showSentencesBtn.classList.replace(
      "btn-secondary",
      "btn-outline-secondary"
    );
    showCollectionsBtn.classList.replace(
      "btn-secondary",
      "btn-outline-secondary"
    );

    phraseSection.style.display = "block";
    searchPhrase.focus();
    wordSection.style.display = "none";
    sentenceSection.style.display = "none";
    lessonSection.style.display = "none";
  } else {
    phraseSection.style.display = "none";
    showPhrasesBtn.classList.replace("btn-secondary", "btn-outline-secondary");
  }
}

showPhrasesBtn.addEventListener("click", () => {
  showPhrases();
});

function showSentences() {
  if (sentenceSection.style.display == "none") {
    showSentencesBtn.classList.replace(
      "btn-outline-secondary",
      "btn-secondary"
    );
    showPhrasesBtn.classList.replace("btn-secondary", "btn-outline-secondary");
    showWordsBtn.classList.replace("btn-secondary", "btn-outline-secondary");
    showCollectionsBtn.classList.replace(
      "btn-secondary",
      "btn-outline-secondary"
    );

    sentenceSection.style.display = "block";
    searchSentence.focus();
    wordSection.style.display = "none";
    phraseSection.style.display = "none";
    lessonSection.style.display = "none";
  } else {
    sentenceSection.style.display = "none";
    showSentencesBtn.classList.replace(
      "btn-secondary",
      "btn-outline-secondary"
    );
  }
}

showSentencesBtn.addEventListener("click", () => {
  showSentences();
});

function showCollections() {
  if (lessonSection.style.display == "none") {
    showCollectionsBtn.classList.replace(
      "btn-outline-secondary",
      "btn-secondary"
    );
    showSentencesBtn.classList.replace(
      "btn-secondary",
      "btn-outline-secondary"
    );
    showPhrasesBtn.classList.replace("btn-secondary", "btn-outline-secondary");
    showWordsBtn.classList.replace("btn-secondary", "btn-outline-secondary");

    lessonSection.style.display = "block";
    searchCollection.focus();
    wordSection.style.display = "none";
    phraseSection.style.display = "none";
    sentenceSection.style.display = "none";
  } else {
    lessonSection.style.display = "none";
    showCollectionsBtn.classList.replace(
      "btn-secondary",
      "btn-outline-secondary"
    );
  }
}

showCollectionsBtn.addEventListener("click", () => {
  showCollections();
});
