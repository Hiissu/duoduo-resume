// import React, { useEffect, useRef, useState } from "react";
// import { BsDash, BsXCircle } from "react-icons/bs";
// import { connect } from "react-redux";
// import { getPhrases } from "../../store/actions/phrase";
// import { ScrollupCustom } from "../Scrollup";
// import {
//   PhrasesInDictionary,
//   PhrasesInUnit,
//   PhrasesWillAdd,
//   PhrasesWillRemove,
//   Text2Phrases,
//   UnknownPhrasesInUnit,
//   UnknownPhrasesWillAdd,
//   UnknownPhrasesWillRemove,
// } from "./components";
// import "./PhraseManager.css";

// const PhraseManager = ({
//   phraseOption,
//   onClose,
//   text2meow,
//   setText2Meow,
//   getPhrases,
//   phrasesInUnit,
//   phrasesInAddList,
//   setPhrasesInAddList,
//   phrasesInRemoveList,
//   setPhrasesInRemoveList,
//   unknownPhrasesInUnit,
//   unknownPhrasesInAddList,
//   setUnknownPhrasesInAddList,
//   unknownPhrasesInRemoveList,
//   setUnknownPhrasesInRemoveList,
// }) => {
//   useEffect(() => {
//     var modalCloses = document.querySelectorAll(".pm-close");
//     modalCloses.forEach((modalClose) =>
//       modalClose.addEventListener("click", onClose)
//     );

//     return () => {
//       modalCloses.forEach((modalClose) =>
//         modalClose.removeEventListener("click", onClose)
//       );
//     };
//   }, [onClose]);

//   const [phrasesInDict, setPhrasesInDict] = useState([]);

//   useEffect(() => {
//     (async () => {
//       const response = await getPhrases();
//       if (response.isuccess) setPhrasesInDict(response.phrases);
//     })();
//   }, [getPhrases]);

//   const [phrasesInDetectedList, setPhrasesInDetectedList] = useState([]);
//   const [phrasesInUnknownList, setPhrasesInUnknownList] = useState([]);

//   // ~> for phrasesInAddList
//   const onAddPhrase = (po) => {
//     setPhrasesInAddList([...phrasesInAddList, po]);
//   };

//   const onCancelAddPhrase = (po) => {
//     const newPhrasesInAddList = phrasesInAddList.filter(
//       (phr) => phr.id !== po.id
//     );
//     setPhrasesInAddList(newPhrasesInAddList);
//   };

//   // ~> for phrasesInRemoveList
//   const onRemovePhrase = (po) => {
//     setPhrasesInRemoveList([...phrasesInRemoveList, po]);
//   };

//   const onCancelRemovePhrase = (po) => {
//     const newPhrasesInRemoveList = phrasesInRemoveList.filter(
//       (phr) => phr.id !== po.id
//     );
//     setPhrasesInRemoveList(newPhrasesInRemoveList);
//   };

//   // ~> for unknownPhrasesInAddList
//   const onAddUnknownPhrase = (po) => {
//     setUnknownPhrasesInAddList([...unknownPhrasesInAddList, po]);
//   };

//   const onCancelAddUnknownPhrase = (upo) => {
//     const newUnknownPhrasesInAddList = unknownPhrasesInAddList.filter(
//       (phr) => phr.phrase !== upo.phrase
//     );
//     setUnknownPhrasesInAddList(newUnknownPhrasesInAddList);
//   };

//   const onEditTranOfUnknownPhrase = (phrase, translation) => {
//     const newUnknownPhrasesInAddList = unknownPhrasesInAddList.map((phr) =>
//       phr.phrase === phrase ? { ...phr, translation: translation } : phr
//     );
//     setUnknownPhrasesInAddList(newUnknownPhrasesInAddList);
//   };

//   // ~> for unknownPhrasesInRemoveList
//   const onRemoveUnknownPhrase = (upo) => {
//     setUnknownPhrasesInRemoveList([...unknownPhrasesInRemoveList, upo]);
//   };

//   const onCancelRemoveUnknownPhrase = (upo) => {
//     const newUnknownPhrasesInRemoveList = unknownPhrasesInRemoveList.filter(
//       (phr) => phr.phrase !== upo.phrase
//     );
//     setUnknownPhrasesInRemoveList(newUnknownPhrasesInRemoveList);
//   };

//   // for scrollup
//   const modalContentRef = useRef();

//   const detailSection = () => {
//     switch (phraseOption) {
//       case 0:
//         return (
//           <Text2Phrases
//             text2meow={text2meow}
//             setText2Meow={setText2Meow}
//             phrasesInDict={phrasesInDict}
//             phrasesInUnit={phrasesInUnit}
//             unknownPhrasesInUnit={unknownPhrasesInUnit}
//             // ~> for phrasesInAddList
//             phrasesInAddList={phrasesInAddList}
//             onAddPhrase={onAddPhrase}
//             onCancelAddPhrase={onCancelAddPhrase}
//             // ~> for phrasesInRemoveList
//             phrasesInRemoveList={phrasesInRemoveList}
//             onRemovePhrase={onRemovePhrase}
//             onCancelRemovePhrase={onCancelRemovePhrase}
//             // ~> for unknownPhrasesInAddList
//             unknownPhrasesInAddList={unknownPhrasesInAddList}
//             onAddUnknownPhrase={onAddUnknownPhrase}
//             onCancelAddUnknownPhrase={onCancelAddUnknownPhrase}
//             // ~> for unknownPhrasesInRemoveList
//             unknownPhrasesInRemoveList={unknownPhrasesInRemoveList}
//             onRemoveUnknownPhrase={onRemoveUnknownPhrase}
//             onCancelRemoveUnknownPhrase={onCancelRemoveUnknownPhrase}
//             onEditTranOfUnknownPhrase={onEditTranOfUnknownPhrase}
//             // ~> for detect phrases
//             phrasesInDetectedList={phrasesInDetectedList}
//             setPhrasesInDetectedList={setPhrasesInDetectedList}
//             phrasesInUnknownList={phrasesInUnknownList}
//             setPhrasesInUnknownList={setPhrasesInUnknownList}
//           />
//         );
//       case 1:
//         return (
//           <PhrasesInDictionary
//             phrasesInDict={phrasesInDict}
//             phrasesInUnit={phrasesInUnit}
//             // ~> for phrasesInAddList
//             phrasesInAddList={phrasesInAddList}
//             onAddPhrase={onAddPhrase}
//             onCancelAddPhrase={onCancelAddPhrase}
//             // ~> for phrasesInRemoveList
//             phrasesInRemoveList={phrasesInRemoveList}
//             onRemovePhrase={onRemovePhrase}
//             onCancelRemovePhrase={onCancelRemovePhrase}
//           />
//         );
//       case 2:
//         return (
//           <PhrasesInUnit
//             phrasesInUnit={phrasesInUnit}
//             phrasesInRemoveList={phrasesInRemoveList}
//             onRemovePhrase={onRemovePhrase}
//             onCancelRemovePhrase={onCancelRemovePhrase}
//           />
//         );
//       case 3:
//         return (
//           <UnknownPhrasesInUnit
//             unknownPhrasesInUnit={unknownPhrasesInUnit}
//             unknownPhrasesInRemoveList={unknownPhrasesInRemoveList}
//             onRemoveUnknownPhrase={onRemoveUnknownPhrase}
//             onCancelRemoveUnknownPhrase={onCancelRemoveUnknownPhrase}
//           />
//         );
//       default:
//         break;
//     }
//   };

//   const willSection = () => (
//     <>
//       <label
//         className={`label-flexcap mb-2 pointer
//         ${phrasesInAddList.length > 0 ? "text-blue" : ""}`}
//         onClick={() => setWillOption({ opt: 0, on: !willOption.on })}
//       >
//         Phrases will add
//         <BsDash className="ms-1 me-1" />
//         {phrasesInAddList.length}
//       </label>
//       {willOption.opt === 0 && willOption.on && (
//         <PhrasesWillAdd
//           queryPhraseInWill={queryPhraseInWill}
//           phrasesInAddList={phrasesInAddList}
//           onCancelAddPhrase={onCancelAddPhrase}
//         />
//       )}
//       <div className="hr" />
//       <label
//         className={`label-flexcap mb-2 pointer
//         ${unknownPhrasesInAddList.length > 0 ? "text-blue" : ""}`}
//         onClick={() => setWillOption({ opt: 1, on: !willOption.on })}
//       >
//         Unknown Phrases will add
//         <BsDash className="ms-1 me-1" />
//         {unknownPhrasesInAddList.length}
//       </label>
//       {willOption.opt === 1 && willOption.on && (
//         <UnknownPhrasesWillAdd
//           queryPhraseInWill={queryPhraseInWill}
//           unknownPhrasesInAddList={unknownPhrasesInAddList}
//           onCancelAddUnknownPhrase={onCancelAddUnknownPhrase}
//           onEditTranOfUnknownPhrase={onEditTranOfUnknownPhrase}
//         />
//       )}
//       <div className="hr" />
//       <label
//         className={`label-flexcap mb-2 pointer
//         ${phrasesInRemoveList.length > 0 ? "text-pink" : ""}`}
//         onClick={() => setWillOption({ opt: 2, on: !willOption.on })}
//       >
//         Phrases will remove
//         <BsDash className="ms-1 me-1" />
//         {phrasesInRemoveList.length}
//       </label>
//       {willOption.opt === 2 && willOption.on && (
//         <PhrasesWillRemove
//           queryPhraseInWill={queryPhraseInWill}
//           phrasesInRemoveList={phrasesInRemoveList}
//           onCancelRemovePhrase={onCancelRemovePhrase}
//         />
//       )}
//       <div className="hr" />
//       <label
//         className={`label-flexcap mb-2 pointer
//         ${unknownPhrasesInRemoveList.length > 0 ? "text-pink" : ""}`}
//         onClick={() => setWillOption({ opt: 3, on: !willOption.on })}
//       >
//         Unknown Phrases will remove
//         <BsDash className="ms-1 me-1" />
//         {unknownPhrasesInRemoveList.length}
//       </label>
//       {willOption.opt === 3 && willOption.on && (
//         <UnknownPhrasesWillRemove
//           queryPhraseInWill={queryPhraseInWill}
//           unknownPhrasesInRemoveList={unknownPhrasesInRemoveList}
//           onCancelRemoveUnknownPhrase={onCancelRemoveUnknownPhrase}
//         />
//       )}
//     </>
//   );

//   return (
//     <>
//       <section className="pm-details-section">
//         <div className="moodal-header">
//           <div className="moodal-closer">
//             <div className="pm-close pointer">
//               <BsXCircle size={"32px"} />
//             </div>
//             <div className="moodal-esc">ESC</div>
//           </div>
//           <div className="moodal-title">Phrase Manager</div>
//         </div>
//         <div className="pm-content" ref={modalContentRef}>
//           <ScrollupCustom parentElement={modalContentRef} />
//           {detailSection()}
//         </div>
//       </section>
//     </>
//   );
// };

// const mapStateToProps = (state) => ({
//   collections: state.collection.collections,
// });

// export default connect(mapStateToProps, { getPhrases })(PhraseManager);
