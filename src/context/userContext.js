import {createContext, useContext} from "react";
import {makeAutoObservable, observable} from "mobx";
import {AccountManagementApi, Configuration as CisConfiguration} from "beacon-central-identity-server";
import {SignInContext} from "./signInContext";

class Users {
	cisBasePath
	currentUsername
    currentPassword
	users

	constructor(cisBasePath,currentUsername,currentPassword) {
		makeAutoObservable(this,
			{},
			{autoBind:true});
		this.cisBasePath = cisBasePath;
		this.currentUsername = currentUsername;
        this.currentPassword = currentPassword;
		this.users = observable.map();
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
	 * Update the users object to contain all users in all towers this user is a mamber of. Dispatch this flow when the
	 * app starts and when the user joins a new server
	 * TODO figure out how to make this trigger when a user joins
	 */
	* retrieveUserInfo(userId,callback) {
		if (!this.users.has(userId)) {
			try {
				const response = yield new AccountManagementApi(this.cisConfig).getAccount({userAccountId:userId});
				this.users.set(userId,response);
			}catch(error) {
				console.log(`retrieveUserInfo error: ${error}`);
            	throw error;
			}
		}
		if (callback) {
			callback();
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