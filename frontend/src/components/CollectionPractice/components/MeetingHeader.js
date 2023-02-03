import React, { useState, useEffect, memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Text } from "@nextui-org/react";
import { IconButton } from "@mui/material";
import { BsVolumeUp } from "react-icons/bs";
import { onSpeak } from "../../../store/slices/settingSlice";

const MeetingHeader = ({ challenge, setAnswer, isChecking }) => {
  const dispatch = useDispatch();

  const [randomIndex, setRandomIndex] = useState(0);
  const [randomChoice] = useState(Math.floor(Math.random() * 3));
  const [choiceIndex, setChoiceIndex] = useState(-1);
  const [answersInIndex, setAnswersInIndex] = useState([]);

  // useEffect(() => {
  //   setRandomIndex(Math.floor(Math.random() * (challenge.meanings.length - 1)));
  //   setChoiceIndex(-1);
  // }, [challenge]);

  const handleNumChoice = useCallback(
    (e) => {
      const key = e.key;
      if (Number.isInteger(Number(key))) {
        const index = parseInt(key);
        console.log("handleNumChoice", index, answersInIndex);

        if (index < answersInIndex.length + 1) {
          setChoiceIndex(index);
          setAnswer(answersInIndex[index - 1]);
        }
      }
    },
    [answersInIndex, setAnswer]
  );

  useEffect(() => {
    document.body.addEventListener("keydown", handleNumChoice);

    return () => {
      document.body.removeEventListener("keydown", handleNumChoice);
    };
  }, [handleNumChoice]);

  const handleChoice = (answer, index) => {
    if (!isChecking) {
      setAnswer(answer);
      setChoiceIndex(index);
    }
  };

  const choicesForMeeting = () => {
    const choices = [];
    const choiceIndexes = [];

    for (let index = 0; index < 3; index++) {
      const indexPlus = index + 1;

      if (index === randomChoice) {
        choices.push(
          <div
            className={`meet-wrapper ${
              indexPlus === choiceIndex ? "chose-index" : ""
            }`}
            onClick={() =>
              handleChoice(challenge.meanings[randomIndex], indexPlus)
            }
          >
            <span className="answer-index">{indexPlus}</span>
            <div className="answer-text">{challenge.meanings[randomIndex]}</div>
          </div>
        );

        choiceIndexes.push(challenge.meanings[randomIndex]);
      } else {
        const possibleIndex = Math.floor(
          Math.random() * (challenge.decoys.length - 1)
        );
        choices.push(
          <div
            className={`meet-wrapper ${
              indexPlus === choiceIndex ? "chose-index" : ""
            }`}
            onClick={() =>
              handleChoice(challenge.decoys[possibleIndex], indexPlus)
            }
          >
            <span className="answer-index">{indexPlus}</span>
            <div className="answer-text">{challenge.decoys[possibleIndex]}</div>
          </div>
        );
        choiceIndexes.push(challenge.decoys[possibleIndex]);
      }
    }

    if (JSON.stringify(answersInIndex) !== JSON.stringify(choiceIndexes))
      setAnswersInIndex(choiceIndexes);
    return choices;
  };

  return (
    <>
      <Text h2 size={32} weight="bold" className="text-align-justify mb-4">
        <IconButton
          onClick={() => dispatch(onSpeak(challenge.object.phrase, false))}
        >
          <BsVolumeUp size={32} className="me-2" />
        </IconButton>
        <span>How do you say "{challenge.object.phrase}"?</span>
      </Text>
      <div className="header-meet">
        {choicesForMeeting().map((element, index) => (
          <div key={index}>{element}</div>
        ))}
      </div>
    </>
  );
};

export default memo(MeetingHeader);
