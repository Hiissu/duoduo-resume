import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { catHighFiveGif } from "../../../assets/gifs";
import { DISCORD_IDEAS_URL, LEARN_URL } from "../../../configs/navigators";

const Congratulation = ({
  challenges,
  collectionDetail,
  isPracticeAgain,
  setIsPracticeAgain,
  // updatePointsInUnit,
  // updatePointsInLearned,
}) => {
  const dispatch = useDispatch();
  const { learned } = useSelector((state) => state.user);

  const onUpdatePointsInLearned = (payload) => {
    // dispatch(updatePointsInLearned({payload}));
  };

  const updateIfExist = (array, element) => {
    const index = array.findIndex(
      (element) => element.id === element.object.id
    );
    if (index > -1) {
      const prevRecord = array[index];
      const newPoints = {
        writing: prevRecord.writing + element.points.writing,
        reading: prevRecord.reading + element.points.reading,
        speaking: prevRecord.speaking + element.points.speaking,
        listening: prevRecord.listening + element.points.listening,
      };

      array[index] = {
        ...prevRecord,
        points: newPoints,
      };
    } else {
      const newWordRecord = {
        ...element.object,
        points: element.points,
      };
      array.push(newWordRecord);
    }
  };

  const updateUnknownIfExist = (array, element) => {
    const index = array.findIndex(
      (element) => element.id === element.object.id
    );
    if (index > -1) {
      const prevRecord = array[index];
      const newPoints = {
        writing: prevRecord.writing + element.points.writing,
        reading: prevRecord.reading + element.points.reading,
        speaking: prevRecord.speaking + element.points.speaking,
        listening: prevRecord.listening + element.points.listening,
      };

      array[index] = {
        ...prevRecord,
        points: newPoints,
      };
    }
  };

  useEffect(() => {
    // reorganization for update learned
    const challengesOfWord = [];
    const challengesOfPhrase = [];
    const challengesOfSentence = [];

    const challengesOfUnknownWord = [];
    const challengesOfUnknownPhrase = [];
    const challengesOfUnknownSentence = [];

    challenges.forEach((challenge) => {
      switch (challenge.of) {
        case "word":
          updateIfExist(challengesOfWord, challenge);
          break;

        case "unknown_word":
          updateIfExist(challengesOfUnknownWord, challenge);
          break;

        case "phrase":
          updateIfExist(challengesOfPhrase, challenge);
          break;

        case "unknown_phrase":
          updateIfExist(challengesOfUnknownPhrase, challenge);
          break;

        case "sentence":
          updateIfExist(challengesOfSentence, challenge);
          break;

        case "unknown_sentence":
          updateIfExist(challengesOfUnknownSentence, challenge);
          break;

        default:
          break;
      }
    });

    const wordRecords = learned.words;
    challengesOfWord.forEach((element) => {
      updateIfExist(wordRecords, element);
    });

    const phraseRecords = learned.phrases;
    challengesOfPhrase.forEach((element) => {
      updateIfExist(phraseRecords, element);
    });

    const sentenceRecords = learned.sentences;
    challengesOfSentence.forEach((element) => {
      updateIfExist(sentenceRecords, element);
    });

    const unknownWordsInUnit = collectionDetail.unknown_words;
    challengesOfUnknownWord.forEach((element) => {
      updateUnknownIfExist(unknownWordsInUnit, element);
    });

    const unknownPhrasesInUnit = collectionDetail.unknown_phrases;
    challengesOfUnknownPhrase.forEach((element) => {
      updateUnknownIfExist(unknownPhrasesInUnit, element);
    });

    const unknownSentencesInUnit = collectionDetail.unknown_sentences;
    challengesOfUnknownSentence.forEach((element) => {
      updateUnknownIfExist(unknownSentencesInUnit, element);
    });

    // do update learned in reducer
    // updatePointsInLearned(wordRecords, phraseRecords, sentenceRecords);

    // updatePointsInUnit(
    //   collectionDetail.id,
    //   unknownWordsInUnit,
    //   unknownPhrasesInUnit,
    //   unknownSentencesInUnit
    // );

    // do update learned in backend send
    // challengesOfWord
    // challengesOfPhrase;
    // challengesOfSentence;
    // challengesOfUnknownWord;
    // challengesOfUnknownPhrase;
    // challengesOfUnknownSentence;
    // challengesOfWord;
  }, [challenges, learned, collectionDetail]);

  const navigate = useNavigate();
  const navigate2Home = () => {
    navigate(LEARN_URL);
  };
  return (
    <>
      <div className="congrat-complete">
        <img
          src={catHighFiveGif}
          alt="congrats-meow"
          className="congrat-meow"
        />
        <h3 className="mt-2">Waooo Congratulation! You have finished it.</h3>

        {/* if not learning add this collection to my learning list */}

        <div className="mt-3">
          Contribute new ideas about practice{" "}
          <a target="_blank" href={DISCORD_IDEAS_URL} rel="noreferrer">
            come to DuoDuo on Discord {"<"}3
          </a>
          .
        </div>
      </div>
      <div className="congrat-footer">
        {/* <div>Preview Collection  || show Track list correct and incorrect</div> */}

        <div className="congrat-wrapper">
          <button className="btn btn-secondary" onClick={navigate2Home}>
            Back to Home
          </button>
          <button
            className="btn btn-success"
            onClick={() => setIsPracticeAgain(!isPracticeAgain)}
          >
            Practice Again
          </button>
        </div>
      </div>
    </>
  );
};

export default memo(Congratulation);
