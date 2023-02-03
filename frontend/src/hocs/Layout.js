import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { getMeow } from "../store/slices/userSlice";
import { EmailVerifyWarn } from "../components/EmailVerifyWarn";
import { onSpeechSynthesisVoices } from "../store/slices/settingSlice";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMeow());
    dispatch(onSpeechSynthesisVoices());
  }, [dispatch]);

  return isAuthenticated !== null ? (
    <>
      <Navbar />
      <EmailVerifyWarn />
      {children}
      <Footer />
    </>
  ) : (
    <></>
  );
};

export default Layout;
