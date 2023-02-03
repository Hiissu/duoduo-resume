import "./CollectionPractice.css";
import { Progress } from "@nextui-org/react";
import React, { useCallback, useState } from "react";
import { FileRichtext } from "react-bootstrap-icons";
import { BsGear, BsSlash, BsVolumeDown, BsVolumeUp, BsX } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { DocumentViewModal } from "../DocumentManager/components";
import { Modal } from "../Modal";
import { DarkTooltip } from "../Tooltip";
import { Challenges } from "./components";
import { Drawer, IconButton, Slider } from "@mui/material";
import {
  updateVoiceIndex,
  updateVoicePitch,
  updateVoiceRate,
  updateVoiceVolume,
} from "../../store/slices/settingSlice";

const CollectionPractice = ({ onClose, collectionDetail }) => {
  const dispatch = useDispatch();
  const { language_learning } = useSelector((state) => state.course);
  const { voiceIndex, voiceRate, voicePitch, voiceVolume, voicesInLearning } =
    useSelector((state) => state.setting);

  const onChangeVoiceSpeed = (e) => {
    const value = e.target.value;
    dispatch(updateVoiceRate(value));
  };

  const onChangeVoicePitch = (e) => {
    const value = e.target.value;
    dispatch(updateVoicePitch(value));
  };

  const onChangeVoiceVolume = (e) => {
    const value = e.target.value;
    dispatch(updateVoiceVolume(value));
  };

  const onChangeVoice = (e) => {
    const value = e.target.value;
    dispatch(
      updateVoiceIndex({
        index: value,
        language_code: language_learning.language_code,
      })
    );
  };

  const [isSetting, setIsSetting] = useState(false);
  const toggleDrawerSetting = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setIsSetting(open);
  };

  const [isDocuments, setIsDocuments] = useState(false);
  const toggleDrawerDocuments = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setIsDocuments(open);
  };

  const [isExit, setIsExit] = useState(false);
  const toggleDrawerExit = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setIsExit(open);
  };

  const notDefault =
    '{"root":{"children":[{"children":[{"altText":"Meowwwwwwwww","caption":{"editorState":{"root":{"children":[],"direction":null,"format":"","indent":0,"type":"root","version":1}}},"height":0,"maxWidth":500,"showCaption":false,"src":"/static/media/meowarm.480fcda6fbea8abbd454.png","type":"image","version":1,"width":0},{"altText":"Meowwwwwwwww","caption":{"editorState":{"root":{"children":[],"direction":null,"format":"","indent":0,"type":"root","version":1}}},"height":499.9999694824219,"maxWidth":500,"showCaption":false,"src":"/static/media/meowow.dbb1f0a499d71eefb79b.jpg","type":"image","version":1,"width":500}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';
  const [docsInCollection] = useState(
    collectionDetail.documents || [
      { name: "Unknoeasd", content: notDefault, version: "0.3.7" },
      { name: "Moewmeow Doc", content: notDefault, version: "0.3.7" },
    ]
  );

  // const [sentencesInCollection, setSentencesInCollection] = useState(
  //   collectionDetail.sentences
  // );
  // const [unknownSentencesInCollection, setUnknownSentencesInCollection] = useState(
  //   collectionDetail.unknown_sentences
  // );

  // const [sentenceTransCreated, setSentenceTransCreated] = useState(
  //   collectionDetail.sentence_trans_created
  // );
  // const [sentenceTransUsing, setSentenceTransUsing] = useState(
  //   collectionDetail.sentence_trans_using
  // );
  // const [sentenceTransBackup, setSentenceTransBackup] = useState(
  //   collectionDetail.sentence_trans_backup
  // );

  const [progress, setProgress] = useState({ value: 0, count: 0 });
  const [successAudio] = useState(
    new Audio(
      "https://d35aaqx5ub95lt.cloudfront.net/sounds/37d8f0b39dcfe63872192c89653a93f6.mp3"
    )
  );

  const onPlaySuccessAudio = useCallback(() => {
    successAudio.volume = 0.6;
    successAudio.play();
  }, [successAudio]);

  const [errorAudio] = useState(
    new Audio(
      "https://d35aaqx5ub95lt.cloudfront.net/sounds/f0b6ab4396d5891241ef4ca73b4de13a.mp3"
    )
  );

  const onPlayErrorAudio = useCallback(() => {
    errorAudio.volume = 0.6;
    errorAudio.play();
  }, [errorAudio]);

  const [completeAudio] = useState(
    new Audio(
      "https://d35aaqx5ub95lt.cloudfront.net/sounds/7abe057dc8446ad325229edd6d8fd250.mp3"
    )
  );

  const onPlayCompleteAudio = useCallback(() => {
    completeAudio.volume = 0.6;
    completeAudio.play();
  }, [completeAudio]);

  const [isViewDoc, setIsViewDoc] = useState({ is: false, doo: {} });
  return (
    <>
      {/* Drawer Setting */}
      <Drawer
        anchor={"right"}
        open={isSetting}
        onClose={toggleDrawerSetting(false)}
        sx={{ opacity: 0.98 }}
        PaperProps={{
          sx: {
            backgroundColor: "black",
            color: "white",
          },
        }}
      >
        <div className="d-flex align-items-center justify-content-between ms-2 mt-2">
          <h1 className="ms-3">Settings</h1>
          <IconButton onClick={toggleDrawerSetting(false)}>
            <BsX size={32} className="me-2" />
          </IconButton>
        </div>
        <div className="hr" />

        <div className="d-flex align-items-center justify-content-between ms-3 mt-3">
          <label className="lpm-label"> Voice</label>
          <select
            className="form-control form-select dark-input ms-3 mb-2"
            id="pos"
            name="pos"
            onChange={(e) => onChangeVoice(e)}
            value={voiceIndex}
          >
            {voicesInLearning.map((voice, index) => (
              <option key={index} value={index}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex align-items-center justify-content-start ms-3">
          <label className="lpm-label">Rate</label>
          <Slider
            // size="small"
            // color="secondary"
            className="ms-3 me-3"
            min={0.2}
            step={0.2}
            max={2}
            sx={{ width: 220 }}
            value={voiceRate}
            onChange={(e) => onChangeVoiceSpeed(e)}
          />
          <label className="lpm-label">{voiceRate}</label>
        </div>

        <div className="d-flex align-items-center justify-content-start ms-3">
          <label className="lpm-label">Volume</label>
          <span className="d-flex align-items-center ms-3 me-3">
            <IconButton onClick={() => updateVoiceVolume(0.6)}>
              <BsVolumeDown size={32} />
            </IconButton>
            <Slider
              aria-label="Volume"
              className="ms-2 me-3"
              min={0.2}
              step={0.2}
              max={1}
              sx={{ width: 220 }}
              value={voiceVolume}
              onChange={(e) => onChangeVoiceVolume(e)}
            />
            <IconButton onClick={() => updateVoiceVolume(1)}>
              <BsVolumeUp size={32} />
            </IconButton>
          </span>
          <label className="lpm-label"> {voiceVolume}</label>
        </div>

        <div className="d-flex align-items-center justify-content-start ms-3">
          <label className="lpm-label"> Pitch</label>
          <Slider
            className="ms-3 me-3"
            min={0.2}
            step={0.2}
            max={1}
            sx={{ width: 220 }}
            value={voicePitch}
            onChange={(e) => onChangeVoicePitch(e)}
          />
          <label className="lpm-label"> {voicePitch}</label>
        </div>
      </Drawer>

      {/* Document Preview Modal */}
      {isViewDoc.is && (
        <DocumentViewModal
          onClose={() => setIsViewDoc({ ...isViewDoc, is: false })}
          doo={isViewDoc.doo}
        />
      )}

      {/* Drawer Documents */}
      <Drawer
        anchor={"left"}
        open={isDocuments}
        onClose={toggleDrawerDocuments(false)}
        sx={{ opacity: 0.98 }}
        PaperProps={{
          sx: {
            backgroundColor: "black",
            color: "white",
            minWidth: "396px",
            maxWidth: "696px",
          },
        }}
      >
        <div className="d-flex align-items-center justify-content-between ms-2 mt-2">
          <h1 className="ms-3">Documents</h1>
          <IconButton onClick={toggleDrawerDocuments(false)}>
            <BsX size={32} className="me-2" />
          </IconButton>
        </div>

        <div className="hr" />
        {docsInCollection.length > 0 ? (
          docsInCollection.map((doc, index) => (
            // <DarkTooltip key={index} title="View" placement="top" arrow>
            <div
              key={index}
              className="dm-doc"
              onClick={() => setIsViewDoc({ doo: doc, is: true })}
            >
              <span>{doc.name}</span>
            </div>
            // </DarkTooltip>
          ))
        ) : (
          <div className="dm-docs-none mt-3">No docs available</div>
        )}
      </Drawer>

      {/* Drawer Exit */}
      <Drawer
        anchor={"bottom"}
        open={isExit}
        onClose={toggleDrawerExit(false)}
        sx={{ opacity: 0.98 }}
        PaperProps={{
          sx: {
            backgroundColor: "black",
            color: "white",
          },
        }}
      >
        <div className="lpm-exit">
          <div className="lpm-exit-message">
            <span className="message-comfirm">
              Are you sure you want to quit?
            </span>
            <span className="message-detail">
              All progress in this session will be lost.
            </span>
          </div>
          <div>
            <button
              className="btn btn-outline-secondary"
              onClick={toggleDrawerExit(false)}
            >
              <span className="ms-5 me-5 mt-1 mb-1">STAY</span>
            </button>
            <button className="btn btn-primary ms-2" onClick={() => onClose()}>
              <span className="ms-5 me-5 mt-1 mb-1">QUIT</span>
            </button>
          </div>
        </div>
      </Drawer>

      <Modal isBlackDrop={true} isEsc={false}>
        <DarkTooltip title="Settings" placement="top" arrow>
          <IconButton
            className="lpm-setting"
            onClick={toggleDrawerSetting(true)}
          >
            <BsGear />
          </IconButton>
        </DarkTooltip>

        <DarkTooltip title="Documents" placement="top" arrow>
          <IconButton
            className="lpm-docs"
            onClick={toggleDrawerDocuments(true)}
          >
            <FileRichtext size={32} />
          </IconButton>
        </DarkTooltip>

        <div className="lpm">
          <div className="lpm-question"></div>
          <div className="lpm-answer"></div>
          <div className="lpm-detail"></div>

          <div className="lpm-header mt-4">
            <span className="pointer" onClick={() => setIsExit(true)}>
              <BsX size={32} />
            </span>
            <Progress
              className="ms-2 me-4"
              value={(progress.value * 100) / progress.count}
              color="gradient"
              shadow
            />
            <div className="lpm-progress d-flex">
              <span>{progress.value} </span>
              <BsSlash size={28} />
              <span>{progress.count}</span>
            </div>
          </div>

          <Challenges
            collectionDetail={collectionDetail}
            setProgress={setProgress}
            onPlaySuccessAudio={onPlaySuccessAudio}
            onPlayErrorAudio={onPlayErrorAudio}
            onPlayCompleteAudio={onPlayCompleteAudio}
          />
        </div>
      </Modal>
    </>
  );
};

export default CollectionPractice;
