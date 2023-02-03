import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { BsDash, BsPlus, BsTrash, BsX } from "react-icons/bs";
import { CircularProgress, IconButton, Snackbar } from "@mui/material";
import {
  createWordTranslation,
  deleteWordTranslation,
  getWordTranslations,
  removeWordTranslation,
  updateWordTranslation,
  uweWordTranslation,
} from "../../../store/actions/word";
import { Drawer } from "../../Drawer";
import { RemoveDeleteModal } from "../../Modal";
import { DarkTooltip } from "../../Tooltip";

import { TranOptionsModal, WordTranModal } from "../../WordModal";

const WordTranslations = ({
  word,
  wordTranslations,
  onUpdateTran,
  onDeleteTran,
}) => {
  //   getWordTranslations,
  // createWordTranslation,
  // updateWordTranslation,
  // deleteWordTranslation,
  // uweWordTranslation,
  //   removeWordTranslation,

  // ?????
  const [isShowWordTran, setIsShowWordTran] = useState({
    is: false,
    object: {},
  });

  const [isDeleteWordTran, setIsDeleteWordTran] = useState({
    is: false,
    object: {},
  });

  return (
    <>
      {isShowWordTran.is && (
        <WordTranModal
          onClose={() => setIsShowWordTran({ ...isShowWordTran, is: false })}
          object={isShowWordTran.object}
          isReadOnly={isShowWordTran.object?.is_creator}
          isCreate={false}
          onAction={isShowWordTran.object?.is_creator ? onUpdateTran : () => {}}
        />
      )}

      {isDeleteWordTran.is && (
        <RemoveDeleteModal
          onClose={() =>
            setIsDeleteWordTran({ ...isDeleteWordTran, is: false })
          }
          object={isDeleteWordTran.object}
          action={"delete"}
          subject={"word translation"}
          bridge={"of"}
          target={isDeleteWordTran.object.word}
          onAction={onDeleteTran}
        />
      )}

      {wordTranslations.map((tran) => (
        <div
          key={tran.id}
          className="meow-card word-management-translation"
          onClick={() =>
            setIsShowWordTran({
              is: true,
              object: { word, ...tran },
            })
          }
        >
          <div className="word-management-translation-container">
            <i>{tran.translation.ipa}</i>
            <span className="word-management-translation-note">
              {tran.translation.note}
            </span>
            {/* <span className="word-management-translation-def">
              Definition: {tran.translation.trans[0].definitions[0]}
            </span> */}
            <span className="">...</span>
          </div>
          <div className="word-management-translation-footer">
            {/* <Link to={PROFILE_URL(tran.creator_username)} className="link-light"></Link> */}
            <div className="">
              <span className="word-management-translation-creator">
                {tran.creator_username}
              </span>
              <DarkTooltip title={"Latest update"} placement={"top"}>
                <span>{tran.date_updated}</span>
              </DarkTooltip>
            </div>
            {tran.is_creator && (
              <DarkTooltip title={"Delete Translation"}>
                <button
                  className="btn btn-outline-secondary text-danger"
                  onClick={() =>
                    setIsDeleteWordTran({
                      is: true,
                      object: { word, ...tran },
                    })
                  }
                >
                  <BsTrash />
                </button>
              </DarkTooltip>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

const WordDetails = ({
  word,
  wordId,
  onClose,
  getWordTranslations,
  createWordTranslation,
  updateWordTranslation,
  deleteWordTranslation,
  uweWordTranslation,
  removeWordTranslation,
}) => {
  // const [isPopUp, setIsPopUp] = useState(false);
  // const [popUp, setPopUp] = useState({ type: "", message: "", });
  // useEffect(() => {
  //   const timer = setTimeout(() => { setIsPopUp(false); }, 3456);
  //   return () => { clearTimeout(timer); };
  // }, [isPopUp]);

  const [snackPack, setSnackPack] = useState([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState(undefined);

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const handleClickSnack = (message) => () => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleExitedSnack = () => {
    setMessageInfo(undefined);
  };

  const onCreateTran = async (object, translation) => {
    console.log("createWordTranslation", object, object.id, translation);

    const response = await createWordTranslation(object.id, translation);
    handleClickSnack(response.message);
  };

  const onUpdateTran = async (object, translation) => {
    console.log("updateWordTranslation", object, object.translation_id);
    console.log("\n translation 2 update", translation);

    const response = await updateWordTranslation(
      object.id,
      object.translation_id,
      translation
    );
    handleClickSnack(response.message);
  };

  const onDeleteTran = async (object) => {
    console.log("onDeleteTran", object);

    const response = await deleteWordTranslation(object.word_id, object.id);
    handleClickSnack(response.message);
  };

  // const onUseTran = async (object) => {
  //   const response = await uweWordTranslation(object.word_id, object.id);
  //   handleClickSnack(response.message);
  // };
  // const onRemoveTran = async (object) => {
  //   const response = await removeWordTranslation(object.word_id, object.id);
  //   handleClickSnack(response.message);
  // };

  const [isAddWordTran, setIsAddWordTran] = useState({
    is: false,
    object: {},
  });

  const [isLoading, setIsLoading] = useState(true);
  const [wordTranslations, setWordTranslations] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await getWordTranslations(wordId);
      if (response.status === 200) {
        setWordTranslations(response.data);
      } else {
        alert(response.data.message);
      }
      setIsLoading(false);
    })();
  }, [getWordTranslations, wordId]);

  return (
    <>
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
        TransitionProps={{ onExited: handleExitedSnack }}
        message={messageInfo ? messageInfo.message : undefined}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            sx={{ p: 0.5 }}
            onClick={handleCloseSnack}
          >
            <BsX size={24} />
          </IconButton>
        }
      />

      {isAddWordTran.is && (
        <TranOptionsModal
          onClose={() => setIsAddWordTran({ ...isAddWordTran, is: false })}
          object={isAddWordTran.object}
          onCreateTran={onCreateTran}
        />
      )}

      <Drawer
        anchor={"right"}
        width={"420px"}
        isBackdrop={true}
        onClose={onClose}
      >
        <section className="drawer-header">
          <h2 className="drawer-title">Translations</h2>
          <div className="drawer-toolbar">
            <DarkTooltip title="Close" placement="bottom-end">
              <span>
                <BsX size={32} onClick={onClose} />
              </span>
            </DarkTooltip>
          </div>
        </section>
        <section className="drawer-container">
          <div className="">
            {isLoading ? (
              <div className="text-center">
                <CircularProgress color="inherit" />
              </div>
            ) : (
              <>
                <div className="hr" />
                <label className="label-cap ms-2 mt-2 mb-2">
                  Translations
                  <BsDash className="ms-1 me-1" />
                  {wordTranslations.length}
                  {!wordTranslations.some(
                    (tran) => tran.is_creator === true
                  ) && (
                    <DarkTooltip title={"Add Translation"} placement={"top"}>
                      <span
                        onClick={() =>
                          setIsAddWordTran({ is: true, object: { word } })
                        }
                      >
                        <BsPlus className="ms-2 me-2 pointer" />
                      </span>
                    </DarkTooltip>
                  )}
                </label>
                <WordTranslations
                  word={word}
                  wordTranslations={wordTranslations}
                  onUpdateTran={onUpdateTran}
                  onDeleteTran={onDeleteTran}
                />
              </>
            )}
          </div>
        </section>
      </Drawer>
    </>
  );
};

export default WordDetails;
