import React, { useEffect, useRef, useState } from "react";
import {
  BsArrowClockwise,
  BsCloudHaze,
  BsCloudHaze2Fill,
  BsDash,
  BsPencil,
  BsPlus,
  BsQuestionCircle,
  BsSearch,
  BsX,
} from "react-icons/bs";
import { RemoveDeleteModal } from "../../Modal";
import { SentenceTranModal } from "../../SentenceModal";
import { magicSVG } from "../../SVGs";
import { TooltipBasic } from "../../Tooltip";

const Text2Sentences = ({
  text2meow,
  setText2Meow,
  sentencesInDict,
  sentencesInUnit,
  unknownSentencesInUnit,
  // ~> for sentencesInAddList
  sentencesInAddList,
  onAddSentence,
  onCancelAddSentence,
  // ~> for sentencesInRemoveList
  sentencesInRemoveList,
  onRemoveSentence,
  onCancelRemoveSentence,
  // ~> for unknownSentencesInAddList
  unknownSentencesInAddList,
  onAddUnknownSentence,
  onCancelAddUnknownSentence,
  onEditTranOfUnknownSentence,
  // ~> for unknownSentencesInRemoveList
  unknownSentencesInRemoveList,
  onRemoveUnknownSentence,
  onCancelRemoveUnknownSentence,
  // ~> for detect sentences
  sentencesInDetectedList,
  setSentencesInDetectedList,
  sentencesInUnknownList,
  setSentencesInUnknownList,
}) => {
  const [text2sentences, setText2Sentences] = useState(text2meow);
  const text2sentencesRef = useRef();

  // re-onText2Sentences after load phrasesInDict
  useEffect(() => {
    text2sentencesRef.current.focus();
    onText2Sentences();
  }, [sentencesInDict]);

  useEffect(() => {
    onText2Sentences();
  }, [text2sentences]);

  // const [regex, setRegex] = useState( /[`~!@#$%^&*()_|\n|+\-—=?;:’'"“”,.<>\r\n\{\}\[\]\\\/]/gi );
  // const [regex2Space, setRegex2Space] = useState( /[`~@#$%^&*()_|\n|+\-—=;:’'"“”<>\r\n\{\}\[\]\\\/]/gi );

  const [sentencesWithIndexes, setSentencesWithIndexes] = useState([]);
  const onText2Sentences = () => {
    // const textSplitSpace = text2sentences.replace(regex, " ").replace(/\s{2,}/g, " ").split(/[.?!]+/);

    const ends = [".", "。", "?", "!"];
    // use /.../ to escape ...  const eschr = ["/"];
    // if (eschr.indexOf(text2sentences[i - 1]) > -1 || eschr.indexOf(text2sentences[i + 1]) > -1) i++;
    let sentencesInText = [];
    for (let o = 0, s = 0, e = 0, l = text2sentences.length; o < l; o++) {
      if (ends.indexOf(text2sentences[o]) > -1) {
        // check is next char dup then continue !push
        if (text2sentences[o + 1] === text2sentences[o]) o++;
        else {
          // sentencesInText.push(text2sentences.substring(s, o + 1).trim());
          sentencesInText.push({
            sentence: text2sentences.substring(s, o + 1).trim(),
            indexes: [{ start: s, end: o + 1 }],
          });

          s = o + 1;
          e = o + 1;
        }
      }

      // add the rest
      if (o === l - 1) {
        if (s < l) {
          const theRest = text2sentences.substring(s, l).trim();
          if (theRest.length > 0) {
            sentencesInText.push({
              sentence: theRest,
              indexes: [{ start: s, end: l }],
            });
          }
        }
      }
    }

    // remove dup ends
    for (let i = 0; i < sentencesInText.length; i++) {
      // remove elem with only char is ends ['.', '?', '!']
      if (
        sentencesInText[i].sentence.length === 1 &&
        ends.indexOf(sentencesInText[i].sentence) > -1
      ) {
        sentencesInText.splice(i, 1);
        i--;
      } else {
        for (let o = 0; o < sentencesInText[i].sentence.length; o++) {
          if (ends.indexOf(sentencesInText[i].sentence[o]) > -1) {
            if (
              sentencesInText[i].sentence[o + 1] ===
              sentencesInText[i].sentence[o]
            ) {
              sentencesInText[i].sentence =
                sentencesInText[i].sentence.slice(0, o) +
                sentencesInText[i].sentence.slice(o + 1);
              o++;
              // str.substring(0, o) + str.substring(o + 1);
            }
          }
        }
      }
    }

    // sentencesInText = [...new Set(sentencesInText)];
    let newSentencesInText = [];
    // remove sentence and combine indexes if duplicate
    sentencesInText.forEach((stc) => {
      if (!newSentencesInText.some((ele) => ele.sentence === stc.sentence)) {
        newSentencesInText.push(stc);
      } else {
        newSentencesInText.forEach((ele) => {
          if (ele.sentence === stc.sentence) {
            ele.indexes = [...ele.indexes, ...stc.indexes];
          }
        });
      }
    });

    let sentencesDetected = [];
    let unknownSentences = [];

    newSentencesInText.forEach((sito) => {
      let idx = sentencesInDict.findIndex(
        (so) => so.sentence === sito.sentence
      );
      if (idx > -1) sentencesDetected.push(sentencesInDict[idx]);
      else
        unknownSentences.push({
          sentence: sito.sentence,
          translation: {
            image_url: "",
            ipa: "",
            definitions: [""],
            meanings: [
              {
                meaning: "",
                reverses: [],
              },
            ],
            note: "",
          },
        });
    });

    setSentencesWithIndexes(newSentencesInText);
    setSentencesInDetectedList(sentencesDetected);
    setSentencesInUnknownList(unknownSentences);
  };

  const onChangeText2Sentences = (e) => {
    const value = e.target.value;
    setText2Sentences(value);
  };

  const onSave2Meow = () => {
    setText2Meow(text2sentences);
  };

  const [queryMeow, setQueryMeow] = useState("");
  const onChangeQueryMeow = (e) => {
    const query = e.target.value.trim().toLowerCase();
    setQueryMeow(query);
  };

  const indexesOf = (sentence) => {
    const stcFound = sentencesWithIndexes.find(
      (ele) => ele.sentence === sentence
    );
    return stcFound.indexes;
  };

  const prevIndexesRef = useRef({ obj: "", indexa: [], lasti: 0 });
  const onClickSentence = (sentence) => {
    let selectionStart, selectionEnd;

    sentencesWithIndexes.forEach((ele) => {
      if (ele.sentence === sentence) {
        const firstIndex = ele.indexes[0];
        selectionStart = firstIndex.start;
        selectionEnd = firstIndex.end;
      }
    });

    const currentIndexes = prevIndexesRef.current;
    // check is the same object ~> true ~ index > 0
    const isIndexIn = currentIndexes.obj === sentence;
    const currentLength = currentIndexes.indexa.length;
    if (isIndexIn) {
      if (currentIndexes.lasti < currentLength - 1) {
        // -> moving to next index
        const nextIndex = currentIndexes.indexa[currentIndexes.lasti + 1];
        selectionStart = nextIndex.start;
        selectionEnd = nextIndex.end;

        prevIndexesRef.current = {
          ...currentIndexes,
          lasti: currentIndexes.lasti + 1,
        };
      } else {
        prevIndexesRef.current = {
          ...currentIndexes,
          lasti: 0,
        };
      }
    } else {
      const indexes = indexesOf(sentence);
      prevIndexesRef.current = {
        obj: sentence,
        indexa: indexes,
        lasti: 0,
      };
    }
    // or maybe scroll work with .set -> .blur -> .focus
    text2sentencesRef.current.setSelectionRange(selectionStart, selectionStart);
    text2sentencesRef.current.focus();
    text2sentencesRef.current.setSelectionRange(selectionStart, selectionEnd);
  };

  const [isRemoveSentence, setIsRemoveSentence] = useState({
    is: false,
    so: {},
  });
  const [isRemoveUnknownSentence, setIsRemoveUnknownSentence] = useState({
    is: false,
    ica: true,
    uso: {},
  });
  const [isTranSentence, setIsTranSentence] = useState({
    is: false,
    uso: {},
    ic: true,
  });

  const onDisplaySentencesInDetectedList = () => {
    const sentenceTail = (sidl) => {
      if (sentencesInAddList.some((stc) => stc.sentence === sidl.sentence)) {
        return (
          <TooltipBasic text={"Cancel Add"}>
            <button
              className="btn btn-outline-secondary text-blue"
              onClick={() => onCancelAddSentence(sidl)}
            >
              <BsArrowClockwise />
            </button>
          </TooltipBasic>
        );
      } else if (
        sentencesInRemoveList.some((stc) => stc.sentence === sidl.sentence)
      ) {
        return (
          <TooltipBasic text={"Cancel Remove"}>
            <button
              className="btn btn-outline-secondary text-pink"
              onClick={() => onCancelRemoveSentence(sidl)}
            >
              <BsArrowClockwise />
            </button>
          </TooltipBasic>
        );
      } else if (
        sentencesInUnit.some((stc) => stc.sentence === sidl.sentence)
      ) {
        return (
          <TooltipBasic text={"Remove"}>
            <button
              className="btn btn-outline-secondary text-green"
              onClick={() => setIsRemoveSentence({ is: true, so: sidl })}
            >
              <BsX />
            </button>
          </TooltipBasic>
        );
      } else {
        return (
          <TooltipBasic text={"Add"}>
            <button
              className="btn btn-outline-secondary"
              onClick={() => onAddSentence(sidl)}
            >
              <BsPlus />
            </button>
          </TooltipBasic>
        );
      }
    };

    const decorateSentence = (sidl) => {
      let className;
      if (sentencesInRemoveList.some((stc) => stc.sentence === sidl.sentence)) {
        className = "text-decoration-line-through text-pink";
      } else if (
        sentencesInAddList.some((stc) => stc.sentence === sidl.sentence)
      ) {
        className = "text-blue";
      } else if (
        sentencesInUnit.some((stc) => stc.sentence === sidl.sentence)
      ) {
        className = "text-green";
      }
      return className;
    };

    return (
      <>
        {sentencesInDetectedList.length > 0 ? (
          sentencesInDetectedList.map(
            (sidl, i) =>
              sidl.sentence.toLowerCase().indexOf(queryMeow) > -1 && (
                <div
                  key={i}
                  className={`sm-sentence mt-2 mb-2 ${decorateSentence(sidl)}`}
                >
                  <div
                    className="sm-sentence-sentence"
                    onClick={() => onClickSentence(sidl.sentence)}
                  >
                    {sidl.sentence}
                  </div>
                  <TooltipBasic text={"Times Display"}>
                    <small className="sm-sentence-num-times-display">
                      <BsX size={"12px"} />
                      {indexesOf(sidl.sentence).length}
                    </small>
                  </TooltipBasic>
                  {sentenceTail(sidl)}
                </div>
              )
          )
        ) : (
          <div className="text-center mt-3">No sentence available</div>
        )}
      </>
    );
  };

  const onDisplaySentencesInUnknownList = () => {
    const sentenceTail = (siul) => {
      if (
        unknownSentencesInAddList.some((stc) => stc.sentence === siul.sentence)
      ) {
        return (
          <>
            <TooltipBasic text={"Edit Translation"}>
              <button
                className="btn btn-outline-secondary text-blue"
                onClick={() =>
                  setIsTranSentence({
                    is: true,
                    uso: siul,
                    ic: false,
                  })
                }
              >
                <BsPencil />
              </button>
            </TooltipBasic>
            <TooltipBasic text={"Cancel Add"}>
              <button
                className="btn btn-outline-secondary text-blue"
                onClick={() =>
                  setIsRemoveUnknownSentence({ is: true, ica: true, uso: siul })
                }
              >
                <BsArrowClockwise />
              </button>
            </TooltipBasic>
          </>
        );
      } else if (
        unknownSentencesInRemoveList.some(
          (stc) => stc.sentence === siul.sentence
        )
      ) {
        return (
          <TooltipBasic text={"Cancel Remove"}>
            <button
              className="btn btn-outline-secondary text-pink"
              onClick={() => onCancelRemoveUnknownSentence(siul)}
            >
              <BsArrowClockwise />
            </button>
          </TooltipBasic>
        );
      } else if (
        unknownSentencesInUnit.some((stc) => stc.sentence === siul.sentence)
      ) {
        return (
          <TooltipBasic text={"Remove"}>
            <button
              className="btn btn-outline-secondary text-green"
              onClick={() =>
                setIsRemoveUnknownSentence({ is: true, ica: false, uso: siul })
              }
            >
              <BsArrowClockwise />
            </button>
          </TooltipBasic>
        );
      } else {
        return (
          <TooltipBasic text={"Add"}>
            <button
              className="btn btn-outline-secondary"
              onClick={() =>
                setIsTranSentence({ is: true, ic: true, uso: siul })
              }
            >
              <BsPlus />
            </button>
          </TooltipBasic>
        );
      }
    };

    const decorateUnknowSentence = (siul) => {
      let className;
      if (
        unknownSentencesInRemoveList.some(
          (stc) => stc.sentence === siul.sentence
        )
      ) {
        className = "text-decoration-line-through text-pink";
      } else if (
        unknownSentencesInAddList.some((stc) => stc.sentence === siul.sentence)
      ) {
        className = "text-blue";
      } else if (
        unknownSentencesInUnit.some((stc) => stc.sentence === siul.sentence)
      ) {
        className = "text-green";
      }
      return className;
    };

    return (
      <>
        {sentencesInUnknownList.length > 0 ? (
          sentencesInUnknownList.map(
            (siul, i) =>
              siul.sentence.toLowerCase().indexOf(queryMeow) > -1 && (
                <div
                  key={i}
                  className={`sm-sentence mt-2 mb-2 ${decorateUnknowSentence(
                    siul
                  )}`}
                >
                  <div
                    className="sm-sentence-sentence"
                    onClick={() => onClickSentence(siul.sentence)}
                  >
                    {siul.sentence}
                  </div>
                  <TooltipBasic text={"Times Display"}>
                    <small className="sm-sentence-num-times-display">
                      <BsX size={"12px"} />
                      {indexesOf(siul.sentence).length}
                    </small>
                  </TooltipBasic>
                  {sentenceTail(siul)}
                </div>
              )
          )
        ) : (
          <div className="text-center mt-3">No sentence available</div>
        )}
      </>
    );
  };

  const onUpdateTran = (so, translation) => {
    onEditTranOfUnknownSentence(so.sentence, translation);
  };

  const onCreateTran = (so, translation) => {
    onAddUnknownSentence({ sentence: so.sentence, translation: translation });
  };

  const [isWhat, setIsWhat] = useState(true);

  return (
    <>
      {isTranSentence.is && (
        <SentenceTranModal
          onClose={() => setIsTranSentence({ ...isTranSentence, is: false })}
          so={isTranSentence.uso}
          isCreate={isTranSentence.ic}
          onAction={isTranSentence.ic ? onCreateTran : onUpdateTran}
        />
      )}
      {isRemoveSentence.is && (
        <RemoveDeleteModal
          onClose={() =>
            setIsRemoveSentence({ ...isRemoveSentence, is: false })
          }
          object={isRemoveSentence.so}
          action={"remove"}
          subject={"sentence"}
          bridge={""}
          target={isRemoveSentence.so.sentence}
          onAction={onRemoveSentence}
        />
      )}
      {isRemoveUnknownSentence.is && (
        <RemoveDeleteModal
          onClose={() =>
            setIsRemoveUnknownSentence({
              ...isRemoveUnknownSentence,
              is: false,
            })
          }
          object={isRemoveUnknownSentence.uso}
          action={"remove"}
          subject={"sentence"}
          bridge={""}
          target={isRemoveUnknownSentence.uso.sentence}
          onAction={
            isRemoveUnknownSentence.ica
              ? onCancelAddUnknownSentence
              : onRemoveUnknownSentence
          }
        />
      )}
      <div className="sm-text2sentences">
        <label
          htmlFor="sm-text2sentences-input"
          className="label-cap mb-2 sm-text2sentences-label"
        >
          Text to Sentences
        </label>
        <div className="sm-transfer">
          <div className="sm-text2sentences-wrapper">
            <textarea
              type="text"
              className="form-control dark-input sm-text2sentences-input mb-2"
              id="sm-text2sentences-input"
              placeholder="Enter your text"
              autoComplete="off"
              ref={text2sentencesRef}
              value={text2sentences}
              onChange={(e) => onChangeText2Sentences(e)}
            />
            <div>
              <div>
                <small>
                  {magicSVG(16, "ms-2 me-2")}
                  Use ( period . ) ( question mark ? ) ( exclamation mark ! ) to
                  separate sentences.
                </small>
                <small className="ms-4 pointer" onClick={() => onSave2Meow()}>
                  {text2meow !== text2sentences ? (
                    <BsCloudHaze className="ms-2 me-2" />
                  ) : (
                    <BsCloudHaze2Fill className="ms-2 me-2" />
                  )}
                  Save changes
                </small>
              </div>
              <div className="ms-2 mt-2">
                <small>
                  In case you want ( . ? ! ) in your sentence just duplicate
                  them like this ( .. ?? !! )
                </small>
              </div>
            </div>

            <div className="input-group mt-2">
              <input
                type="search"
                className="form-control dark-input"
                placeholder="Search Sentences"
                autoComplete="off"
                value={queryMeow}
                onChange={(e) => onChangeQueryMeow(e)}
              />
              <button className="input-group-append btn btn-outline-secondary">
                <BsSearch size={"22px"} />
              </button>
            </div>
          </div>
          <div className="hr" />
          <div className="sm-transfer-detail">
            <div className="form-group">
              <label
                htmlFor="sentences-detected-input"
                className="label-flexcap mb-2 pointer"
                onClick={() => setIsWhat(!isWhat)}
              >
                Sentences detected
                <BsDash className="ms-1 me-1" />
                {sentencesInDetectedList.length}
              </label>
              {isWhat === true && (
                <>
                  <div className="sm-sentences-detected">
                    {onDisplaySentencesInDetectedList()}
                  </div>
                </>
              )}
            </div>
            <div className="hr" />
            <div className="form-group">
              <label
                htmlFor="unknown-sentences-input"
                className="label-flexcap mb-2 pointer"
                onClick={() => setIsWhat(!isWhat)}
              >
                Unknown sentences
                <BsDash className="ms-1 me-1" />
                {sentencesInUnknownList.length}
                <TooltipBasic
                  text={"Sentences are not available in our dictionary yet"}
                >
                  <BsQuestionCircle size={"22px"} className="ms-2" />
                </TooltipBasic>
              </label>
              {isWhat === false && (
                <div className="sm-unknown-sentences">
                  {onDisplaySentencesInUnknownList()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Text2Sentences;
