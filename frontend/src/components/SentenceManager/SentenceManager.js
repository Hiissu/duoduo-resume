// import React, { useEffect, useRef, useState } from "react";
// import { BsDash, BsXCircle } from "react-icons/bs";
// import { connect } from "react-redux";
// import { getSentences } from "../../store/actions/sentence";
// import { PopupCenter } from "../Popup";
// import { ResizerX } from "../Resizer";
// import { ScrollupCustom } from "../Scrollup";
// import {
//   SearchSentencesWill,
//   SentencesInDictionary,
//   SentencesInUnit,
//   SentencesWillAdd,
//   SentencesWillRemove,
//   Text2Sentences,
//   UnknownSentencesInUnit,
//   UnknownSentencesWillAdd,
//   UnknownSentencesWillRemove,
// } from "./components";
// import "./SentenceManager.css";

// const SentenceManager = ({
//   collectionid,
//   sentenceOption,
//   collections,
//   getSentences,
//   forClose,
//   setForClose,
//   onClose,
//   text2meow,
//   setText2Meow,
// }) => {
//   useEffect(() => {
//     var modalCloses = document.querySelectorAll(".sm-close");
//     modalCloses.forEach((modalClose) =>
//       modalClose.addEventListener("click", onClose)
//     );

//     return () => {
//       modalCloses.forEach((modalClose) =>
//         modalClose.removeEventListener("click", onClose)
//       );
//     };
//   }, [onClose]);

//   const [sentencesInDict, setSentencesInDict] = useState([]);

//   const [isSentenceFail, setIsSentenceFail] = useState(false);
//   useEffect(() => {
//     (async () => {
//       const response = await getSentences();
//       if (response.isuccess) {
//         setIsSentenceFail(false);
//         setSentencesInDict(response.sentences);
//       } else setIsSentenceFail(true);
//     })();
//   }, [getSentences]);

//   const [sentencesInDetectedList, setSentencesInDetectedList] = useState([]);
//   const [sentencesInUnknownList, setSentencesInUnknownList] = useState([]);

//   // ~> for sentencesInAddList
//   const onAddSentence = (so) => {
//     setSentencesInAddList([...sentencesInAddList, so]);
//     setWillOption({ opt: 0, on: true });
//   };

//   const onCancelAddSentence = (so) => {
//     const newSentencesInAddList = sentencesInAddList.filter(
//       (stc) => stc.id !== so.id
//     );
//     setSentencesInAddList(newSentencesInAddList);
//     setWillOption({ opt: 0, on: true });
//   };

//   // ~> for sentencesInRemoveList
//   const onRemoveSentence = (so) => {
//     setSentencesInRemoveList([...sentencesInRemoveList, so]);
//     setWillOption({ opt: 2, on: true });
//   };

//   const onCancelRemoveSentence = (so) => {
//     const newSentencesInRemoveList = sentencesInRemoveList.filter(
//       (stc) => stc.id !== so.id
//     );
//     setSentencesInRemoveList(newSentencesInRemoveList);
//     setWillOption({ opt: 2, on: true });
//   };

//   // ~> for unknownSentencesInAddList
//   const onAddUnknownSentence = (so) => {
//     setUnknownSentencesInAddList([...unknownSentencesInAddList, so]);
//     setWillOption({ opt: 1, on: true });
//   };

//   const onCancelAddUnknownSentence = (uso) => {
//     const newUnknownSentencesInAddList = unknownSentencesInAddList.filter(
//       (stc) => stc.sentence !== uso.sentence
//     );
//     setUnknownSentencesInAddList(newUnknownSentencesInAddList);
//     setWillOption({ opt: 1, on: true });
//   };

//   const onEditTranOfUnknownSentence = (sentence, translation) => {
//     const newUnknownSentencesInAddList = unknownSentencesInAddList.map((stc) =>
//       stc.sentence === sentence ? { ...stc, translation: translation } : stc
//     );
//     setUnknownSentencesInAddList(newUnknownSentencesInAddList);
//     setWillOption({ opt: 1, on: true });
//   };

//   // ~> for unknownSentencesInRemoveList
//   const onRemoveUnknownSentence = (uso) => {
//     setUnknownSentencesInRemoveList([...unknownSentencesInRemoveList, uso]);
//     setWillOption({ opt: 3, on: true });
//   };

//   const onCancelRemoveUnknownSentence = (uso) => {
//     const newUnknownSentencesInRemoveList = unknownSentencesInRemoveList.filter(
//       (stc) => stc.sentence !== uso.sentence
//     );
//     setUnknownSentencesInRemoveList(newUnknownSentencesInRemoveList);
//     setWillOption({ opt: 3, on: true });
//   };

//   // for scrollup
//   const modalContentRef = useRef();

//   const detailSection = () => {
//     switch (sentenceOption) {
//       case 0:
//         return (
//           <Text2Sentences
//             text2meow={text2meow}
//             setText2Meow={setText2Meow}
//             sentencesInDict={sentencesInDict}
//             sentencesInUnit={sentencesInUnit}
//             unknownSentencesInUnit={unknownSentencesInUnit}
//             // ~> for sentencesInAddList
//             sentencesInAddList={sentencesInAddList}
//             onAddSentence={onAddSentence}
//             onCancelAddSentence={onCancelAddSentence}
//             // ~> for sentencesInRemoveList
//             sentencesInRemoveList={sentencesInRemoveList}
//             onRemoveSentence={onRemoveSentence}
//             onCancelRemoveSentence={onCancelRemoveSentence}
//             // ~> for unknownSentencesInAddList
//             unknownSentencesInAddList={unknownSentencesInAddList}
//             onAddUnknownSentence={onAddUnknownSentence}
//             onCancelAddUnknownSentence={onCancelAddUnknownSentence}
//             onEditTranOfUnknownSentence={onEditTranOfUnknownSentence}
//             // ~> for unknownSentencesInRemoveList
//             unknownSentencesInRemoveList={unknownSentencesInRemoveList}
//             onRemoveUnknownSentence={onRemoveUnknownSentence}
//             onCancelRemoveUnknownSentence={onCancelRemoveUnknownSentence}
//             // ~> for detect sentences
//             sentencesInDetectedList={sentencesInDetectedList}
//             setSentencesInDetectedList={setSentencesInDetectedList}
//             sentencesInUnknownList={sentencesInUnknownList}
//             setSentencesInUnknownList={setSentencesInUnknownList}
//           />
//         );
//       case 1:
//         return (
//           <SentencesInDictionary
//             sentencesInDict={sentencesInDict}
//             sentencesInUnit={sentencesInUnit}
//             // ~> for sentencesInAddList
//             sentencesInAddList={sentencesInAddList}
//             onAddSentence={onAddSentence}
//             onCancelAddSentence={onCancelAddSentence}
//             // ~> for sentencesInRemoveList
//             sentencesInRemoveList={sentencesInRemoveList}
//             onRemoveSentence={onRemoveSentence}
//             onCancelRemoveSentence={onCancelRemoveSentence}
//           />
//         );
//       case 2:
//         return (
//           <SentencesInUnit
//             sentencesInUnit={sentencesInUnit}
//             sentencesInRemoveList={sentencesInRemoveList}
//             onRemoveSentence={onRemoveSentence}
//             onCancelRemoveSentence={onCancelRemoveSentence}
//           />
//         );
//       case 3:
//         return (
//           <UnknownSentencesInUnit
//             unknownSentencesInUnit={unknownSentencesInUnit}
//             unknownSentencesInRemoveList={unknownSentencesInRemoveList}
//             onRemoveUnknownSentence={onRemoveUnknownSentence}
//             onCancelRemoveUnknownSentence={onCancelRemoveUnknownSentence}
//           />
//         );
//       default:
//         break;
//     }
//   };

//   const [querySentenceInWill, setQuerySentenceInWill] = useState("");
//   const willSection = () => (
//     <>
//       <label
//         className={`label-flexcap mb-2 pointer ${
//           sentencesInAddList.length > 0 ? "text-blue" : ""
//         }`}
//         onClick={() => setWillOption({ opt: 0, on: !willOption.on })}
//       >
//         Sentences will add
//         <BsDash className="ms-1 me-1" />
//         {sentencesInAddList.length}
//       </label>
//       {willOption.opt === 0 && willOption.on && (
//         <SentencesWillAdd
//           querySentenceInWill={querySentenceInWill}
//           sentencesInAddList={sentencesInAddList}
//           onCancelAddSentence={onCancelAddSentence}
//         />
//       )}
//       <div className="hr" />
//       <label
//         className={`label-flexcap mb-2 pointer ${
//           unknownSentencesInAddList.length > 0 ? "text-blue" : ""
//         }`}
//         onClick={() => setWillOption({ opt: 1, on: !willOption.on })}
//       >
//         Unknown Sentences will add
//         <BsDash className="ms-1 me-1" />
//         {unknownSentencesInAddList.length}
//       </label>
//       {willOption.opt === 1 && willOption.on && (
//         <UnknownSentencesWillAdd
//           querySentenceInWill={querySentenceInWill}
//           unknownSentencesInAddList={unknownSentencesInAddList}
//           onCancelAddUnknownSentence={onCancelAddUnknownSentence}
//           onEditTranOfUnknownSentence={onEditTranOfUnknownSentence}
//         />
//       )}
//       <div className="hr" />
//       <label
//         className={`label-flexcap mb-2 pointer ${
//           sentencesInRemoveList.length > 0 ? "text-pink" : ""
//         }`}
//         onClick={() => setWillOption({ opt: 2, on: !willOption.on })}
//       >
//         Sentences will remove
//         <BsDash className="ms-1 me-1" />
//         {sentencesInRemoveList.length}
//       </label>
//       {willOption.opt === 2 && willOption.on && (
//         <SentencesWillRemove
//           querySentenceInWill={querySentenceInWill}
//           sentencesInRemoveList={sentencesInRemoveList}
//           onCancelRemoveSentence={onCancelRemoveSentence}
//         />
//       )}
//       <div className="hr" />
//       <label
//         className={`label-flexcap mb-2 pointer ${
//           unknownSentencesInRemoveList.length > 0 ? "text-pink" : ""
//         }`}
//         onClick={() => setWillOption({ opt: 3, on: !willOption.on })}
//       >
//         Unknown Sentences will remove
//         <BsDash className="ms-1 me-1" />
//         {unknownSentencesInRemoveList.length}
//       </label>
//       {willOption.opt === 3 && willOption.on && (
//         <UnknownSentencesWillRemove
//           querySentenceInWill={querySentenceInWill}
//           unknownSentencesInRemoveList={unknownSentencesInRemoveList}
//           onCancelRemoveUnknownSentence={onCancelRemoveUnknownSentence}
//         />
//       )}
//     </>
//   );

//   return (
//     <>
//       {isSentenceFail && (
//         <PopupCenter onClose={() => setIsSentenceFail(false)}>
//           Cannot load Sentence Dictionary
//         </PopupCenter>
//       )}
//       <section className="sm-details-section">
//         <div className="moodal-header">
//           <div className="moodal-closer">
//             <div className="sm-close pointer">
//               <BsXCircle size={"32px"} />
//             </div>
//             <div className="moodal-esc">ESC</div>
//           </div>
//           <div className="moodal-title">Sentence Manager</div>
//         </div>
//         <div className="sm-content" ref={modalContentRef}>
//           <ScrollupCustom parentElement={modalContentRef} />
//           {detailSection()}
//         </div>
//       </section>
//       <ResizerX />
//       <section className="sm-wills-section">
//         <SearchSentencesWill
//           querySentenceInWill={querySentenceInWill}
//           setQuerySentenceInWill={setQuerySentenceInWill}
//         />
//         <div className="sm-sentences-will-do">{willSection()}</div>
//       </section>
//       <div
//         className={`form-row moodal-footer
//           ${isCanSave ? "eases-in" : "eases-out"}
//           ${forClose.isShake ? "shake" : ""}`}
//       >
//         <div className="col btn" onClick={() => onReset()}>
//           Reset
//         </div>
//         <button
//           className="col btn btn-success"
//           disabled={!isCanSave}
//           onClick={() => onSave()}
//         >
//           Save Changes
//         </button>
//       </div>
//     </>
//   );
// };

// const mapStateToProps = (state) => ({
//   collections: state.collection.collections,
// });

// export default connect(mapStateToProps, { getSentences })(SentenceManager);
