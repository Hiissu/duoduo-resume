import React, { useEffect, useState } from "react";
import { BsX } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { EditAvatar } from "./components";

// import { useDebounce } from "../../hooks";
// import { DarkTooltip } from "../../components/Tooltip";
// import { BsPatchExclamationFill, BsX } from "react-icons/bs";

const Profile = () => {
  const dispatch = useDispatch();
  const { meow } = useSelector((state) => state.user);

  const [avatar, setAvatar] = useState(meow.avatar);
  const [image, setImage] = useState(undefined);
  const [imageBase64, setImageBase64] = useState(null);
  const [editAvatar, setEditAvatar] = useState(false);

  const onChangeAvatar = (e) => {
    // setAvatar(e.target.value);

    if (e.target.files.length < 1) return;

    const file = e.target.files?.[0];
    const validExtensions = [
      "jpg",
      "jpeg",
      "jfif",
      "pjpeg",
      "pjp",
      "png",
      "webp",
      "bmp",
      "tiff",
      "heif",
      // "gif",
    ];
    const fileExtension = file.type.split("/")[1];

    if (validExtensions.includes(fileExtension)) {
      setImage(file);
      setEditAvatar(true);
    } else {
      // "Oops, something went wrong... Unable to process image"
      // File couldn't be uploaded
      // This file is not supported
      // node-sass.yml could not be uploaded.
    }
  };

  const [isChanged, setIsChanged] = useState(false);
  useEffect(() => {
    if (imageBase64 !== null) setIsChanged(true);
  }, [imageBase64]);

  // const [isAvatarValid, setIsAvatarValid] = useState(false);
  // const debouncedValue = useDebounce(avatar, 500);
  // useEffect(() => {
  //   fetch(debouncedValue)
  //     .then((res) => {
  //       setIsAvatarValid(res.status === 200);
  //     })
  //     .catch((err) => {
  //       // setDefaultImage(true);
  //     });
  // }, [debouncedValue]);

  const [bio, setBio] = useState(meow.bio);
  const onChangeBio = (e) => {
    setBio(e.target.value);
  };

  const [fullname, setFullname] = useState(meow.name);
  const onChangeFullname = (e) => {
    setFullname(e.target.value);
  };

  return (
    <>
      {editAvatar && (
        <EditAvatar
          image={image}
          setImageBase64={setImageBase64}
          onClose={() => setEditAvatar(false)}
        />
      )}
      <div className="st-account-section">
        <div className="st-account-wrapper">
          <div className="st-account">
            <h1 className="mb-3">My Profile</h1>
            <div className="d-flex flex-row">
              <img
                className="st-avatar"
                src={meow.avatar}
                alt={meow.username}
              />
              <h5>{meow.username}</h5>
            </div>
            <div className="mt-3">
              <label className="label-cap" htmlFor="avatar">
                Avatar
              </label>
              <button className="btn btn-secondary ms-3">
                Change Avatar
                <input
                  type="file"
                  name="avatar"
                  className="d-none"
                  accept="image/*"
                  onChange={onChangeAvatar}
                />
              </button>
              {/* <div className="d-flex flex-row">
                <input
                  id="avatar"
                  name="avatar"
                  className="dark-input"
                  type="text"
                  value={avatar}
                  maxLength="2020"
                  onChange={(e) => onChangeAvatar(e)}
                />
                {!isAvatarValid && (
                  <DarkTooltip
                    title="Cannot reach to this url"
                    placement="top"
                    arrow
                  ><IconButton>
                    <BsPatchExclamationFill size={16} className="warning" />
                  </IconButton></DarkTooltip>
                )}
              </div> */}
            </div>
            <div className="">
              <label className="label-cap" htmlFor="fullname">
                Name
              </label>
              <div className="">
                <input
                  id="fullname"
                  name="fullname"
                  className="dark-input"
                  type="text"
                  value={fullname}
                  maxLength="220"
                  onChange={(e) => onChangeFullname(e)}
                />
                <div className="st-authentication text-muted mb-2">
                  Help people discover your account by using the name you're
                  known by: either your full name, nickname.
                </div>
              </div>
            </div>
            <div className="form-group position-relative">
              <label htmlFor="bio" className="label-cap mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                type="text"
                className="form-control dark-input st-bio"
                maxLength="220"
                autoComplete="off"
                value={bio}
                onChange={(e) => onChangeBio(e)}
              />
              <span className="num-length">{bio.length - 220}</span>
            </div>
          </div>
        </div>
        <div className="st-close">
          <div className="d-flex flex-column align-items-center">
            <div className="st-close-btn">
              <BsX size={18} />
            </div>
            <div className="st-esc">ESC</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
