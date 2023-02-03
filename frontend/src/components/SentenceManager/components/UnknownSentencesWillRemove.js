import React from "react";
import { BsArrowClockwise } from "react-icons/bs";
import { TooltipBasic } from "../../Tooltip";

const UnknownSentencesWillRemove = ({
  querySentenceInWill,
  unknownSentencesInRemoveList,
  onCancelRemoveUnknownSentence,
}) => {
  return (
    <div className="sm-sentences-will-remove">
      {unknownSentencesInRemoveList.length > 0 ? (
        unknownSentencesInRemoveList.map(
          (uso, i) =>
            uso.sentence.toLowerCase().indexOf(querySentenceInWill) > -1 && (
              <div key={i}>
                <div className="sm-sentence mt-2 mb-2 text-pink">
                  <div className="sm-sentence-sentence">{uso.sentence}</div>
                  <TooltipBasic text={"Cancel Remove"}>
                    <button
                      className="btn btn-outline-secondary text-pink"
                      onClick={() => onCancelRemoveUnknownSentence(uso)}
                    >
                      <BsArrowClockwise />
                    </button>
                  </TooltipBasic>
                </div>
              </div>
            )
        )
      ) : (
        <div className="text-center">
          <small>None</small>
        </div>
      )}
    </div>
  );
};

export default UnknownSentencesWillRemove;
