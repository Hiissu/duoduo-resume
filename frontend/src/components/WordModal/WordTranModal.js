import styles from "./WordTranModal.css";
import classnames from "classnames";
import React, { useEffect, useState } from "react";
import {
  BsDash,
  BsPlus,
  BsSearch,
  BsSnow2,
  BsTrash,
  BsVolumeUp,
  BsX,
} from "react-icons/bs";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { TranslationTips } from ".";
import { PartOfSpeech } from "../../configs/constants";
import { fusion2Texts, latinize } from "../../configs/functions";
import { ImgViewerModal, Modal } from "../Modal";
import { DarkTooltip } from "../Tooltip";
import { DarkMenu } from "../Menu";
import { IconButton, MenuItem } from "@mui/material";
import { RestartAltRounded, TipsAndUpdatesOutlined } from "@mui/icons-material";
import { onSpeak } from "../../store/slices/settingSlice";

const Image = ({
  translation,
  isCreator,
  isImgError,
  setIsImgError,
  onChangeImageIpa,
}) => {
  const [isPreviewing, setIsPreviewing] = useState(true);
  const [isViewingImage, setIsViewingImage] = useState(false);

  // useEffect(() => {
  //   document.body.style.overflowY = "hidden";
  //   return () => document.body.style.overflowY = "visible";
  // }, [isViewingImage]);

  // useEffect(() => {
  //   const timer = setTimeout(() => setIsPreviewing(false), 3000);

  //   return () => {
  //     window.clearTimeout(timer);
  //   };
  // }, [isPreviewing]);

  return (
    <>
      {isViewingImage && (
        <ImgViewerModal
          imgUrl={translation.image_url}
          onClose={() => setIsViewingImage(!isViewingImage)}
        />
      )}

      {!isImgError && isPreviewing && (
        <div
          className={styles.image}
          onClick={() => {
            setIsPreviewing(false);
            setIsViewingImage(true);
          }}
        >
          <img
            alt=""
            className={styles["image-img"]}
            src={translation.image_url}
            onError={() => setIsImgError(true)}
          />
        </div>
      )}

      <div className="form-group">
        <DarkTooltip title={"Image may remind to this word"} placement={"top"}>
          <label className="label-cap" htmlFor="image_url">
            Image url
            <BsDash className="ms-1 me-1" size={16} />
            <span
              onClick={() => setIsPreviewing(!isPreviewing)}
              className={classnames(styles["image-preview"], {
                "text-danger": isImgError,
              })}
            >
              {isImgError ? "Error" : isPreviewing ? "Hide Preview" : "Preview"}
            </span>
          </label>
        </DarkTooltip>
        <input
          type="text"
          className="form-control dark-input"
          id="image_url"
          name="image_url"
          autoComplete="off"
          maxLength="2020"
          value={translation.image_url}
          onChange={(e) => isCreator && onChangeImageIpa(e)}
        />
      </div>
    </>
  );
};

const Ipa = ({ isCreator, translation, onChangeImageIpa }) => {
  return (
    <div className="form-group position-relative mt-2 mb-2">
      <DarkTooltip title={"International Phonetic Alphabet"} placement={"top"}>
        <label className="label-cap" htmlFor="ipa">
          IPA
        </label>
      </DarkTooltip>
      <input
        type="text"
        className={`form-control dark-input ${styles["ipa-input"]}`}
        placeholder="International Phonetic Alphabet"
        autoComplete="off"
        id="ipa"
        name="ipa"
        maxLength="220"
        value={translation.ipa}
        onChange={(e) => isCreator && onChangeImageIpa(e)}
      />
      <span className="num-length">{220 - translation.ipa.length}</span>
    </div>
  );
};

const PoS = ({
  tran,
  isCreator,
  translation,
  setTranslation,
  onChangePosNote,
  POSelected,
  setPOSelected,
  POShowing,
  setPOShowing,
  POSLeft,
}) => {
  const onDeleteTran = (os) => {
    if (translation.trans.length > 1) {
      const newTrans = translation.trans.filter((tran) => tran.pos !== os);
      setTranslation({ ...translation, trans: newTrans });

      const newPOS = POSelected.filter((o) => o !== os);
      setPOSelected(newPOS);
      if (os === POShowing) setPOShowing(newPOS[0]);
    }
  };

  return (
    <div className="form-group mt-2 mb-2">
      <div className={styles.pos}>
        <DarkTooltip title={"Part of Speech"} placement={"top"}>
          <label className="label-cap" htmlFor="pos">
            Part of Speech (POS)
          </label>
        </DarkTooltip>
        {isCreator && (
          <DarkTooltip title={"Delete Tran"} placement={"top"}>
            <IconButton
              className="text-danger me-2 pointer"
              onClick={() => onDeleteTran(tran.pos)}
            >
              <BsTrash size={20} />
            </IconButton>
          </DarkTooltip>
        )}
      </div>
      {isCreator && (
        <select
          className="form-control form-select dark-input"
          id="pos"
          name="pos"
          onChange={(e) => onChangePosNote(e, tran.pos)}
          value={tran.pos}
        >
          <option value={tran.pos} defaultValue>
            {tran.pos}
          </option>
          {POSLeft.map((pos, index) => (
            <option key={index} value={pos}>
              {pos}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

const Note = ({ tran, isCreator, onChangePosNote }) => {
  return (
    <div className="form-group position-relative mt-2 mb-2">
      <label className="label-cap" htmlFor="note">
        Note
      </label>
      <textarea
        type="text"
        className={`form-control dark-input ${styles["note-input"]}`}
        placeholder=""
        autoComplete="off"
        id="note"
        name="note"
        maxLength="220"
        value={tran.note}
        onChange={(e) => (isCreator ? onChangePosNote(e, tran.pos) : () => {})}
      />
      <span className="num-length">{220 - tran.note.length}</span>
    </div>
  );
};

const Definitions = ({
  tran,
  isCreator,
  isShowDef,
  setIsShowDef,
  translation,
  setTranslation,
  isDefinitionValid,
}) => {
  const onAddDefinition = (os) => {
    const newTrans = translation.trans.map((tran) =>
      tran.pos === os && tran.definitions.length < 22
        ? {
            ...tran,
            definitions: [...tran.definitions, ""],
          }
        : tran
    );
    setTranslation({ ...translation, trans: newTrans });
    setIsShowDef(true);
  };

  const onChangeDefinition = (e, os, di) => {
    e.target.style.height = "0px";
    e.target.style.height = `${e.target.scrollHeight}px`;

    const value = e.target.value;
    const newTrans = translation.trans.map((tran) =>
      tran.pos === os
        ? {
            ...tran,
            definitions: tran.definitions.map((d, index) =>
              index === di ? value : d
            ),
          }
        : tran
    );
    setTranslation({ ...translation, trans: newTrans });
  };

  const onRemoveDefinition = (os, di) => {
    const newTrans = translation.trans.map((tran) =>
      tran.pos === os
        ? {
            ...tran,
            definitions: tran.definitions.filter(
              (definition, index) => index !== di
            ),
          }
        : tran
    );
    setTranslation({ ...translation, trans: newTrans });
  };

  return (
    <div className="form-group mt-2 mb-2">
      <label className="label-cap">
        <span
          className={`pointer ${
            isDefinitionValid(tran.definitions) ? "text-danger" : ""
          }`}
          onClick={() => setIsShowDef(!isShowDef)}
        >
          {isShowDef ? (
            <FaChevronDown className="me-2" size={12} />
          ) : (
            <FaChevronRight className="me-2" size={12} />
          )}
          Definitions
          <BsDash className="ms-1 me-1" size={16} />
          <DarkTooltip title={"Must < 22"} placement={"top"}>
            <span>{tran.definitions.length}</span>
          </DarkTooltip>
        </span>
        {isCreator && (
          <DarkTooltip title={"Add Definition"} placement={"top"}>
            <span
              className="ms-2 me-2 pointer"
              onClick={() => onAddDefinition(tran.pos)}
            >
              <BsPlus size={20} />
            </span>
          </DarkTooltip>
        )}
      </label>

      {isShowDef &&
        tran.definitions.map((d, di) => (
          <div className={`${styles.definitions} mb-2`} key={di}>
            <textarea
              type="text"
              className={`form-control dark-input ${styles["def-input"]}`}
              placeholder=""
              autoComplete="off"
              name="definition"
              maxLength="2020"
              value={d}
              disabled={!isCreator}
              onChange={(e) => isCreator && onChangeDefinition(e, tran.pos, di)}
            />
            <DarkTooltip title={"Remove"} placement={"top"}>
              <IconButton
                className="text-danger ms-2 me-2"
                onClick={() => onRemoveDefinition(tran.pos, di)}
              >
                <BsX />
              </IconButton>
            </DarkTooltip>
          </div>
        ))}

      {isShowDef && (
        <label
          className="label-cap mt-2 mb-2 pointer"
          onClick={() => setIsShowDef(!isShowDef)}
        >
          Show less
        </label>
      )}
    </div>
  );
};

const Meanings = ({
  tran,
  isCreator,
  isShowMea,
  setIsShowMea,
  translation,
  setTranslation,
  isMeaningsValid,
}) => {
  const { language_speaking } = useSelector((state) => state.course);

  const [isSpecialDown, setIsSpecialDown] = useState(false);

  const [isShowCanBe, setIsShowCanBe] = useState({
    is: false,
    pos: "noun",
    index: 0,
    reverse: false,
    text: "",
  });

  const handleShowCanBe = (object) => {
    const isShow =
      isShowCanBe.is === true &&
      isShowCanBe.index === object.index &&
      isShowCanBe.reverse === object.reverse;

    setIsShowCanBe({
      is: isShow,
      pos: object.pos,
      index: object.index,
      reverse: object.reverse,
      text: object.text,
    });
  };

  const onChangeMeaning = (e, os, mi) => {
    if (isSpecialDown) {
      setIsSpecialDown(false);
      return;
    }

    e.target.style.height = "0px";
    e.target.style.height = `${e.target.scrollHeight}px`;

    const value = e.target.value;
    const newTrans = translation.trans.map((tran) =>
      tran.pos === os
        ? {
            ...tran,
            meanings: tran.meanings.map((me, index) =>
              index === mi ? { ...me, meaning: value } : me
            ),
          }
        : tran
    );

    setTranslation({ ...translation, trans: newTrans });
    handleShowCanBe({ pos: os, index: mi, reverse: false, text: value });
  };

  const onKeyDownMeaning = (e, os, mi, meaning) => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;

    if (end - start < 1) return;

    if (e.key === "[") {
      setIsSpecialDown(true);

      const selectedText = meaning.substring(start, end);
      const wrapper = "[" + selectedText + "]";
      const value =
        meaning.substring(0, start) +
        wrapper +
        meaning.substring(end, meaning.length);

      const newTrans = translation.trans.map((tran) =>
        tran.pos === os
          ? {
              ...tran,
              meanings: tran.meanings.map((me, index) =>
                index === mi ? { ...me, meaning: value } : me
              ),
            }
          : tran
      );
      setTranslation({ ...translation, trans: newTrans });

      handleShowCanBe({ pos: os, index: mi, reverse: false, text: value });
    }
  };

  const onRemoveMeaning = (os, mi) => {
    const newTrans = translation.trans.map((tran) =>
      tran.pos === os && tran.meanings.length > 1
        ? {
            ...tran,
            meanings: tran.meanings.filter((meaning, index) => index !== mi),
          }
        : tran
    );
    setTranslation({ ...translation, trans: newTrans });
  };

  const onAddMeaning = (os) => {
    const newTrans = translation.trans.map((tran) =>
      tran.pos === os && tran.meanings.length < 22
        ? {
            ...tran,
            meanings: [
              ...tran.meanings,
              {
                meaning: "",
                reverses: [],
              },
            ],
          }
        : tran
    );
    setTranslation({ ...translation, trans: newTrans });
    setIsShowMea(true);
  };

  const [isTips, setIsTips] = useState(false);

  const [query, setQuery] = useState("");
  const onChangeQuery = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  const [anchorElCanbe, setAnchorElCanbe] = useState(null);
  const openCanbe = Boolean(anchorElCanbe);
  const handleClickCanbe = (event) => {
    setQuery("");
    setAnchorElCanbe(event.currentTarget);
  };
  const handleCloseCanbe = (event, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      setAnchorElCanbe(null);
    }
  };

  const queryLatinized = latinize(query).toLowerCase();

  return (
    <>
      {isTips && <TranslationTips onClose={() => setIsTips(false)} />}

      <DarkMenu
        anchorEl={anchorElCanbe}
        open={openCanbe}
        handleClose={handleCloseCanbe}
      >
        <MenuItem>
          <div className={`input-group ${styles["search-canbe"]}`}>
            <input
              type="search"
              className="form-control dark-input"
              placeholder="Search"
              autoComplete="off"
              value={query}
              onChange={onChangeQuery}
            />
            <button className="input-group-append btn btn-outline-secondary">
              <BsSearch size={20} />
            </button>
          </div>
        </MenuItem>
        <div className={styles.canbe}>
          {fusion2Texts(isShowCanBe.text).map(
            (ele, index) =>
              latinize(ele).toLowerCase().indexOf(queryLatinized) > -1 && (
                <MenuItem className={styles["canbe-item"]} key={index}>
                  {ele}
                </MenuItem>
              )
          )}
        </div>
      </DarkMenu>

      <div className="form-group mt-2 mb-2">
        <label className="label-cap">
          <span
            className={classnames("pointer", {
              "text-danger": isMeaningsValid(tran.meanings),
            })}
            onClick={() => setIsShowMea(!isShowMea)}
          >
            {isShowMea ? (
              <FaChevronDown className="me-2" size={12} />
            ) : (
              <FaChevronRight className="me-2" size={12} />
            )}
            Meanings
            <BsDash className="ms-1 me-1" size={16} />
            <DarkTooltip title={"Must < 22"} placement={"top"}>
              <span>{tran.meanings.length}</span>
            </DarkTooltip>
          </span>
          {isCreator && (
            <DarkTooltip title={"Add Meaning"} placement={"top"}>
              <span
                className="ms-2 me-2 pointer"
                onClick={() => onAddMeaning(tran.pos)}
              >
                <BsPlus size={20} />
              </span>
            </DarkTooltip>
          )}
          <DarkTooltip title={"Tips"} placement={"top"}>
            <TipsAndUpdatesOutlined
              className="ms-2 pointer"
              onClick={() => setIsTips(true)}
            />
          </DarkTooltip>
        </label>
        {isShowMea &&
          tran.meanings.map((me, mi) => (
            <div className={styles["meaning-wrapper"]} key={mi}>
              <div className="form-group mb-2">
                <label className="label-cap">Meaning</label>
                <div className={styles.meaning}>
                  <textarea
                    type="text"
                    className={`form-control dark-input ${styles["meaning-input"]}`}
                    placeholder={`Meaning in ${language_speaking.language}`}
                    autoComplete="off"
                    name="meanings"
                    maxLength="2020"
                    value={me.meaning}
                    disabled={!isCreator}
                    onChange={(e) =>
                      isCreator && onChangeMeaning(e, tran.pos, mi)
                    }
                    onKeyDown={(e) =>
                      isCreator && onKeyDownMeaning(e, tran.pos, mi, me.meaning)
                    }
                  />
                  <DarkTooltip title={"Remove"} placement={"top"}>
                    <IconButton
                      className="text-danger ms-2 me-2 pointer"
                      onClick={() => onRemoveMeaning(tran.pos, mi)}
                    >
                      <BsX />
                    </IconButton>
                  </DarkTooltip>
                </div>
              </div>

              {fusion2Texts(me.meaning).length > 1 && (
                <small
                  className={classnames("label-flexcap pointer mt-2 mb-3", {
                    "text-danger": !fusion2Texts(me.meaning).length < 99,
                  })}
                  onClick={(e) => {
                    handleClickCanbe(e);
                    handleShowCanBe({
                      pos: tran.pos,
                      index: mi,
                      reverse: false,
                      text: me.meaning,
                    });
                  }}
                >
                  Meanings can be
                  <BsDash className="ms-1 me-1" />
                  <span>{fusion2Texts(me.meaning).length}</span>
                </small>
              )}

              {/* ReverseMeanings */}
              <ReverseMeanings
                me={me}
                mi={mi}
                tran={tran}
                isCreator={isCreator}
                translation={translation}
                setTranslation={setTranslation}
                isSpecialDown={isSpecialDown}
                setIsSpecialDown={setIsSpecialDown}
                handleClickCanbe={handleClickCanbe}
                handleShowCanBe={handleShowCanBe}
              />
              {/* End ReverseMeanings */}
            </div>
          ))}

        {isShowMea && (
          <label
            className="label-cap mt-2 mb-2 pointer"
            onClick={() => setIsShowMea(!isShowMea)}
          >
            Show less
          </label>
        )}
      </div>
    </>
  );
};

const ReverseMeanings = ({
  me,
  mi,
  tran,
  isCreator,
  translation,
  setTranslation,
  isSpecialDown,
  setIsSpecialDown,
  handleClickCanbe,
  handleShowCanBe,
}) => {
  const { language_learning } = useSelector((state) => state.course);

  const onAddReverseMeaning = (os, mi) => {
    const newTrans = translation.trans.map((tran) =>
      tran.pos === os
        ? {
            ...tran,
            meanings: tran.meanings.map((me, index) =>
              index === mi && me.reverses.length < 22
                ? { ...me, reverses: [...me.reverses, ""] }
                : me
            ),
          }
        : tran
    );
    setTranslation({ ...translation, trans: newTrans });
  };

  const onChangeReverseMeaning = (e, os, mi, rmi) => {
    if (isSpecialDown) {
      setIsSpecialDown(false);
      return;
    }

    e.target.style.height = "0px";
    e.target.style.height = `${e.target.scrollHeight}px`;

    const value = e.target.value;
    const newTrans = translation.trans.map((tran) =>
      tran.pos === os
        ? {
            ...tran,
            meanings: tran.meanings.map((me, index) =>
              index === mi
                ? {
                    ...me,
                    reverses: me.reverses.map((rme, idx) =>
                      idx === rmi ? value : rme
                    ),
                  }
                : me
            ),
          }
        : tran
    );

    setTranslation({ ...translation, trans: newTrans });
    handleShowCanBe({ pos: os, index: rmi, reverse: true, text: value });
  };

  const onKeyDownReverseMeaning = (e, os, mi, rmi, reverse) => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;

    if (end - start < 1) return;

    if (e.key === "[") {
      setIsSpecialDown(true);

      const selectedText = reverse.substring(start, end);
      const wrapper = "[" + selectedText + "]";
      const value =
        reverse.substring(0, start) +
        wrapper +
        reverse.substring(end, reverse.length);

      const newTrans = translation.trans.map((tran) =>
        tran.pos === os
          ? {
              ...tran,
              meanings: tran.meanings.map((me, index) =>
                index === mi
                  ? {
                      ...me,
                      reverses: me.reverses.map((rme, idx) =>
                        idx === rmi ? value : rme
                      ),
                    }
                  : me
              ),
            }
          : tran
      );
      setTranslation({ ...translation, trans: newTrans });

      handleShowCanBe({ pos: os, index: rmi, reverse: true, text: value });
    }
  };

  const onRemoveReverseMeaning = (os, mi, rmi) => {
    const newTrans = translation.trans.map((tran) =>
      // && tran.reverses.length > 1
      tran.pos === os
        ? {
            ...tran,
            meanings: tran.meanings.map((me, index) =>
              index === mi
                ? {
                    ...me,
                    reverses: me.reverses.filter((rme, idx) => idx !== rmi),
                  }
                : me
            ),
          }
        : tran
    );
    setTranslation({ ...translation, trans: newTrans });
  };

  return (
    <div className="form-group">
      <label className="label-cap">
        Reverse meanings
        {isCreator && (
          <>
            <BsDash className="ms-1 me-1" />
            <DarkTooltip title={"Must < 22"} placement={"top"}>
              <span>{me.reverses.length}</span>
            </DarkTooltip>
            <DarkTooltip title={"Add Reverse Meaning"} placement={"top"}>
              <span
                className="ms-2 me-2 pointer"
                onClick={() => onAddReverseMeaning(tran.pos, mi)}
              >
                <BsPlus />
              </span>
            </DarkTooltip>
          </>
        )}
      </label>
      {me.reverses.length > 0 &&
        me.reverses.map((rme, rmi) => (
          <div className={styles["reverse-wrapper"]} key={rmi}>
            {isCreator && (
              <div className={styles["reverse-meaning"]}>
                <textarea
                  type="text"
                  className={`form-control dark-input ${styles["meaning-input"]}`}
                  placeholder={`Reverse meaning in ${language_learning.language}`}
                  autoComplete="off"
                  name="reverses"
                  maxLength="2020"
                  value={rme}
                  onChange={(e) => onChangeReverseMeaning(e, tran.pos, mi, rmi)}
                  onKeyDown={(e) =>
                    onKeyDownReverseMeaning(e, tran.pos, mi, rmi, rme)
                  }
                />
                <DarkTooltip title={"Remove"} placement={"top"}>
                  <IconButton
                    className="text-danger ms-2 me-2 pointer"
                    onClick={() => onRemoveReverseMeaning(tran.pos, mi, rmi)}
                  >
                    <BsX />
                  </IconButton>
                </DarkTooltip>
              </div>
            )}
            {fusion2Texts(rme).length > 1 && (
              <small
                className={`label-flexcap pointer mt-2 mb-3 ${
                  fusion2Texts(rme).length < 99 ? "" : "text-danger"
                }`}
                onClick={(e) => {
                  handleClickCanbe(e);
                  handleShowCanBe({
                    pos: tran.pos,
                    index: rmi,
                    reverse: true,
                    text: rme,
                  });
                }}
              >
                Reverse meanings can be
                <BsDash className="ms-1 me-1" />
                <span>{fusion2Texts(rme).length}</span>
              </small>
            )}
          </div>
        ))}
    </div>
  );
};

const WordTranModal = ({ object, isCreate, isCreator, onAction, onClose }) => {
  const dispatch = useDispatch();

  const [POS] = useState(PartOfSpeech);
  const [POSLeft, setPOSLeft] = useState([]);
  const [POSelected, setPOSelected] = useState([]);
  const [POShowing, setPOShowing] = useState("");

  useEffect(() => {
    setPOSLeft(POS.filter((os) => !POSelected.some((o) => o === os)));
  }, [POS, POSelected]);

  const initialTran = () => {
    const pos = POSLeft[0];
    setPOSelected([...POSelected, pos]);
    setPOShowing(pos);

    return {
      pos: pos,
      note: "",
      definitions: [],
      meanings: [
        {
          meaning: "",
          reverses: [],
        },
      ],
    };
  };

  const initialState = () => {
    if (isCreate) return { ipa: "", image_url: "", trans: [initialTran()] };
    else {
      const initialTranslation = object.translation;
      const initialPOS = initialTranslation.trans.map((tran) => tran.pos);
      setPOSelected(initialPOS);
      setPOShowing(initialPOS[0]);

      return initialTranslation;
    }
  };

  const [translation, setTranslation] = useState(() => initialState());
  const [isCanAction, setIsCanAction] = useState(false);

  const onRestartTrans = () => {
    setPOSLeft(POS);

    setTranslation({
      ...translation,
      trans: [initialTran()],
    });
  };

  const onActionAndClose = () => {
    onAction(object, translation);
    onClose();
  };

  const isDefinitionValid = (definitions) => {
    return definitions.some((ele) => ele.trim().length < 1);
  };

  const isMeaningsValid = (meanings) => {
    return meanings.some(
      (ele) =>
        ele.meaning.trim().length < 1 ||
        fusion2Texts(ele.meaning).length > 99 ||
        ele.reverses.some((revr) => fusion2Texts(revr).length > 99)
    );
    // || rme.trim().length < 1
  };

  const isInvalidTranslation = (tran) => {
    return (
      isDefinitionValid(tran.definitions) || isMeaningsValid(tran.meanings)
    );
  };

  useEffect(() => {
    if (translation.trans.some((tran) => isInvalidTranslation(tran))) {
      setIsCanAction(false);
      return;
    }

    if (isCreate) {
      setIsCanAction(true);
    } else {
      const iniTran = object.translation;
      const nowTran = translation;
      if (JSON.stringify(iniTran) !== JSON.stringify(nowTran))
        setIsCanAction(true);
      else setIsCanAction(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translation]);

  const onAddTran = () => {
    if (POSLeft.length > 0) {
      const newTrans = [...translation.trans, initialTran()];
      setTranslation({ ...translation, trans: newTrans });
      setPOShowing(initialTran().pos);
    }
  };

  const [isImgError, setIsImgError] = useState(false);
  const onChangeImageIpa = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setTranslation({ ...translation, [name]: value });

    if (name === "image_url") setIsImgError(false);
  };

  const [isShowDef, setIsShowDef] = useState(false);
  const [isShowMea, setIsShowMea] = useState(true);

  const onChangePosNote = (e, os) => {
    const name = e.target.name;
    const value = e.target.value;

    const newTrans = translation.trans.map((tran) =>
      tran.pos === os ? { ...tran, [name]: value } : tran
    );
    setTranslation({ ...translation, trans: newTrans });

    if (name === "pos") {
      setPOSelected([...POSelected.filter((o) => o !== os), value]);
      setPOShowing(value);
    } else if (name === "note") {
      e.target.style.height = "0px";
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  };

  return (
    <Modal isBlackBackDrop={false} onClose={onClose}>
      <div className={styles.modal}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div
              className={`${styles.closer} pointer`}
              onClick={() => onClose()}
            >
              <BsX size={32} />
            </div>
            <div className={styles["header-title"]}>
              Word Translation for <i>{object.word}</i>
              <span
                className="ms-1 pointer"
                onClick={() => dispatch(onSpeak(object.word, false, true))}
              >
                <BsVolumeUp size={22} />
              </span>
            </div>
          </div>
          <div className={`${styles.content} mt-3`}>
            <Image
              translation={translation}
              isCreator={isCreator}
              isImgError={isImgError}
              setIsImgError={setIsImgError}
              onChangeImageIpa={onChangeImageIpa}
            />
            <Ipa
              isCreator={isCreator}
              translation={translation}
              onChangeImageIpa={onChangeImageIpa}
            />
            <div className="form-group">
              <div className={styles["trans-label"]}>
                <div className="">
                  <label className="label-cap" htmlFor="pos">
                    Trans
                    <BsDash className="ms-1 me-1" />
                    <span>{translation.trans.length}</span>
                  </label>
                  {isCreator && (
                    <DarkTooltip title={"Add Tran"} placement={"top"}>
                      <span
                        className="ms-2 pointer"
                        onClick={() => onAddTran()}
                      >
                        <BsPlus size={20} />
                      </span>
                    </DarkTooltip>
                  )}
                </div>
                <DarkTooltip title={"Reset Trans"} placement={"top"}>
                  <IconButton className="" onClick={() => onRestartTrans()}>
                    <RestartAltRounded size={20} />
                  </IconButton>
                </DarkTooltip>
              </div>
              <div className={styles.trans}>
                {translation.trans.map((tran, index) => (
                  <label
                    key={index}
                    className={classnames(`${styles.tran} meow-card`, {
                      "text-danger": isInvalidTranslation(tran),
                    })}
                    htmlFor="pos"
                    onClick={() =>
                      tran.pos !== POShowing
                        ? setPOShowing(tran.pos)
                        : setPOShowing("")
                    }
                  >
                    {POShowing === tran.pos && (
                      <BsSnow2 size={20} className="me-1" />
                    )}
                    {tran.pos}
                  </label>
                ))}
              </div>
            </div>
            <div className={styles["tran-detail"]}>
              {translation.trans.map(
                (tran, index) =>
                  POShowing === tran.pos && (
                    <div
                      className={`${styles.translation} ${styles.wrapper}`}
                      key={index}
                    >
                      <PoS
                        tran={tran}
                        isCreator={isCreator}
                        translation={translation}
                        setTranslation={setTranslation}
                        onChangePosNote={onChangePosNote}
                        POSelected={POSelected}
                        setPOSelected={setPOSelected}
                        POShowing={POShowing}
                        setPOShowing={setPOShowing}
                        POSLeft={POSLeft}
                      />

                      <Note
                        tran={tran}
                        isCreator={isCreator}
                        onChangePosNote={onChangePosNote}
                      />

                      <Definitions
                        tran={tran}
                        isCreator={isCreator}
                        isShowDef={isShowDef}
                        setIsShowDef={setIsShowDef}
                        translation={translation}
                        setTranslation={setTranslation}
                        isDefinitionValid={isDefinitionValid}
                      />

                      <Meanings
                        tran={tran}
                        isCreator={isCreator}
                        isShowMea={isShowMea}
                        setIsShowMea={setIsShowMea}
                        translation={translation}
                        setTranslation={setTranslation}
                        isMeaningsValid={isMeaningsValid}
                      />
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <div className="btn me-3" onClick={() => onClose()}>
            Cancel
          </div>
          {isCreator && (
            <button
              className="btn btn-secondary"
              disabled={!isCanAction}
              onClick={() => onActionAndClose()}
            >
              {isCreate ? "Create Translation" : "Save Translation"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default WordTranModal;
