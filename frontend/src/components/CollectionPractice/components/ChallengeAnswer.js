import React, { memo, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { shuffleArray } from "../../../configs/functions";
import { onSpeak } from "../../../store/slices/settingSlice";

const ChallengeAnswer = ({
  challenge,
  answer,
  handleAnswer,
  setTapAnswer,
  isError,
  isSuccess,
  isChecking,
}) => {
  const dispatch = useDispatch();
  const { answerType } = useSelector((state) => state.setting);
  const { language_learning, language_speaking } = useSelector(
    (state) => state.course
  );

  const answerRef = useRef();

  const [inLanguage, setInLanguage] = useState("");
  const [wordBank, setWordBank] = useState([]);

  useEffect(() => {
    if (answerRef.current) {
      const end = answer.length;
      answerRef.current.setSelectionRange(end, end);
      answerRef.current.focus();
    }
  }, [answer.length, challenge, isError, isSuccess, answerType]);

  useEffect(() => {
    // get language for placeholder
    switch (challenge.type) {
      case "translate-learning":
        setInLanguage(language_speaking.language);
        break;

      case "translate-speaking":
      case "listening":
        setInLanguage(language_learning.language);
        break;

      default:
        break;
    }

    // for WordBank section
    const piecesWithOthers = [...challenge.pieces];

    const cloneOthers = challenge.others;
    const max = 6;
    const min = 4;
    const decoysNum = Math.floor(Math.random() * (max - min + 1) + min);

    for (let index = 0; index < decoysNum; index++) {
      const random = Math.floor(Math.random() * cloneOthers.length);

      if (cloneOthers.length >= decoysNum) {
        const slice = cloneOthers.splice(random, 1)[0];
        piecesWithOthers.push(slice);
      } else if (cloneOthers.length > 0) {
        const slice = cloneOthers.splice(random, 1)[0];
        piecesWithOthers.push(slice);
      }
    }

    shuffleArray(piecesWithOthers);

    const newPiecesWithOthers = piecesWithOthers.map((word, index) => ({
      content: word,
      index: index,
      chosen: false,
    }));

    setWordBank(newPiecesWithOthers);
    setWordsChosen([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge]);

  const [wordsChosen, setWordsChosen] = useState([]);

  const switchSpace = () => {
    switch (challenge.type) {
      case "translate-speaking":
      case "definition-of":
      case "listening":
        return language_learning.use_space;

      case "translate-learning":
        return language_speaking.use_space;
      default:
        return false;
    }
  };

  const switchSpeak = () => {
    switch (challenge.type) {
      case "translate-speaking":
      case "definition-of":
      case "listening":
        return true;

      case "translate-learning":
        return false;
      default:
        return false;
    }
  };

  useEffect(() => {
    let chosen2answer = "";
    const useSpace = switchSpace();
    if (useSpace) {
      wordsChosen.forEach((element) => {
        chosen2answer += element.content + " ";
      });
    } else {
      wordsChosen.forEach((element) => {
        chosen2answer += element.content;
      });
    }

    const newAnswer = chosen2answer.trim();
    setTapAnswer(newAnswer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordsChosen]);

  const handleTapWordBank = (index, content) => {
    if (!isChecking) {
      const willSpeak = switchSpeak();
      if (willSpeak) dispatch(onSpeak(content));

      const newWordBank = wordBank.map((ele) =>
        ele.index === index ? { ...ele, chosen: true } : ele
      );
      setWordBank(newWordBank);

      const newWordsChosen = [...wordsChosen, { index, content }];
      setWordsChosen(newWordsChosen);
    }
  };

  const handleTapWordsChosen = (index) => {
    if (!isChecking) {
      const newWordBank = wordBank.map((ele) =>
        ele.index === index ? { ...ele, chosen: false } : ele
      );
      setWordBank(newWordBank);

      const newWordsChosen = wordsChosen.filter((ele) => ele.index !== index);
      setWordsChosen(newWordsChosen);
    }
  };

  const answerSwitch = () => {
    switch (challenge.type) {
      case "meeting":
      case "choose-definition":
        return <></>;

      default:
        break;
    }

    switch (answerType) {
      case "keyboard":
        return (
          <textarea
            className="textswer"
            placeholder={`Type in ${inLanguage}`}
            value={answer}
            ref={answerRef}
            disabled={isError || isSuccess}
            onChange={handleAnswer}
            // onKeyDown={handleEnter}
          />
        );

      case "wordbank":
        return (
          <div className="use-wordbank">
            <div className="answer-line">
              {wordsChosen.map((element) => (
                <button
                  key={element.index}
                  className="btn btn-secondary"
                  onClick={() => handleTapWordsChosen(element.index)}
                >
                  <span>{element.content}</span>
                </button>
              ))}
            </div>
            <div className="wordbank">
              {wordBank.map((element) => (
                <button
                  key={element.index}
                  className="btn btn-secondary"
                  disabled={element.chosen}
                  onClick={() =>
                    handleTapWordBank(element.index, element.content)
                  }
                >
                  <span className={element.chosen ? "word-hide" : ""}>
                    {element.content}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        break;
    }
  };

  return <div className="challenge-answer">{answerSwitch()}</div>;
};

export default memo(ChallengeAnswer);
