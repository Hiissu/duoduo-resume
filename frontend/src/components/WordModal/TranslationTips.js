import React from "react";
import { BsArrowBarRight } from "react-icons/bs";
import { PopupCenter } from "../Popup";
import "./TranslationTips.css";

const TranslationTips = ({ onClose }) => {
  return (
    <PopupCenter onClose={onClose}>
      <div className="tran-tips-wrapper p-1">
        <div className="mt-2 mb-2 ms-2">
          <p>
            If you don't want to repeat your meanings/reverses just because it
            has few changes.
          </p>
          <p>
            You can use square bracket [ ] to add an option and separate options
            in there by slash /
          </p>
        </div>
        <div>
          {/* <div className="hr" /> */}
          <div className="tran-tips">
            <div className="tran-tip">
              <i>meow [you]</i>
              <BsArrowBarRight className="ms-4 me-4" />
              <div className="tran-convert-answer">
                <i>meow</i>
                <i className="text-pink">meow you</i>
              </div>
            </div>
            <div className="hr" />
            <div className="tran-tip">
              <i>to [the Moon/der Mond/la Lune]</i>
              <BsArrowBarRight className="ms-4 me-4" />
              <div className="tran-convert-answer">
                <i>to the Moon</i>
                <i className="text-pink">to der Mond</i>
                <i>to la Lune</i>
              </div>
            </div>
            <div className="hr" />
            <div className="tran-tip">
              <i>meow [you] to [the Moon/der Mond/la Lune]</i>
              <BsArrowBarRight className="ms-4 me-4" />
              <div className="tran-convert-answer">
                <i className="text-pink">meow to the Moon</i>
                <i>meow you to the Moon</i>
                <i className="text-pink">meow to der Mond</i>
                <i>meow you to der Mond</i>
                <i className="text-pink">meow to la Lune</i>
                <i>meow you to la Lune</i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PopupCenter>
  );
};

export default TranslationTips;
