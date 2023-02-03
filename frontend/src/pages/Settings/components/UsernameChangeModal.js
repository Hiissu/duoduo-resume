import React, { useEffect, useState } from "react";
import "./UsernameChangeModal.css";
import { useSelector, useDispatch } from "react-redux";
import { BsDash, BsX } from "react-icons/bs";
import { Modal } from "../../../components/Modal";
import { useDebounce } from "../../../hooks";
import { usernameRegex } from "../../../configs/constants";
import { changeUsername, existUsername } from "../../../store/actions/user";

const UsernameChangeModal = ({ onClose, existUsername, changeUsername }) => {
  const dispatch = useDispatch();
  const { meow } = useSelector((state) => state.user);

  const [username, setUsername] = useState(meow.username);
  const [isValid, setIsValid] = useState(true);

  const [isExist, setIsExist] = useState(false);
  const [isFail, setIsFail] = useState(false);

  const onChangeUsername = (e) => {
    const value = e.target.value;
    setUsername(value);
    setIsValid(usernameRegex.test(value) && value.length > 2);
  };

  const [password, setPassword] = useState("");
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const debouncedValue = useDebounce(username, 500);
  useEffect(() => {
    (async () => {
      const response = await existUsername(debouncedValue);
      if (response.isuccess) setIsExist(response.is_exist);
      else alert(response.message);
    })();
  }, [debouncedValue, existUsername]);

  const onDone = () => {
    (async () => {
      const response = await changeUsername(username, password);
      if (response.isuccess) onclose();
      else setIsFail(true);
    })();
  };

  const isCanDone = isValid && !isExist;

  return (
    <>
      <Modal isBlackBackDrop={false} onClose={onClose}>
        <div className="ucm">
          <div className="ucm-container">
            <div className="ucm-header">
              <div className="ucm-closer pointer" onClick={() => onClose()}>
                <BsX size={"32px"} />
              </div>
              <h4 className="ucm-header-title mb-2">Change username</h4>
              <span className="text-mute">
                Enter a new username and your existing password.
              </span>
            </div>
            <div className="ucm-content">
              <div>
                <label
                  className={`label-cap ${isValid ? "" : "text-danger"}`}
                  htmlFor="username"
                >
                  Username
                  {isExist && (
                    <>
                      <BsDash className="ms-2 me-2" />
                      <i className="text-danger">Username already exists</i>
                    </>
                  )}
                </label>
                <input
                  id="username"
                  name="username"
                  className="dark-input"
                  type="text"
                  value={username}
                  onChange={(e) => onChangeUsername(e)}
                />
              </div>
              <div className="mt-3">
                <label className="label-cap" htmlFor="password">
                  Current Password
                  {isFail && (
                    <>
                      <BsDash className="ms-2 me-2" />
                      <i className="text-danger">Password does not match</i>
                    </>
                  )}
                </label>
                <input
                  id="password"
                  name="password"
                  className="dark-input"
                  type="password"
                  value={password}
                  onChange={(e) => onChangePassword(e)}
                />
              </div>
            </div>
          </div>
          <div className="ucm-footer">
            <div className="btn me-3" onClick={() => onClose()}>
              Cancel
            </div>
            <button
              className="btn btn-secondary"
              disabled={!isCanDone}
              onClick={() => onDone()}
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UsernameChangeModal;
