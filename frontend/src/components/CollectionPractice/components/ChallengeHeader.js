import React, { memo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Indexes2String } from ".";
import { Text } from "@nextui-org/react";
import { BsVolumeDown, BsVolumeUp } from "react-icons/bs";
import { IconButton } from "@mui/material";
import MeetingHeader from "./MeetingHeader";
import { ImgViewerModal } from "../../Modal";
import { onSpeak } from "../../../store/slices/settingSlice";

const ChallengeHeader = ({ challenge, setAnswer, isChecking }) => {
  const dispatch = useDispatch();
  const { language_learning, language_speaking } = useSelector(
    (state) => state.course
  );

  const onSpeaker = (text) => {
    dispatch(onSpeak(text));
  };
  const [randomIndex, setRandomIndex] = useState(0);

  useEffect(() => {
    switch (challenge.type) {
      case "meeting":
      case "choose-definition":
      case "translate-learning":
      case "listening":
        // if (!isChecking)
        onSpeaker(challenge.object.phrase, false);
        break;

      default:
        break;
    }

    if (!!challenge.images) {
      const random = Math.floor(Math.random() * challenge.images.length);
      setRandomIndex(random);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge]);

  const specialChars = () => {};

  const [viewImg, setViewImg] = useState(false);
  const [isErrorImg, setIsErrorImg] = useState(false);

  const headerImage = () => {
    return (
      !isErrorImg && (
        <div className="challenge-image" onClick={() => setViewImg(!viewImg)}>
          <img
            className="challenge-image-img"
            src={challenge.images[randomIndex]}
            alt=""
            onError={() => setIsErrorImg(true)}
          />
        </div>
      )
    );
  };

  const switchHeader = () => {
    switch (challenge.type) {
      case "meeting":
        return (
          <>
            {headerImage()}
            <MeetingHeader
              challenge={challenge}
              setAnswer={setAnswer}
              isChecking={isChecking}
            />
          </>
        );

      case "choose-definition":
        return (
          <>
            <div>
              <h1>What is the definition of</h1>
              <span>
                <IconButton
                  onClick={() => onSpeaker(challenge.object.phrase, false)}
                >
                  <BsVolumeUp size={32} className="me-2" />
                </IconButton>
                "<Indexes2String indexes2String={challenge.indexes} />"
              </span>
            </div>
            {/* maybe have multiple select */}
          </>
        );

      case "translate-learning":
        return (
          <>
            <div>
              {/* <span> What does "<Indexes2String indexes2String={challenge.indexes} />" means in {language_speaking.language}? </span> */}
              <h1>Write this in {language_speaking.language}</h1>
              <span>
                <IconButton
                  onClick={() => onSpeaker(challenge.object.phrase, false)}
                >
                  <BsVolumeUp size={32} className="me-2" />
                </IconButton>
                <Indexes2String indexes2String={challenge.indexes} />
              </span>
            </div>
          </>
        );

      case "translate-speaking":
        return (
          <>
            {headerImage()}
            {/* <span> What does "{challenge.meanings[0]}" means in {language_learning.language}? </span> */}
            <h1>Write this in {language_learning.language}</h1>
            <span>{challenge.meanings[0]}</span>
          </>
        );

      case "definition-of":
        return (
          <>
            {headerImage()}
            <h1>Which one matches this definition</h1>
            <span>{challenge.definitions[0]}</span>
          </>
        );

      case "listening":
        return (
          <>
            {headerImage()}
            <Text h2 size={32} weight="bold" className="text-align-justify">
              Type what you hear
            </Text>
            <div className="d-flex flex-row justify-content-center align-items-between align-items-center">
              <IconButton
                onClick={() => onSpeaker(challenge.object.phrase, false)}
              >
                <BsVolumeUp size={68} />
              </IconButton>
              <IconButton
                onClick={() => onSpeaker(challenge.object.phrase, true)}
              >
                <BsVolumeDown size={56} />
              </IconButton>
            </div>
            {specialChars()}
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      {viewImg && (
        <ImgViewerModal
          imgUrl={challenge.images[randomIndex]}
          onClose={() => setViewImg(!viewImg)}
        />
      )}
      {switchHeader()}
    </>
  );
};

export default memo(ChallengeHeader);
