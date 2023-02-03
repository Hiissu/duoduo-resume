import React, { useState } from "react";
import { BsPencil, BsX } from "react-icons/bs";
import { RemoveDeleteModal } from "../../Modal";
import { SentenceTranModal } from "../../SentenceModal";
import { TooltipBasic } from "../../Tooltip";

const UnknownSentencesWillAdd = ({
  querySentenceInWill,
  unknownSentencesInAddList,
  onEditTranOfUnknownSentence,
  onCancelAddUnknownSentence,
}) => {
  const [isRemoveUnknownSentence, setIsRemoveUnknownSentence] = useState({
    is: false,
    uso: {},
  });
  const [isTransSentence, setIsTransSentence] = useState({
    is: false,
    uso: {},
    ic: true,
  });

  const onUpdateTran = (so, translation) => {
    onEditTranOfUnknownSentence(so.sentence, translation);
  };

  return (
    <>
      {isTransSentence.is && (
        <SentenceTranModal
          onClose={() => setIsTransSentence({ ...isTransSentence, is: false })}
          so={isTransSentence.uso}
          isCreate={isTransSentence.ic}
          onAction={onUpdateTran}
        />
      )}
      {isRemoveUnknownSentence.is && (
        <RemoveDeleteModal
          onClose={() => setIsRemoveUnknownSentence({ is: false, uso: {} })}
          object={isRemoveUnknownSentence.uso}
          action={"remove"}
          subject={"sentence"}
          bridge={""}
          target={isRemoveUnknownSentence.uso.sentence}
          onAction={onCancelAddUnknownSentence}
        />
      )}
      <div className="sm-unknown-sentences-will-add">
        {unknownSentencesInAddList.length > 0 ? (
          unknownSentencesInAddList.map(
            (uso, i) =>
              uso.sentence.toLowerCase().indexOf(querySentenceInWill) > -1 && (
                <div key={i}>
                  <div className="sm-sentence mt-2 mb-2 text-blue">
                    <div className="sm-sentence-sentence">{uso.sentence}</div>
                    <TooltipBasic text={"Edit Trans"}>
                      <button
                        className="btn btn-outline-secondary text-blue"
                        onClick={() =>
                          setIsTransSentence({ is: true, uso: uso, ic: false })
                        }
                      >
                        <BsPencil />
                      </button>
                    </TooltipBasic>
                    <TooltipBasic className={"ms-1"} text={"Cancel Add"}>
                      <button
                        className="btn btn-outline-secondary text-blue"
                        onClick={() =>
                          setIsRemoveUnknownSentence({ is: true, uso: uso })
                        }
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
    </>
  );
};

export default UnknownSentencesWillAdd;
