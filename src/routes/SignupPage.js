import React, {useContext, useEffect, useState} from "react";
import {SignInContext} from "../context/signInContext";
import {Navigate, useNavigate} from "react-router-dom";

export const SignupPage = (props, context) => {
    const {signedIn, signupState, attemptSignup} = useContext(SignInContext);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [signupError, setSignupError] = useState('');

    const navigate = useNavigate();

    const trySignup = (event) => {
        // Confirm matching passwords
        if (password !== passwordConfirm) {
            setSignupError("Error: Passwords do not match!");
            event.preventDefault();
            //return;
        }else{

            // TODO validate email
            attemptSignup(username,email,password);

            // Without this, the page reloads for some weird reason.
            // See https://reactjs.org/docs/forms.html#controlled-components
            event.preventDefault();
        }
    };

    useEffect(() => {
        if (signupState === 'success') {
            navigate('/login');
        }else if (signupState !== '') {
            setSignupError(signupState);
        }

    },[signupState.navigate]);

    return (
        <div id='loginPane'>
            <div id='loginField'>{!signedIn ? 
                <>
                    <h1>Welcome aboard!</h1>
                    <form onSubmit={trySignup}>
                        <input type="text" placeholder="Username" value={username} onChange={event => setUsername(event.target.value)}/>
                        <input type="text" placeholder="Email" value={email} onChange={event => setEmail(event.target.value)}/>
                        <input type="password" placeholder="Password" value={password} onChange={event => setPassword(event.target.value)}/>
                        <input type="password" placeholder="Confirm Password" value={passwordConfirm} onChange={event => setPasswordConfirm(event.target.value)}/>
                        <button type="submit">Submit</button>
                    </form>
                    {signupError !== '' ? <div className="error">{signupError}</div> : <></>}
                </> :
                <Navigate to='/login'/>
            }
            </div>
        </div>
    );
};