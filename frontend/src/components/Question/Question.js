import React from "react";
import "./Alert.css";
import { Modal } from "../Modal";
import { BsX } from "react-icons/bs";

const Question = ({ children }) => {
  const normalQuestion = {
    type: "normal",
    question: "",
    correctAnswers: [{ reason: "", answer: "" }],
    incorrectAnswers: [{ reason: "", answer: "" }],
  };

  // give reason for your answer
  // fill the gaps
  const fillInQuestion = {
    type: "fill",
    question: [
      { type: "text", text: "" },
      {
        type: "gap",
        gap: "",
        correctAnswers: [{ reason: "", answer: "" }],
        incorrectAnswers: [{ reason: "", answer: "" }],
      },
      { type: "text", text: "" },
    ],
  };

  const story = {
    type: "story",
    story: [
      // normaltext or question
    ],
  };
  // word/phrase/sentence with specific translation

  return <></>;
};

export default Question;
