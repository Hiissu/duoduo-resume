import React, { useState, useRef } from "react";
import "./EditAvatar.css";
import { Modal } from "../../../components/Modal";
import AvatarEditor from "react-avatar-editor";
import {
  BsArrowClockwise,
  BsArrowCounterclockwise,
  BsImageFill,
} from "react-icons/bs";
import { Slider } from "@mui/material";

const EditAvatar = ({ image, setImageBase64, onClose }) => {
  const editor = useRef();

  const width = 720;
  const height = 720;
  const borderRadius = 50;

  const [scale, setScale] = useState(1);
  const handleScale = (e) => {
    const value = parseFloat(e.target.value);
    setScale(parseFloat(value));
  };

  const [rotate, setRotate] = useState(0);
  const rotateScale = (e) => {
    const value = parseFloat(e.target.value);
    setRotate(value);
  };

  const rotateLeft = () => {
    setRotate((rotate - 90) % 360);
  };

  const rotateRight = () => {
    setRotate((rotate + 90) % 360);
  };

  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const handlePositionChange = (position) => {
    setPosition(position);
  };

  const logCallback = (e) => {
    console.log("callback", e);
  };

  const onApply = () => {
    const imgBase64 = editor.current?.getImageScaledToCanvas().toDataURL();
    setImageBase64(imgBase64);
    onClose();
    console.log(imgBase64);
  };

  return (
    <Modal isBlackBackDrop={false} onClose={onClose}>
      <div className="eccm">
        <div className="eccm-container">
          <h4 className="enm-header-title mt-2 mb-2">Edit Avatar</h4>

          <div className="enm-content">
            <AvatarEditor
              ref={editor}
              image={image}
              scale={scale}
              width={width}
              height={height}
              rotate={rotate}
              position={position}
              onPositionChange={handlePositionChange}
              borderRadius={width / (100 / borderRadius)}
              onLoadFailure={logCallback.bind(this, "onLoadFailed")}
              onLoadSuccess={logCallback.bind(this, "onLoadSuccess")}
              onImageReady={logCallback.bind(this, "onImageReady")}
            />
            <div className="slider">
              <BsImageFill size={16} />
              <Slider
                color="secondary"
                min="1"
                max="2"
                step="0.01"
                value={scale}
                onChange={handleScale}
              />
              <BsImageFill size={32} />
            </div>
            <div className="d-flex justify-content-between">
              <BsArrowCounterclockwise
                className="me-2"
                size={16}
                onClick={() => rotateLeft()}
              />
              <Slider
                color="secondary"
                min="-180"
                max="180"
                step="1"
                value={rotate}
                onChange={rotateScale}
              />
              <input name="rotation" type="range" onChange={this.rotateScale} />
              <BsArrowClockwise
                className="ms-2"
                size={16}
                onClick={() => rotateRight()}
              />
            </div>
          </div>
        </div>

        <div className="eccm-footer">
          <div className="btn eccm-close me-3" onClick={() => onClose()}>
            Cancel
          </div>
          <button className="btn btn-secondary" onClick={() => onApply()}>
            Apply
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditAvatar;
