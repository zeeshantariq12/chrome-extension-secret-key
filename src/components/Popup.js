import React, { useContext, useState, useEffect } from "react";

import { UserContext } from "../class/User";
import InitialSection from "./InitialSecret";
import LoggedInSection from "./LoggedInSection";

const Popup = () => {
  const [showLogin, setShowLogin] = useState(false);
  const user = useContext(UserContext);

  const handleInitialize = ({ password }, SK) => {
    user.setSecret(SK, password);
    setShowLogin(true);
  };

  const checkInitialize = () => {
    const secretKey = localStorage.getItem(process.env.REACT_APP_LOCAL_SECRET);
    const password = localStorage.getItem(
      process.env.REACT_APP_ENCRYPTED_PASSWORD
    );

    if (secretKey && password) return setShowLogin(true);
    return setShowLogin(false);
  };

  useEffect(() => {
    checkInitialize();
  }, []);

  return (
    <div>
      {!showLogin ? (
        <InitialSection onAccountCreate={handleInitialize} />
      ) : (
        <LoggedInSection
          user={user}
          handleExtensionReset={() => {
            setShowLogin(false);
            localStorage.clear();
          }}
        />
      )}
    </div>
  );
};

export default Popup;
