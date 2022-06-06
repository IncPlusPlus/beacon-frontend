import {createContext, useState} from "react";
import {CIS_QA_URL} from "../util/CISApiHelper";
import {AccountManagementApi, Configuration} from "beacon-central-identity-server";
import {useLocalStorage} from "react-use";

export const SignInContext = createContext({
    /**
     * The base URL for the CIS server. When using the frontend, developers may adjust the CIS URL that the page points
     * to by modifying the local storage entry "cisBasePath" to a URL of their choosing.
     */
    cisBasePath: '',
    /**
     * True when the current credentials provided by the SignInContext are thought to be valid and safe to use
     */
    signedIn: false,
    attemptSignIn: (username, password) => console.log('WARNING: Attempted to sign in but hit a no-op function. This means that the SignInContext was never set up properly!!!'),

    signupState: '',
    attemptSignUp: (username, email, password) => console.log('WARNING: Attempted to sign up but hit a no-op function. This means that the SignInContext was never set up properly!!!'),
    /**
     * True when there's an active login attempt (meaning an API call).
     */
    signInInProgress: false,
    /**
     * The username to use whenever calling the API. This was set by the user when they "logged in"
     */
    accountUsername: '',
    /**
     * The password to use whenever calling the API. This was set by the user when they "logged in"
     */
    accountPassword: '',
    /**
     * The ID of the currently signed in user
     */
     accountId: '',
    /**
     * Call this function if you receive a 401 back from the API. The signedIn variable in the SignInContext will be set to false and the user will be kicked back to the login screen.
     */
    invalidateSession: () => console.log('WARNING: Attempted to invalidate session but hit a no-op function. This means that the SignInContext was never set up properly!!!'),
});

export function SignInContextProvider({children}) {
    const [signedIn, setSignedIn] = useLocalStorage('signedIn', false);
    const [signInInProgress, setSignInInProgress] = useState(false);
    const [signupState, setSignupState] = useState('');
    /*
    The current username and password are NOT to be confused with the credentials that are being used with a sign-in attempt.
    These variables refer to the last known valid username and password. The attemptSignIn function will set these itself
    should the attempt succeed with the credentials the function was provided. These valid credentials are then able
    to be used by any components that request the SignInContext.
     */
    const [currentUsername, setCurrentUsername] = useLocalStorage('currentUsername', '');
    const [currentPassword, setCurrentPassword] = useLocalStorage('currentPassword', '');
    const [currentUserId, setCurrentUserId] = useLocalStorage('currentUserId', '');
    const [cisBasePath] = useLocalStorage('cisBasePath', CIS_QA_URL);
    const attemptSignIn = (username, password) => signInWithCredentials(cisBasePath, username, password, signInInProgress, setSignInInProgress, setSignedIn, setCurrentUsername, setCurrentPassword, setCurrentUserId);
    const attemptSignup = (username, email, password) => signUpWithCredentials(cisBasePath, username, email, password, setSignupState);
    /**
     * To be used when we encounter a `401` which would indicate our credentials are invalid. Resetting all this info 
     * will effectively boot the user back to the login screen where they will have to sign in again.
     */
    const invalidateSession = () => {
        setSignedIn(false);
        setSignupState('');
        setCurrentUsername('');
        setCurrentPassword('');
    };

    return (
        <SignInContext.Provider value={{
            cisBasePath: cisBasePath,
            signedIn: signedIn,
            signupState: signupState,
            attemptSignIn: attemptSignIn,
            attemptSignup: attemptSignup,
            signInInProgress: signInInProgress,
            accountUsername: currentUsername,
            accountPassword: currentPassword,
            accountId: currentUserId,
            invalidateSession: invalidateSession,
        }}>
            {children}
        </SignInContext.Provider>
    );
}

function signUpWithCredentials(cisBasePath, username, email, password, setSignupState) {
    console.log('Attempting to create new account');

    const configuration = new Configuration({
        basePath: cisBasePath
    });

    new AccountManagementApi(configuration).createNewAccount({createAccountRequest:{
        emailAddress: email,
        username: username,
        password: password
    }}).catch(reason => {
        if (reason instanceof Response) {
            reason.json().then(value => {
                console.log(value)
                setSignupState(value);
            });
        }
        console.log('Sign up failed.');
    }).then(acct => {
        console.log(acct);
        setSignupState('success');
    });

}

function signInWithCredentials(cisBasePath, username, password, signInInProgress, setSignInInProgress, setSignedIn, setCurrentUsername, setCurrentPassword, setCurrentUserId) {
    console.log('Attempting to sign in');
    if (signInInProgress) {
        console.log('Attempted to sign in while there was already another attempt in progress. This attempt has been cancelled.');
        setSignInInProgress(true);
    }
    const configuration = new Configuration({
        basePath: cisBasePath,
        credentials: 'include',
        username: username,
        password: password,
    });


    new AccountManagementApi(configuration).getAccount({userAccountId:''}).then(res => {
        console.log('Sign in succeeded');
        setSignedIn(true);
        setSignInInProgress(false);
        // The credentials tried were valid, save them to the state tree
        setCurrentUsername(username);
        setCurrentPassword(password);
        setCurrentUserId(res.id);
    }).catch(reason => {
        setSignedIn(false);
        setSignInInProgress(false);
        if (reason instanceof Response) {
            reason.json().then(value => console.log(value));
        }
        console.log('Sign in failed.');
    });

    /*
     TODO: Listing the cities isn't necessarily what needs to happen here. All that needs to happen is an API request
      has to be sent with the correct credentials. An endpoint like /check-authentication will be added to both services
      in the near future. Upon sending ANY request to the API, authenticated or not, the server will give the browser
      a JSESSIONID cookie. This cookie will be sent to the server with every request. If the browser had sent a request
      with the correct credentials, then there is no need to continue to send credentials in subsequent requests as the
      server will know that this is the same, authenticated client by the JSESSIONID it was assigned.
    */
}