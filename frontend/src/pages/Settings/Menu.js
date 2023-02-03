import { Divider } from "@mui/material";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
// import { LogoutRoundedIcon } from "@mui/icons-material";

const Menu = ({ setting, setSettingWhat }) => {
  const dispatch = useDispatch();

  return (
    <div className="st-menu">
      <div className="st-menuer">
        <label className="label-cap mb-1">User Settings</label>
        <div
          className={`st-item ${setting === "account" ? "setting" : ""}`}
          onClick={() => setSettingWhat("account")}
        >
          Account
        </div>
        <div
          className={`st-item ${setting === "profile" ? "setting" : ""}`}
          onClick={() => setSettingWhat("profile")}
        >
          Profiles
        </div>
        <Divider />
        <label className="label-cap mb-1">Manage Settings</label>
        <div
          className={`st-item ${setting === "courses" ? "setting" : ""}`}
          onClick={() => setSettingWhat("courses")}
        >
          Courses
        </div>
        <div
          className={`st-item ${setting === "collections" ? "setting" : ""}`}
          onClick={() => setSettingWhat("collections")}
        >
          Collections
        </div>
        <div
          className={`st-item ${
            setting === "word_translations" ? "setting" : ""
          }`}
          onClick={() => setSettingWhat("word_translations")}
        >
          Word Translations
        </div>
        <div
          className={`st-item ${
            setting === "phrase_translations" ? "setting" : ""
          }`}
          onClick={() => setSettingWhat("phrase_translations")}
        >
          Phrase Translations
        </div>
        <div
          className={`st-item ${
            setting === "sentence_translations" ? "setting" : ""
          }`}
          onClick={() => setSettingWhat("sentence_translations")}
        >
          Sentence Translations
        </div>
        <Divider />
        <label className="label-cap mb-1"> Billing Settings</label>
        <div
          className={`st-item ${setting === "nitro" ? "st-setting" : ""}`}
          onClick={() => setSettingWhat("nitro")}
        >
          Nitro
        </div>
        <div
          className={`st-item ${
            setting === "server_boost" ? "st-setting" : ""
          }`}
          onClick={() => setSettingWhat("server_boost")}
        >
          Server Boost
        </div>
        <div
          className={`st-item ${
            setting === "subscriptions" ? "st-setting" : ""
          }`}
          onClick={() => setSettingWhat("subscriptions")}
        >
          Subscriptions
        </div>
        <div
          className={`st-item ${setting === "billing" ? "st-setting" : ""}`}
          onClick={() => setSettingWhat("billing")}
        >
          Billing
        </div>
        <Divider />
        <div className="st-item">
          <div className="st-logout">
            Log Out
            {/* <LogoutRoundedIcon className="" size={26} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
