import React, { memo, useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Challenge, Congratulation } from ".";
import { fusion2Texts } from "../../../configs/functions";
import { microsoftTranslator } from "../../../store/slices/translatorSlice";

const Challenges = ({
  collectionDetail,
  setProgress,
  onPlaySuccessAudio,
  onPlayErrorAudio,
  onPlayCompleteAudio,
}) => {
  const dispatch = useDispatch();
  const { language_learning, language_speaking } = useSelector(
    (state) => state.course
  );

  const [challenges, setChallenges] = useState([]);
  const [challenge, setChallenge] = useState({});

  const wordIndexesIn = useCallback(
    (string) => {
      let wordIndexes = [];
      const wordTransMerged = [
        ...collectionDetail.word_trans_created,
        ...collectionDetail.word_trans_using,
      ];

      collectionDetail.words.forEach((wil) => {
        let indexOccurence = string.indexOf(wil.word, 0);

        while (indexOccurence > -1) {
          const indexEnd = indexOccurence + wil.word.length;
          // console.log("wordsInUnit indexOccurence", indexOccurence, indexEnd);

          const wordTransFound = wordTransMerged.filter(
            (element) => element.word_id === wil.id
          );
          // console.log("wordTransFound", wordTransFound);

          if (wordTransFound.length > 0)
            // eslint-disable-next-line no-loop-func
            wordTransFound.forEach((element) =>
              wordIndexes.push({
                start: indexOccurence,
                end: indexEnd,
                header: wil.word,
                translation: element.translation,
              })
            );
          else {
            // if not found then use tran backup
            const wordTransBackup = collectionDetail.word_trans_backup.filter(
              (wtran) => wtran.word_id === wil.id
            );

            if (wordTransBackup.length > 0)
              // eslint-disable-next-line no-loop-func
              wordTransBackup.forEach((element) =>
                wordIndexes.push({
                  start: indexOccurence,
                  end: indexEnd,
                  header: wil.word,
                  translation: element.translation,
                })
              );
            // may not need this else cause ....
          }

          indexOccurence = string.indexOf(wil.word, indexOccurence + 1);
        }
      });

      return wordIndexes;
    },
    [collectionDetail]
  );

  const unknownWordIndexesIn = useCallback(
    (string) => {
      let unknownWordIndexes = [];
      collectionDetail.unknown_words.forEach((uwil) => {
        let indexOccurence = string.indexOf(uwil.word, 0);

        while (indexOccurence > -1) {
          const indexEnd = indexOccurence + uwil.word.length;

          // console.log("indexOccurence", indexOccurence, indexEnd);

          unknownWordIndexes.push({
            start: indexOccurence,
            end: indexEnd,
            header: uwil.word,
            translation: uwil.trantranslation,
          });
        }

        indexOccurence = string.indexOf(uwil.word, indexOccurence + 1);
      });

      return unknownWordIndexes;
    },
    [collectionDetail]
  );

  const phraseIndexesIn = useCallback(
    (string) => {
      const phraseIndexes = [];

      const phraseTransMerged = [
        ...collectionDetail.phrase_trans_created,
        ...collectionDetail.phrase_trans_using,
      ];

      collectionDetail.phrases.forEach((pil) => {
        let indexOccurence = string.indexOf(pil.phrase, 0);

        while (indexOccurence > -1) {
          const indexEnd = indexOccurence + pil.phrase.length;
          const phraseTransFound = phraseTransMerged.filter(
            (ptran) => ptran.phrase_id === pil.id
          );

          if (phraseTransFound.length > 0)
            // eslint-disable-next-line no-loop-func
            phraseTransFound.forEach((element) => {
              // use for indexes
              phraseIndexes.push({
                start: indexOccurence,
                end: indexEnd,
                header: pil.phrase,
                translation: element.translation,
              });
            });
          else {
            // if not found then use tran backup
            const phraseTransBackup =
              collectionDetail.phrase_trans_backup.filter(
                (ptran) => ptran.phrase_id === pil.id
              );

            if (phraseTransBackup.length > 0)
              // eslint-disable-next-line no-loop-func
              phraseTransBackup.forEach((element) =>
                phraseIndexes.push({
                  start: indexOccurence,
                  end: indexEnd,
                  header: pil.phrase,
                  translation: element.translation,
                })
              );
          }

          indexOccurence = string.indexOf(pil.phrase, indexOccurence + 1);
        }
      });

      return phraseIndexes;
    },
    [collectionDetail]
  );

  const unknownPhraseIndexesIn = useCallback(
    (string) => {
      let unknownPhraseIndexes = [];
      collectionDetail.unknown_phrases.forEach((upil) => {
        let indexOccurence = string.indexOf(upil.phrase, 0);

        while (indexOccurence > -1) {
          const indexEnd = indexOccurence + upil.phrase.length;

          unknownPhraseIndexes.push({
            start: indexOccurence,
            end: indexEnd,
            header: upil.phrase,
            translation: upil.trantranslation,
          });
        }

        indexOccurence = string.indexOf(upil.phrase, indexOccurence + 1);
      });

      return unknownPhraseIndexes;
    },
    [collectionDetail]
  );

  const [regexArray] = useState(() =>
    ` []\`|/~!@#$%^&*()_+-—=?;:'"“”,.。<>{}`.split("")
  );

  const indexDetails = useCallback((start, mergedIndexes) => {
    const details = [];

    mergedIndexes.forEach((ele) => {
      if (ele.start <= start && start <= ele.end) {
        details.push({
          header: ele.header,
          translation: ele.translation,
          from: "duoduo",
        });
      }
    });

    if (details.length > 0) {
      return details;
    } else {
      return [];
    }
  }, []);

  const string2IndexesIfUseSpace = useCallback(
    (string, mergedIndexes) => {
      let string2Indexes = [];

      for (let o = 0, s = 0, l = string.length; o < l; o++) {
        const content = string.substring(s, o);
        const isSpecialChar = regexArray.includes(content);
        let details = [];

        if (regexArray.indexOf(string[o]) > -1) {
          if (!isSpecialChar) details = indexDetails(s, mergedIndexes);

          string2Indexes.push({
            start: s,
            end: o,
            content: content,
            // isc: isSpecialChar,
            details: details,
          });

          s = o;
        } else if (regexArray.indexOf(content) > -1) {
          if (!isSpecialChar) details = indexDetails(s, mergedIndexes);

          string2Indexes.push({
            start: s,
            end: o,
            content: content,
            // isc: isSpecialChar,
            details: details,
          });

          s = o;
        }

        // push the rest of the string
        if (o === l - 1) {
          if (s < l) {
            const rest = string.substring(s, l).trim();
            const isc = regexArray.includes(rest);
            if (!isc) details = indexDetails(s, mergedIndexes);

            if (rest.length > 0) {
              string2Indexes.push({
                start: s,
                end: l,
                content: rest,
                // isc: isc,
                details: details,
              });
            }
          }
        }
      }

      return string2Indexes;
    },
    [indexDetails, regexArray]
  );

  const string2WordsIfUseSpace = useCallback(
    (string) => {
      let string2Words = [];

      for (let o = 0, s = 0, l = string.length; o < l; o++) {
        const content = string.substring(s, o);
        const isSpecialChar = regexArray.includes(content);
        // const isSpecialChar = content === " ";

        if (regexArray.indexOf(string[o]) > -1) {
          if (!isSpecialChar) string2Words.push(content);
          s = o;
        } else if (regexArray.indexOf(content) > -1) {
          if (!isSpecialChar) string2Words.push(content);
          s = o;
        }

        // push the rest of the string
        if (o === l - 1) {
          if (s < l) {
            const rest = string.substring(s, l).trim();
            const isSpecial = regexArray.includes(rest);
            if (rest.length > 0) {
              if (!isSpecial) string2Words.push(rest);
            }
          }
        }
      }

      return string2Words;
    },
    [regexArray]
  );

  const string2IndexesIfNot = useCallback(
    (string, mergedIndexes) => {
      const indexes = [0, string.length];

      mergedIndexes.forEach((element) => {
        indexes.push(element.start, element.end);
      });

      const newIndexes = [...new Set(indexes)].sort((a, b) => a - b);

      const string2Indexes = [];
      for (let i = 0, s = 0; i < string.length; i++) {
        const findIn = newIndexes.findIndex((index) => index === i);
        if (findIn > -1) {
          const start = s;
          const end = newIndexes[findIn + 1];
          const content = string.substring(start, end);
          const details = indexDetails(s, mergedIndexes);

          string2Indexes.push({
            start: start,
            end: end,
            content: content,
            details: details,
          });

          i = end - 1;
          s = end;
        } else continue;
      }
      // console.log("string2Indexes", string2Indexes);
      // console.log("newIndexes", newIndexes);

      return string2Indexes;
    },
    [indexDetails]
  );

  const string2WordsIfNot = useCallback(
    (string) => {
      const string2Words = string
        .split("")
        .filter((element) => !regexArray.includes(element));
      // .filter((element) => element !== " ");

      return string2Words;
    },
    [regexArray]
  );

  const onString2Indexes = useCallback(
    (string) => {
      const wordIndexes = wordIndexesIn(string);
      const unknownWordIndexes = unknownWordIndexesIn(string);

      const phraseIndexes = phraseIndexesIn(string);
      const unknownPhraseIndexes = unknownPhraseIndexesIn(string);

      const mergedIndexes = [
        ...wordIndexes,
        ...unknownWordIndexes,
        ...phraseIndexes,
        ...unknownPhraseIndexes,
      ];

      // console.log("mergedIndexes", mergedIndexes);

      let string2Indexes;
      if (language_learning.use_space) {
        string2Indexes = string2IndexesIfUseSpace(string, mergedIndexes);
      } else {
        string2Indexes = string2IndexesIfNot(string, mergedIndexes);
      }

      const indexesEmptyDetails = [];
      string2Indexes.forEach((element, index) => {
        if (
          element.details.length === 0 &&
          !regexArray.some((reg) => reg === element.content)
        )
          indexesEmptyDetails.push({
            ...element,
            indexInIndex: index,
          });
      });
      // setIndexesInString(string2Indexes);
      return string2Indexes;

      // console.log("string2Indexes", string2Indexes);
      // rawTexts ~ [{content: "",}]

      // const bodyTexts = rawTexts.map((element) => ({
      //   Text: element.content,
      // }));
      // dispatch(microsoftTranslator({bodyTexts}));

      // (async () => {
      //   const responseData = await microsoftTranslate(indexesEmptyDetails);
      //   if (responseData.isuccess) {
      //     indexesEmptyDetails.forEach((element, index) => {
      //       const inInString = string2Indexes[element.indexInIndex];

      //       string2Indexes[element.indexInIndex] = {
      //         ...inInString,
      //         details: [
      //           {
      //             header: element.content,
      //             translation: responseData.translate[index].translations[0].text,
      //             from: "microsofttranslator",
      //           },
      //         ],
      //       };
      //     });

      //     setIndexesInString(string2Indexes);
      //   }
      // })();
    },
    [
      regexArray,
      language_learning.use_space,
      phraseIndexesIn,
      string2IndexesIfNot,
      string2IndexesIfUseSpace,
      unknownPhraseIndexesIn,
      unknownWordIndexesIn,
      wordIndexesIn,
    ]
  );

  const string2Pieces = useCallback(
    (string, bool) => {
      let pieces = [];

      if (bool) {
        if (language_learning.use_space)
          pieces = string2WordsIfUseSpace(string);
        else pieces = string2WordsIfNot(string);
      } else {
        if (language_speaking.use_space)
          pieces = string2WordsIfUseSpace(string);
        else pieces = string2WordsIfNot(string);
      }

      // let othersInBank = [];
      // collectionDetail.phrases.forEach((element) => {
      //   if (element.id !== pil.id)
      //     othersInBank = [...othersInBank, ...string2WordsIfNot(string)];
      // });
      // const newOthersInBank = [...new Set(othersInBank)];

      return pieces;
    },
    [
      language_learning.use_space,
      language_speaking.use_space,
      string2WordsIfNot,
      string2WordsIfUseSpace,
    ]
  );

  const meaningsOfWords = useCallback(() => {
    let meaningsOfW = [];
    // const unknownWordTran = collectionDetail.unknown_words.map(
    //   (element) => element.translation
    // );

    const wordTransMerged = [
      ...collectionDetail.word_trans_created,
      ...collectionDetail.word_trans_using,
      ...collectionDetail.unknown_words,
    ];

    if (wordTransMerged.length > 0) {
      wordTransMerged.forEach((element) => {
        element.translation.trans.forEach((tran) => {
          const meaningsIn = tran.meanings;

          if (meaningsIn.length > 0) {
            tran.meanings.forEach((ele) => {
              const convMeans = fusion2Texts(ele.meaning);
              meaningsOfW = [...meaningsOfW, ...convMeans];
            });
          }

          // const defsIn = tran.definitions.filter(
          //   (def) => def.trim().length > 0
          // );

          // if (defsIn.length > 0) {
          //   mergedDefsOut = [...mergedDefsOut, ...defsIn];
          // }
        });
      });
    }
    return meaningsOfW;
  }, [collectionDetail]);

  const phrases2Ques = useCallback(() => {
    const phrases2Ques = [];

    const phraseTransMerged = [
      ...collectionDetail.phrase_trans_created,
      ...collectionDetail.phrase_trans_using,
    ];

    const points = {
      writing: 0,
      reading: 0,
      speaking: 0,
      listening: 0,
      last_practiced: 0,
    };
    collectionDetail.phrases.forEach((pil) => {
      const phraseTransFound = phraseTransMerged.filter(
        (element) => element.phrase_id === pil.id
      );

      const phraseTransOut = phraseTransMerged.filter(
        (element) => element.phrase_id !== pil.id
      );

      let mergedMeaningsOut = [];
      let mergedDefsOut = [];
      if (phraseTransOut.length > 0) {
        phraseTransOut.forEach((element) => {
          element.translation.trans.forEach((tran) => {
            const meaningsIn = tran.meanings;

            if (meaningsIn.length > 0) {
              tran.meanings.forEach((ele) => {
                const convMeans = fusion2Texts(ele.meaning);
                mergedMeaningsOut = [...mergedMeaningsOut, ...convMeans];
              });
            }

            const defsIn = tran.definitions.filter(
              (def) => def.trim().length > 0
            );

            if (defsIn.length > 0) {
              mergedDefsOut = [...mergedDefsOut, ...defsIn];
            }
          });
        });
      }

      const phraseIn = pil.phrase;
      const wordsInBank = string2Pieces(phraseIn, true);

      const wordsInUnit = collectionDetail.words.map((element) => element.word);
      const unknownWordsInUnit = collectionDetail.unknown_words.map(
        (element) => element.word
      );
      const othersInBank = [...wordsInUnit, ...unknownWordsInUnit];

      const headerIndexes = onString2Indexes(phraseIn);
      const imageUrls = [];
      const ofWhat = "phrase";
      if (phraseTransFound.length > 0) {
        phraseTransFound.forEach((element) => {
          if (element.translation.image_url.length > 0)
            imageUrls.push(element.translation.image_url);

          // each pos have 1 question about definitions/meanings/reverse meanings
          element.translation.trans.forEach((tran) => {
            const meaningsIn = tran.meanings;
            if (meaningsIn.length > 0) {
              let mergedMeanings = [];
              let mergedReverses = [];

              tran.meanings.forEach((ele) => {
                const convMeans = fusion2Texts(ele.meaning);
                mergedMeanings = [...mergedMeanings, ...convMeans];

                ele.reverses.forEach((reverse) => {
                  const convReverses = fusion2Texts(reverse);
                  mergedReverses = [...mergedReverses, ...convReverses];
                });
              });

              const defsIn = tran.definitions.filter(
                (def) => def.trim().length > 0
              );

              if (mergedMeanings.length > 0) {
                const meaningsInBank = string2Pieces(
                  mergedMeanings[
                    Math.floor(Math.random() * mergedMeanings.length)
                  ],
                  false
                );

                let meaningsInOthers = [];
                const meaningsOfW = meaningsOfWords();
                if (meaningsOfW.length > 0) {
                  meaningsInOthers = string2Pieces(
                    meaningsOfW[Math.floor(Math.random() * meaningsOfW.length)],
                    false
                  );
                }

                phrases2Ques.push({
                  type: "meeting",
                  indexes: headerIndexes,
                  meanings: mergedMeanings,
                  decoys: mergedMeaningsOut,
                  pieces: wordsInBank,
                  others: othersInBank,
                  images: imageUrls,
                  complete: false,
                  object: pil,
                  of: ofWhat,
                  points: points,
                });

                if (defsIn.length > 0) {
                  phrases2Ques.push({
                    type: "choose-definition",
                    indexes: headerIndexes,
                    definitions: defsIn,
                    decoys: mergedDefsOut,
                    pieces: wordsInBank,
                    others: othersInBank,
                    images: imageUrls,
                    complete: false,
                    object: pil,
                    of: ofWhat,
                    points: points,
                  });
                }

                phrases2Ques.push({
                  type: "translate-learning",
                  indexes: headerIndexes,
                  meanings: mergedMeanings,
                  decoys: mergedMeaningsOut,
                  pieces: meaningsInBank,
                  others: meaningsInOthers,
                  images: imageUrls,
                  complete: false,
                  object: pil,
                  of: ofWhat,
                  points: points,
                });

                phrases2Ques.push({
                  type: "translate-speaking",
                  meanings: mergedMeanings,
                  reverses: mergedReverses,
                  pieces: wordsInBank,
                  others: othersInBank,
                  images: imageUrls,
                  complete: false,
                  object: pil,
                  of: ofWhat,
                  points: points,
                });

                if (defsIn.length > 0) {
                  phrases2Ques.push({
                    type: "definition-of",
                    definitions: defsIn,
                    pieces: wordsInBank,
                    others: othersInBank,
                    images: imageUrls,
                    complete: false,
                    object: pil,
                    of: ofWhat,
                    points: points,
                  });
                }

                phrases2Ques.push({
                  type: "choose-translate-learning",
                  indexes: headerIndexes,
                  meanings: mergedMeanings,
                  decoys: mergedMeaningsOut,
                  pieces: meaningsInBank,
                  others: meaningsInOthers,
                  images: imageUrls,
                  complete: false,
                  object: pil,
                  of: ofWhat,
                  points: points,
                });
              }
            }
          });
        });
      }

      phrases2Ques.push({
        type: "listening",
        indexes: headerIndexes,
        pieces: wordsInBank,
        others: othersInBank,
        images: imageUrls,
        complete: false,
        object: pil,
        of: ofWhat,
        points: points,
      });
    });

    return phrases2Ques;
  }, [collectionDetail, meaningsOfWords, onString2Indexes, string2Pieces]);

  const [isComplete, setIsComplete] = useState(false);
  const [isPracticeAgain, setIsPracticeAgain] = useState(false);
  const [tracker, setTracker] = useState({ now: 0, end: 0 });

  const handleChallange = useCallback(
    (bool) => {
      const indexNow = tracker.now;
      if (bool) {
        const newChallenges = challenges.map((challenge, index) =>
          index === indexNow ? { ...challenge, complete: true } : challenge
        );
        setChallenges(newChallenges);

        console.log("bool", bool, indexNow, "challenges", newChallenges);
      }

      let nextIndex = indexNow + 1;
      if (nextIndex >= tracker.end + 1) {
        const indexFound = challenges.findIndex(
          (challenge) => challenge.complete === false
        );

        if (indexFound > -1) nextIndex = indexFound;
      } else {
        while (challenges[nextIndex].complete) {
          nextIndex++;

          if (nextIndex >= tracker.end + 1) {
            const indexFound = challenges.findIndex(
              (challenge) => challenge.complete === false
            );

            if (indexFound > -1) nextIndex = indexFound;
          }
        }
      }

      setTracker({ ...tracker, now: nextIndex });
    },
    [challenges, tracker]
  );

  useEffect(() => {
    const isFinished = challenges.some(
      (challenge) => challenge.complete === false
    );

    if (isFinished) setIsComplete(false);
    else {
      if (challenges.length > 0) {
        setIsComplete(true);
        onPlayCompleteAudio();
      }
    }
  }, [challenges, onPlayCompleteAudio]);

  const handleCannotListen = useCallback(() => {
    const newChallenges = challenges.filter(
      (challenge) => challenge.type !== "listening"
    );
    setChallenges(newChallenges);

    const nextIndex = newChallenges.findIndex(
      (challenge) => challenge.complete === false
    );
    setTracker({ now: nextIndex, end: newChallenges.length - 1 });
  }, [challenges]);

  useEffect(() => {
    if (challenges.length > 0) {
      setChallenge(challenges[tracker.now]);

      const counter = challenges.filter(
        (challenge) => challenge.complete === true
      ).length;
      setProgress({ value: counter, count: challenges.length });
    }
  }, [challenges, setProgress, tracker]);

  useEffect(() => {
    const resourcesForPrac = [];
    const phraseQues = phrases2Ques();

    setChallenges(phraseQues);
    setTracker({ now: 0, end: phraseQues.length - 1 });

    console.log("phraseQues", phraseQues);
  }, [isPracticeAgain, phrases2Ques]);

  return (
    <>
      {/* {isComplete ? ( */}
      {true ? (
        <Congratulation
          challenges={challenges}
          collectionDetail={collectionDetail}
          isPracticeAgain={isPracticeAgain}
          setIsPracticeAgain={setIsPracticeAgain}
        />
      ) : (
        Object.keys(challenge).length > 0 && (
          <Challenge
            challenge={challenge}
            handleChallange={handleChallange}
            handleCannotListen={handleCannotListen}
            onPlaySuccessAudio={onPlaySuccessAudio}
            onPlayErrorAudio={onPlayErrorAudio}
          />
        )
      )}
    </>
  );
};

export default memo(Challenges);
