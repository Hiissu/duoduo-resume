import React, { useState } from "react";
import {
  Account,
  Collections,
  Courses,
  Menu,
  PhraseTranslations,
  Profile,
  SentenceTranslations,
  WordTranslations,
} from ".";
import "./Settings.css";

const Settings = ({ setting }) => {
  const [settingWhat, setSettingWhat] = useState(setting);

  const settingSection = () => {
    switch (settingWhat) {
      case "account":
        return <Account setSettingWhat={setSettingWhat} />;
      case "profile":
        return <Profile />;
      case "courses":
        return <Courses />;

      case "collections":
        return <Collections />;
      case "word_translations":
        return <WordTranslations />;
      case "phrase_translations":
        return <PhraseTranslations />;
      case "sentence_translations":
        return <SentenceTranslations />;

      default:
        return <></>;
    }
  };

  return (
    <>
      <div className="st-container">
        <Menu setting={setting} setSettingWhat={setSettingWhat} />
        {settingSection()}
      </div>
    </>
  );
};

export default Settings;
