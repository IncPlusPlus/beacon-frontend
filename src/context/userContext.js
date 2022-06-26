import {createContext, useContext} from "react";
import {makeAutoObservable, observable} from "mobx";
import {AccountManagementApi, Configuration as CisConfiguration} from "beacon-central-identity-server";
import {SignInContext} from "./signInContext";

class Users {
    cisBasePath
    currentUsername
    currentPassword
    users
    queuedUserInfoFetchRequests

    constructor(cisBasePath, currentUsername, currentPassword) {
        makeAutoObservable(this,
            {},
            {autoBind: true});
        this.cisBasePath = cisBasePath;
        this.currentUsername = currentUsername;
        this.currentPassword = currentPassword;
        this.users = observable.map();
        this.queuedUserInfoFetchRequests = observable.set();
    }

    /**
     * Get the Configuration object usable with a CIS API client.
     */
    get cisConfig() {
        return new CisConfiguration({
            basePath: this.cisBasePath,
            username: this.currentUsername,
            password: this.currentPassword,
        });
    }

    /**
     * Fetches information about the provided user ID and adds it to the internal store of this class.
     * This flow will not send duplicate requests to the server. If the same ID is provided multiple times in rapid
     * succession, only one request will ever be sent. This flow does not have any return value.
     * @param userId the ID of a user
     */
    * fetchUserInfo(userId) {
        // If we don't already have info about this user...
        if (!this.users.has(userId)) {
            // and we aren't already looking for information about them...
            if (!this.queuedUserInfoFetchRequests.has(userId)) {
                // Make note that we're looking this user up and proceed to do so
                this.queuedUserInfoFetchRequests.add(userId);
                try {
                    const response = yield new AccountManagementApi(this.cisConfig).getAccount({userAccountId: userId});
                    this.users.set(userId, response);
                } catch (error) {
                    console.log(`retrieveUserInfo error: ${error}`);
                    throw error;
                } finally {
                    // Make note that we are no longer looking up info for this user
                    this.queuedUserInfoFetchRequests.delete(userId);
                }
            }
        }
    }

    /**
     * Retrieves the name of a user by their ID. This action will return the name of the user if it is currently known.
     * If the name is not known, the action will dispatch a flow to retrieve the info about that user. This action
     * will then return the name of the user on the next render where the info is known. During the time the info is
     * not known, the ID will be returned.
     * @param userId the ID of a user
     */
    getUsername(userId) {
        if (!this.users.has(userId)) {
            this.fetchUserInfo(userId);
            return userId;
        } else {
            return this.users.get(userId).username;
        }
    }

    /**
     * Retrieves the profile picture url of a user by their ID. It follows the same logic as getUsername
     * @param userId the ID of a user
     */
    getAvatarUrl(userId) {
        if (!this.users.has(userId)) {
            this.fetchUserInfo(userId);
            return null;
        } else {
            return this.users.get(userId).profilePictureUrl;
        }
    }
}

export const UserContext = createContext(new Users());

export function UserContextProvider({children}) {
    const {cisBasePath, accountUsername, accountPassword} = useContext(SignInContext);
    return (
        <UserContext.Provider
            value={new Users(cisBasePath, accountUsername, accountPassword)}>
            {children}
        </UserContext.Provider>
    )
}