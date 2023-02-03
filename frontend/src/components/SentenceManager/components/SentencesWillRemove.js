import React from "react";
import { BsArrowClockwise } from "react-icons/bs";
import { TooltipBasic } from "../../Tooltip";

const SentencesWillRemove = ({
  querySentenceInWill,
  sentencesInRemoveList,
  onCancelRemoveSentence,
}) => {
  return (
    <div className="sm-sentences-will-remove">
      {sentencesInRemoveList.length > 0 ? (
        sentencesInRemoveList.map(
          (so) =>
            so.sentence.toLowerCase().indexOf(querySentenceInWill) > -1 && (
              <div key={so.id}>
                <div className="sm-sentence mt-2 mb-2 text-pink">
                  <div className="sm-sentence-sentence">{so.sentence}</div>
                  <TooltipBasic text={"Cancel Remove"}>
                    <button
                      className="btn btn-outline-secondary text-pink"
                      onClick={() => onCancelRemoveSentence(so)}
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

export default SentencesWillRemove;
