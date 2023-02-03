import React from "react";

const FillQuestion = () => {
  return (
    <>
      <div>Select the missing word</div>
      <div>
        Question bla bla <span className="blank"></span>
      </div>

      <div className="choice"></div>
      <div className="choice"></div>
      <div className="choice"></div>

      <footer>
        <span>Correct solution: essen </span>
        <span>Meaning: What are we going to eat?</span>
      </footer>
    </>
  );
};

export default FillQuestion;
