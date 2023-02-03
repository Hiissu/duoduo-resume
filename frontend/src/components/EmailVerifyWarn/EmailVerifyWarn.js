import React, { useState } from "react";
import { useSelector } from "react-redux";
import { EmailVerifyModal } from "../Verifications";

const EmailVerifyWarn = () => {
  const { meow } = useSelector((state) => state.user);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [isVerifyEmail, setIsVerifyEmail] = useState(
    isAuthenticated && !meow?.email_verified
  );

  return (
    <>
      {isVerifyEmail && (
        <EmailVerifyModal onClose={() => setIsVerifyEmail(false)} />
      )}
      {isAuthenticated && !meow?.email_verified && (
        <div className="nav-warn">
          <span>
            Please check your email and follow the instructions to verify your
            account.
          </span>
          <div className="mt-1">
            An email containing verification instructions was sent to
            {meow?.email}.
            <button
              className="btn btn-secondary ms-2"
              onClick={() => setIsVerifyEmail(true)}
            >
              Verify Email
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailVerifyWarn;
