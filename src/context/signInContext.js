import {createContext, useState} from "react";
import {DefaultConfig} from "../util/CISApiHelper";
import {BASE_PATH, CityManagementApi, Configuration} from "beacon-central-identity-server";
import {useLocalStorage} from "react-use";

const basePath = (DefaultConfig.basePath ?? BASE_PATH);

export const SignInContext = createContext({
    signedIn: false,
    attemptSignIn: (username, password) => console.log('WARNING: Attempted to sign in but hit a no-op function. This means that the SignInContext was never set up properly!!!'),
});

export function SignInContextProvider({children}) {
    const [signedIn, setSignedIn] = useLocalStorage('signedIn', false);
    const [signInInProgress, setSignInInProgress] = useState(false);
    const attemptSignIn = (username, password) => signInWithCredentials(username, password, signInInProgress, setSignInInProgress, setSignedIn);

    return (
        <SignInContext.Provider value={{
            signedIn: signedIn,
            attemptSignIn: attemptSignIn,
            // setCredentials: setCredentials,
            signInInProgress: signInInProgress,
        }}>
            {children}
        </SignInContext.Provider>
    );
}

function signInWithCredentials(username, password, signInInProgress, setSignInInProgress, setSignedIn) {
    console.log('Attempting to sign in');
    if (signInInProgress) {
        console.log('Attempted to sign in while there was already another attempt in progress. This attempt has been cancelled.');
        setSignInInProgress(true);
    }
    let configuration = new Configuration({
        basePath: basePath,
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
    }).catch(reason => {
        setSignedIn(false);
        setSignInInProgress(false);
        if (reason instanceof Response) {
            reason.json().then(value => console.log(value));
        }
        console.log('Sign in failed.');
    });
}