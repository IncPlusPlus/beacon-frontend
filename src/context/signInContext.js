import {createContext, useState} from "react";
import {CIS_QA_URL} from "../util/CISApiHelper";
import {CityManagementApi, Configuration} from "beacon-central-identity-server";
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
     * Call this function if you receive a 401 back from the API. The signedIn variable in the SignInContext will be set to false and the user will be kicked back to the login screen.
     */
    invalidateSession: () => console.log('WARNING: Attempted to invalidate session but hit a no-op function. This means that the SignInContext was never set up properly!!!'),
});

export function SignInContextProvider({children}) {
    const [signedIn, setSignedIn] = useLocalStorage('signedIn', false);
    const [signInInProgress, setSignInInProgress] = useState(false);
    /*
    The current username and password are NOT to be confused with the credentials that are being used with a sign-in attempt.
    These variables refer to the last known valid username and password. The attemptSignIn function will set these itself
    should the attempt succeed with the credentials the function was provided. These valid credentials are then able
    to be used by any components that request the SignInContext.
     */
    const [currentUsername, setCurrentUsername] = useLocalStorage('currentUsername', '');
    const [currentPassword, setCurrentPassword] = useLocalStorage('currentPassword', '');
    const [cisBasePath] = useLocalStorage('cisBasePath', CIS_QA_URL);
    const attemptSignIn = (username, password) => signInWithCredentials(cisBasePath, username, password, signInInProgress, setSignInInProgress, setSignedIn, setCurrentUsername, setCurrentPassword);
    /**
     * To be used
     */
    const invalidateSession = () => {
        setSignedIn(false)
        setCurrentUsername('');
        setCurrentPassword('');
    };

    return (
        <SignInContext.Provider value={{
            cisBasePath: cisBasePath,
            signedIn: signedIn,
            attemptSignIn: attemptSignIn,
            signInInProgress: signInInProgress,
            accountUsername: currentUsername,
            accountPassword: currentPassword,
            invalidateSession: invalidateSession,
        }}>
            {children}
        </SignInContext.Provider>
    );
}

function signInWithCredentials(cisBasePath, username, password, signInInProgress, setSignInInProgress, setSignedIn, setCurrentUsername, setCurrentPassword) {
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
    /*
     TODO: Listing the cities isn't necessarily what needs to happen here. All that needs to happen is an API request
      has to be sent with the correct credentials. An endpoint like /check-authentication will be added to both services
      in the near future. Upon sending ANY request to the API, authenticated or not, the server will give the browser
      a JSESSIONID cookie. This cookie will be sent to the server with every request. If the browser had sent a request
      with the correct credentials, then there is no need to continue to send credentials in subsequent requests as the
      server will know that this is the same, authenticated client by the JSESSIONID it was assigned.
    */
    new CityManagementApi(configuration).listRegisteredCities().then(value => {
        console.log('Sign in succeeded');
        setSignedIn(true);
        setSignInInProgress(false);
        // The credentials tried were valid, save them to the state tree
        setCurrentUsername(username);
        setCurrentPassword(password);
    }).catch(reason => {
        setSignedIn(false);
        setSignInInProgress(false);
        if (reason instanceof Response) {
            reason.json().then(value => console.log(value));
        }
        console.log('Sign in failed.');
    });
}