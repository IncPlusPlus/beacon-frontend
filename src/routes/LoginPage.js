import React, { useContext, useEffect, useState } from "react";
import { SignInContext } from "../context/signInContext";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import useCountDown from "react-countdown-hook";

export const LoginPage = (props, context) => {
  const initialTime = 5 * 1000; // initial time in milliseconds, defaults to 60000
  const interval = 1000; // interval to change remaining time amount, defaults to 1000
  const { signedIn, attemptSignIn } = useContext(SignInContext);
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const referringQueryParameters = searchParams.get("resumeSearch") ?? "";
  // If the user navigated to the login page themselves (along with some other edge cases), this the path could be null. Default to the base URL in that case.
  const referringPath = searchParams.get("resumePath") ?? "/";
  // A string that hold the original path the user was at before they were redirected to the login page.
  // The original query parameters are also preserved and are appended to the referring path if they exist.
  const redirectToAfterLoginSuccess =
    referringPath +
    (referringQueryParameters ? "?" + referringQueryParameters : "");
  const [readyToRedirect, setReadyToRedirect] = useState(false);
  const [timeLeft, { start }] = useCountDown(initialTime, interval);
  // The timeLeft value starts at 0 which makes testing for 0 in a useEffect useless .-.
  const [countdownInProgress, setCountdownInProgress] = useState(false);
  // Used if we press the 'sign up' button
  const navigate = useNavigate();

  const tryCredentials = (event) => {
    attemptSignIn(username, password);
    // Without this, the page reloads for some weird reason.
    // See https://reactjs.org/docs/forms.html#controlled-components
    event.preventDefault();
  };

  useEffect(() => {
    if (signedIn) {
      setCountdownInProgress(true);
      start();
    }
  }, [signedIn, start]);

  useEffect(() => {
    // The "you will be redirected" countdown has reached zero
    if (countdownInProgress && timeLeft === 0) {
      // Set a variable that'll cause the <Navigate> component to become visible.
      setReadyToRedirect(true);
    }
  }, [countdownInProgress, timeLeft]);

  return (
    <div id="loginPane">
      <div id="loginField">
        {signedIn ? (
          <div style={{ flexDirection: "column" }}>
            <div>You're already signed in!</div>
            <div>
              Redirecting back to "{redirectToAfterLoginSuccess}" in{" "}
              {timeLeft / 1000} seconds...
            </div>
            {readyToRedirect ? (
              // Same as <Redirect> in React Router v5
              <Navigate to={redirectToAfterLoginSuccess} />
            ) : (
              <></>
            )}
          </div>
        ) : (
          <>
            <h1>Sign in</h1>
            <form onSubmit={tryCredentials}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button type="submit">Submit</button>
            </form>

            <button onClick={() => navigate("/signup")}>
              Create an account
            </button>
          </>
        )}
      </div>
    </div>
  );
};
