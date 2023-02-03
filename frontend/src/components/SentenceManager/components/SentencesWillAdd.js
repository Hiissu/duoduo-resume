import React from "react";
import { BsX } from "react-icons/bs";
import { TooltipBasic } from "../../Tooltip";

const SentencesWillAdd = ({
  querySentenceInWill,
  sentencesInAddList,
  onCancelAddSentence,
}) => {
  return (
    <div className="sm-sentences-will-add">
      {sentencesInAddList.length > 0 ? (
        sentencesInAddList.map(
          (so) =>
            so.sentence.toLowerCase().indexOf(querySentenceInWill) > -1 && (
              <div key={so.id}>
                <div className="sm-sentence mt-2 mb-2 text-blue">
                  <div className="sm-sentence-sentence">{so.sentence}</div>
                  <TooltipBasic text={"Cancel Add"}>
                    <button
                      className="btn btn-outline-secondary text-blue"
                      onClick={() => onCancelAddSentence(so)}
                    >
                      <BsX />
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

export default SentencesWillAdd;
