import React, { memo, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Text } from "@nextui-org/react";
import {
  BsCheckLg,
  BsKeyboard,
  BsPuzzle,
  BsXCircleFill,
  BsExclamationLg,
} from "react-icons/bs";
import { updateAnswerType } from "../../../store/slices/settingSlice";

const ChallengeFooter = ({
  challenge,
  isError,
  isSuccess,
  isChecking,
  isDisableCheck,
  cannotListen,
  handleListen,
  handleCheck,
  handleContinue,
}) => {
  const dispatch = useDispatch();
  const { answerType } = useSelector((state) => state.setting);

  const onUpdateAnswerType = useCallback(
    (type) => {
      dispatch(updateAnswerType(type));
    },
    [dispatch]
  );

  const optionsForAnswer = useCallback(() => {
    switch (answerType) {
      case "keyboard":
        return (
          <button
            className="btn btn-outline-secondary"
            onClick={(e) => {
              onUpdateAnswerType("wordbank");
              e.currentTarget.blur();
            }}
          >
            <BsKeyboard size="22" className="me-2 mb-1" />
            <span>USE KEYBOARD</span>
          </button>
        );
      case "wordbank":
        return (
          <button
            className="btn btn-outline-secondary"
            onClick={(e) => onUpdateAnswerType("keyboard")}
          >
            {/* <BsBricks /> */}
            <BsPuzzle size={22} className="me-2 mb-1" />
            <span>USE WORD BANK</span>
          </button>
        );

      default:
        break;
    }
  }, [answerType, onUpdateAnswerType]);

  const normalFooter = useCallback(() => {
    return (
      <>
        {challenge.type === "listening" ? (
          <button
            className="btn btn-outline-secondary"
            onClick={() => handleListen()}
          >
            <span>CAN'T LISTEN NOW</span>
          </button>
        ) : (
          <button
            className="btn btn-outline-secondary"
            onClick={() => handleCheck()}
          >
            <span className="ms-4 me-4">SKIP</span>
          </button>
        )}

        {challenge.type !== "meeting" && optionsForAnswer()}

        <button
          className={`btn ${isDisableCheck ? "btn-secondary" : "btn-success"}`}
          disabled={isDisableCheck}
          onClick={() => handleCheck()}
        >
          <span className="ms-4 me-4">CHECK</span>
        </button>
      </>
    );
  }, [
    challenge.type,
    handleCheck,
    handleListen,
    isDisableCheck,
    optionsForAnswer,
  ]);

  const [complimentList] = useState([
    "Amazing!",
    "Awesome!",
    "Correct!",
    "Great!",
    "Good job!",
    "Nice!",
    "Nice job!",
    "Nicely done!",
    "Meow!",
    "Meow you!",
  ]);

  const correctSolution = useCallback(() => {
    switch (challenge.type) {
      case "meeting":
      case "translate-learning":
        return challenge.meanings[
          Math.floor(Math.random() * challenge.meanings.length)
        ];

      case "choose-definition":
        return challenge.definitions[
          Math.floor(Math.random() * challenge.definitions.length)
        ];

      case "translate-speaking":
      case "definition-of":
      case "listening":
        return challenge.object.phrase;

      default:
        break;
    }
  }, [challenge]);

  const successFooter = useCallback(() => {
    return (
      <>
        <div className="d-flex flex-direction-column justify-content-center">
          <BsCheckLg size={62} color={"#58a700"} className="me-4" />
          <div className="footer-message">
            <Text
              h2
              size={24}
              css={{
                color: "#58a700",
                lineHeight: "30px",
                fontWeight: "700",
              }}
              weight="bold"
            >
              {
                complimentList[
                  Math.floor(Math.random() * complimentList.length)
                ]
              }
            </Text>
            <Text
              h2
              size={17}
              css={{
                color: "#58a700",
                fontWeight: "500",
              }}
              weight="bold"
            >
              {correctSolution()}
            </Text>
          </div>
        </div>
        <button
          className="btn btn-success btn-continue"
          onClick={() => handleContinue()}
        >
          <span>CONTINUE</span>
        </button>
      </>
    );
  }, [complimentList, correctSolution, handleContinue]);

  const errorFooter = useCallback(() => {
    return (
      <>
        <div className="d-flex flex-direction-column justify-content-center">
          {/* BsXLg */}
          <BsXCircleFill size={62} color={"#ea2b2b"} className="me-4" />
          <div className="footer-message">
            <Text
              h2
              size={24}
              css={{
                color: "#ea2b2b",
                lineHeight: "30px",
                fontWeight: "700",
              }}
              weight="bold"
            >
              Correct solution:
            </Text>
            <Text
              size={18}
              css={{
                color: "#ea2b2b",
                fontWeight: "500",
              }}
              weight="bold"
            >
              {correctSolution()}
            </Text>
          </div>
        </div>
        <button
          className="btn btn-danger btn-continue"
          onClick={() => handleContinue()}
        >
          <span>CONTINUE</span>
        </button>
      </>
    );
  }, [correctSolution, handleContinue]);

  const cannotListenFooter = useCallback(() => {
    return (
      <>
        <div className="d-flex flex-direction-column justify-content-center">
          <BsExclamationLg size={62} color={"#cd7900"} className="me-4" />
          <div className="footer-message">
            <Text
              h2
              size={24}
              css={{
                color: "#cd7900",
                lineHeight: "30px",
                fontWeight: "700",
                marginBottom: "12px",
              }}
              weight="bold"
            >
              No listening exercises.
            </Text>
            <Text
              h2
              size={17}
              css={{
                color: "#cd7900",
                fontWeight: "500",
              }}
              weight="bold"
            >
              They will be back in 1 hour.
            </Text>
          </div>
        </div>
        <button
          className="btn btn-warning btn-continue"
          onClick={() => handleContinue()}
        >
          <span>CONTINUE</span>
        </button>
      </>
    );
  }, [handleContinue]);

  const whichFooter = useCallback(() => {
    if (isError) return errorFooter();
    else if (isSuccess) return successFooter();
    else if (cannotListen) return cannotListenFooter();
    else return normalFooter();
  }, [
    cannotListen,
    cannotListenFooter,
    errorFooter,
    isError,
    isSuccess,
    normalFooter,
    successFooter,
  ]);

  const footerFlag = useCallback(() => {
    if (isError) return "error-footer";
    else if (isSuccess) return "success-footer";
    else if (cannotListen) return "warning-footer";
    else return "";
  }, [cannotListen, isError, isSuccess]);

  return (
    <>
      <div
        className={`challenge-footer ${footerFlag()} ${
          !isChecking ? "fade-in" : ""
        }`}
      >
        <div className="footer-wrapper">{whichFooter()}</div>
      </div>
    </>
  );
};

export default memo(ChallengeFooter);
