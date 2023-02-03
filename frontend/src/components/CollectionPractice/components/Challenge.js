import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { ChallengeHeader, ChallengeAnswer, ChallengeFooter } from ".";

const Challenge = ({
  challenge,
  handleChallange,
  handleCannotListen,
  onPlaySuccessAudio,
  onPlayErrorAudio,
}) => {
  const { answerType } = useSelector((state) => state.setting);

  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cannotListen, setCannotListen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleListen = useCallback(() => {
    setCannotListen(true);
    setIsChecking(true);
  }, []);

  const [answer, setAnswer] = useState("");

  // convert special char to normal char
  const handleAnswer = useCallback((e) => {
    const value = e.target.value;

    setAnswer(value);
  }, []);

  const [tapAnswer, setTapAnswer] = useState("");

  const handleResult = useCallback(
    (answerForCheck) => {
      console.log("handleResult answerForCheck", answerForCheck);

      switch (challenge.type) {
        case "meeting":
        case "translate-learning":
          if (challenge.meanings.some((meaning) => meaning === answerForCheck))
            return true;
          else return false;

        case "choose-definition":
          if (
            challenge.definitions.some(
              (definition) => definition === answerForCheck
            )
          )
            return true;
          else return false;

        case "translate-speaking":
          if (
            answerForCheck === challenge.object.phrase ||
            challenge.reverses.some((reverse) => reverse === answerForCheck)
          )
            return true;
          else return false;

        case "definition-of":
        case "listening":
          if (answerForCheck === challenge.object.phrase) return true;
          else return false;

        default:
          break;
      }
    },
    [challenge]
  );

  const handleCheck = useCallback(() => {
    if (challenge.type === "meeting") {
      if (answerType === "keyboard" && !answer.length > 0) return false;
    } else {
      if (answerType === "keyboard" && !answer.length > 0) return false;
      else if (answerType === "wordbank" && !tapAnswer.length > 0) return false;
    }

    let answerEw;
    if (challenge.type === "meeting") answerEw = answer;
    else answerEw = answerType === "keyboard" ? answer : tapAnswer;

    const result = handleResult(answerEw);
    if (result) {
      onPlaySuccessAudio();
      setIsSuccess(true);
    } else {
      onPlayErrorAudio();
      setIsError(true);
    }
    setIsChecking(true);
  }, [
    challenge.type,
    answer,
    answerType,
    tapAnswer,
    handleResult,
    onPlaySuccessAudio,
    onPlayErrorAudio,
  ]);

  const handleContinue = useCallback(() => {
    if (cannotListen) {
      handleCannotListen();
      setCannotListen(false);
    } else handleChallange(isSuccess);

    setIsSuccess(false);
    setIsError(false);
    setIsChecking(false);
  }, [isSuccess, cannotListen, handleCannotListen, handleChallange]);

  const handleEnter = useCallback(
    (e) => {
      const key = e.key;
      if (key === "Enter") {
        if (isChecking) handleContinue();
        else handleCheck();
      }
    },
    [handleCheck, handleContinue, isChecking]
  );

  useEffect(() => {
    console.log("addEventListener");
    document.body.addEventListener("keydown", handleEnter);

    return () => {
      console.log("removeEventListener");
      document.body.removeEventListener("keydown", handleEnter);
    };
  }, [handleEnter]);

  useEffect(() => {
    if (!isChecking) setAnswer("");
  }, [challenge, isChecking]);

  const [isDisableCheck, setIsDisableCheck] = useState(true);
  useEffect(() => {
    if (challenge.type === "meeting" || answerType === "keyboard")
      setIsDisableCheck(!answer.trim().length > 0);
    else if (answerType === "wordbank")
      setIsDisableCheck(!tapAnswer.length > 0);
  }, [answerType, answer, tapAnswer.length, challenge.type]);

  return (
    <>
      <div className="challenge">
        <div className={`challenge-header ${!isChecking ? "slide-in" : ""}`}>
          <ChallengeHeader
            challenge={challenge}
            setAnswer={setAnswer}
            isChecking={isChecking}
          />
          <ChallengeAnswer
            challenge={challenge}
            answer={answer}
            handleAnswer={handleAnswer}
            setTapAnswer={setTapAnswer}
            isError={isError}
            isSuccess={isSuccess}
            isChecking={isChecking}
            handleCheck={handleCheck}
          />
        </div>
        <ChallengeFooter
          challenge={challenge}
          isError={isError}
          isSuccess={isSuccess}
          isChecking={isChecking}
          isDisableCheck={isDisableCheck}
          cannotListen={cannotListen}
          handleListen={handleListen}
          handleCheck={handleCheck}
          handleContinue={handleContinue}
        />
      </div>
    </>
  );
};

export default Challenge;
