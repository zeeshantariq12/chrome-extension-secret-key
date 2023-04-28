import React, { useState } from "react";
import { Button, Input, Label } from "reactstrap";

import { generateRandomString } from "../utils";
import ErrorMessage from "./ErrorMessage";
import { CheckCircle, Copy } from "react-feather";

const LoggedInSection = ({ user, handleExtensionReset }) => {
  const [state, setState] = useState({
    loggedIn: false,
    password: "",
    showError: "",
    secret: "",
    copied: false,
  });

  const onResetClick = () => {
    const newSecret = generateRandomString(20);
    setState({ ...state, copied: false });
    user.resetSecret(newSecret);
  };

  const onLogout = () => {
    setState({ ...state, loggedIn: false });
    user.logout();
  };

  const onCopyClick = async () => {
    await navigator.clipboard.writeText(user.secret);
    setState({ ...state, copied: true });
  };

  const onLoginClick = () => {
    if (state.secret === "" || state.password === "") return;

    setState({ ...state, showError: false });
    const result = user.verifyLogin(state.secret, state.password);
    if (!result) {
      return setState({ ...state, showError: true, loggedIn: false });
    }
    setState({
      ...state,
      loggedIn: true,
      password: "",
      secret: "",
      showError: false,
    });
  };

  const LoggedInUI = () => {
    return (
      <div>
        <div className="d-flex justify-content-between mt-3">
          <Button onClick={onResetClick} color="primary">
            Reset Secret
          </Button>
          <Button onClick={onLogout} color="danger">
            Log out
          </Button>
        </div>
        <div className="mt-5">
          Your secret key is
          <br /> {user.secret}
          {!state.copied ? (
            <Copy
              style={{ cursor: "pointer" }}
              className="ms-4"
              size={20}
              color="purple"
              onClick={onCopyClick}
            />
          ) : (
            <CheckCircle className="ms-4" size={20} color="purple" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      {state.loggedIn ? (
        <LoggedInUI />
      ) : (
        <div>
          <Label tag="h3" className="mt-2 mb-4">
            Log In
          </Label>

          <Label>Secret Key</Label>
          <Input
            value={state.secret}
            type="text"
            onChange={(e) => setState({ ...state, secret: e.target.value })}
          />
          <Label>Password</Label>
          <Input
            name="password"
            value={state.password}
            type="password"
            onChange={(e) => setState({ ...state, password: e.target.value })}
          />
          {!!state.showError && (
            <ErrorMessage
              touched={{ password: true }}
              name="password"
              errors={{ password: "Invalid key or password" }}
            />
          )}
          <Button className="mt-2" color="primary" onClick={onLoginClick}>
            Login
          </Button>

          <div className="my-2">OR</div>

          <div
            onClick={handleExtensionReset}
            style={{ cursor: "pointer" }}
            className="text-primary ms-3 "
          >
            Reset extension
          </div>
        </div>
      )}
    </div>
  );
};

export default LoggedInSection;
