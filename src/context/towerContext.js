import { createContext, useContext } from "react";
import { makeAutoObservable, observable } from "mobx";
import { ChannelsApi, Configuration as CityConfiguration, InvitesApi, TowersApi, UsersApi } from "beacon-city";
import { ObservableTower } from "../observables/ObservableTower";
import { SignInContext } from "./signInContext";
import {
    CityManagementApi,
    Configuration as CisConfiguration,
    InvitesApi as CisInvitesApi
} from "beacon-central-identity-server";

class Towers {
    cisBasePath
    signedIn
    currentUsername
    currentPassword
    invalidateSession
    // observable.map (https://mobx.js.org/api.html#observablemap) uses the ES6 Map API (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
    towers = observable.map()
    /**
     * A map from city IDs to URLs
     */
    cityUrlsById = observable.map()

    constructor(cisBasePath, signedIn, currentUsername, currentPassword, invalidateSession) {
        makeAutoObservable(this,
            {},
            // https://mobx.js.org/actions.html#actionbound to allow for "this" in actions
            { autoBind: true }
        );
        this.cisBasePath = cisBasePath;
        this.signedIn = signedIn;
        this.currentUsername = currentUsername;
        this.currentPassword = currentPassword;
        this.invalidateSession = invalidateSession;
    }

    get invalidateWhenUnauthorizedMiddleware() {
        /*
        To specify middleware to the OpenAPI-Generator client, we need to provide a class that implements either a post or pre method.
        See here for what that class would look like: https://github.com/OpenAPITools/openapi-generator/issues/2594#issuecomment-808808097
        Although we're declaring an object and not a class, the "this" reference will point to the object itself as a class is sorta created here.
        However, we want it to point to the Towers class reference. To do this, we sneak the reference into the object we're making.
         */
        const towersRef = this;
        return {
            post(responseContext) {
                console.log(`called invalidateWhenUnauthorizedMiddleware`);
                if (responseContext.response.status === 401) {
                    towersRef.invalidateSession();
                }
                return Promise.resolve(responseContext.response);
            }
        }
    }

    /**
     * Get the Configuration object usable with a CIS API client.
     */
    get cisConfig() {
        return new CisConfiguration({
            basePath: this.cisBasePath,
            middleware: [this.invalidateWhenUnauthorizedMiddleware],
            username: this.currentUsername,
            password: this.currentPassword,
        });
    }

    /**
     * Get the Configuration object usable with a City API client. The tower ID must be provided so that the URL of
     * the city that owns that Tower may be discovered, cached, and specified in the returned Configuration object.
     *
     * Hopefully there won't be any conflicts where the same tower ID exists on two Cities the user is a member of.
     * It's possible but that's a problem to solve later. This gets the job done for now.
     */
    cityConfig(towerId) {
        const cityId = this.towers.get(towerId).cityId;
        const cityUrl = this.cityUrlsById.get(cityId);
        return this.cityConfigKnownUrl(cityUrl);
    }

    /**
     * Get the Configuration object usable with a City API client when the base URL of the city is already known.
     */
    cityConfigKnownUrl(cityUrl) {
        return new CityConfiguration({
            basePath: cityUrl,
            middleware: [this.invalidateWhenUnauthorizedMiddleware],
            username: this.currentUsername,
            password: this.currentPassword,
        });
    }

    /**
     * Get the default URL towers should be created on
     */
    defaultCityUrl() {
        return 'https://beacon-city-main-staging.herokuapp.com';
    }

    /**
     * Update the towers object to contain only the towers this user is a member of. Dispatch this flow when the app
     * starts and any other applicable time (such as after attempting to join, leave, or create a server)
     */
    * updateTowers() {
        //TODO: Add try/catch like what ObservableTower.refreshChannels() has
        const cityManagementApi = new CityManagementApi(this.cisConfig);
        const memberCities = yield cityManagementApi.listCitiesMemberOf();
        // Flush the cache of City URLs and IDs
        this.cityUrlsById.clear();
        // Update our cache of City URLs and IDs
        memberCities.forEach(city => {
            this.cityUrlsById.set(city.id, city.basePath);
        });

        for (const city of memberCities) {
            const usersApi = new UsersApi(this.cityConfigKnownUrl(city.basePath));
            const towersFromThisCity = yield usersApi.getUserTowerMemberships();
            for (const memberTower of towersFromThisCity) {
                // If this tower is not present in our Map, we should add it!
                if (!this.towers.has(memberTower.id)) {
                    this.towers.set(memberTower.id, new ObservableTower(this.cityConfig, memberTower.id, city.id, memberTower.name, memberTower.adminAccountId, memberTower.moderatorAccountIds, memberTower.memberAccountIds, memberTower.primaryColor, memberTower.secondaryColor, memberTower.iconUrl, memberTower.bannerUrl));
                }
            }
        }
        // TODO: This only checks for any Towers we DON'T know about yet. We should probably also make sure that any
        //  Towers that are present in this.towers but not present in this response get deleted from this.towers.
        //  We could use a method similar to how ObservableTower.refreshChannels() manages deleting old entities.
    }

    /**
     * Generate and return an invite code for a tower
     * @param towerId the identifier for the tower to generate a code for
     */
    * generateInviteCode(towerId, expiryTime, expiryTimeUnit, maxUses) {
        return yield new InvitesApi(this.cityConfig(towerId)).createInvite({
            towerId: towerId,
            expiryTime: expiryTime,
            expiryTimeUnit: expiryTimeUnit,
            maxUses: maxUses // 0 = infinite uses
        }).catch(reason => {
            console.log("Error generating new join code");
            if (reason instanceof Response) {
                reason.json().then(value => {
                    console.log(value);
                });
            }
        });
    }

    /**
     * Join a new tower based on the user id
     * This will not update the tower list
     */
    * joinTower(code) {
        const context = this;
        yield new CisInvitesApi(this.cisConfig).getInviteInfo({
            towerInviteCode: code
        }).then((invite) => {
            // Retrieve the city base path
            new CityManagementApi(this.cisConfig).getCity({
                cityId: invite.cityId
            }).then(city => {
                // Finally, do the invite
                new InvitesApi({
                    // due to how invites work we need to make this manually
                    basePath: city.basePath,
                    middleware: [context.invalidateWhenUnauthorizedMiddleware],
                    username: context.currentUsername,
                    password: context.currentPassword,
                }).joinUsingInvite({ towerInviteCode: code }).then(() => {
                    console.log("Joined new tower!");
                    context.updateTowers();
                }).catch(reason => {
                    console.log("Error joining tower");
                    if (reason instanceof Response) {
                        reason.json().then(value => {
                            console.log(value);
                        });
                    }
                });
            // Something went wrong getting city info
            }).catch(reason => {
                console.log("Error getting city info for invite");
                if (reason instanceof Response) {
                    reason.json().then(value => {
                        console.log(value);
                    });
                }
            });
        // Something went wrong getting invite info
        }).catch(reason => {
            console.log("Error getting invite info from CIS");
            console.log(reason);
            if (reason instanceof Response) {
                reason.json().then(value => {
                    console.log(value);
                });
            }
        });
    }

    /**
     * Create a new tower on a given city
     */
    * createTower(name, cityUrl) {
        yield new TowersApi(this.cityConfigKnownUrl(cityUrl)).createTower({
            tower: {
                name: name
            }
        }).catch(reason => {
            console.log("Error creating new tower");
            console.log(reason);
            if (reason instanceof Response) {
                reason.json().then(value => {
                    console.log(value);
                });
            }
        });
    }

    /**
     * Create a new channel given a name
     */
    * createChannel(towerId, newChannelName) {
        yield new ChannelsApi(this.cityConfig(towerId)).createChannel({
            towerId: towerId,
            channel: {name: newChannelName}
        }).catch(reason => {
            console.log("Error creating new channel");
            console.log(reason);
            if (reason instanceof Response) {
                reason.json().then(value => {
                    console.log(value);
                });
            }
        });
    }

    *updateTowerAppearance(towerId, name, primaryColor, secondaryColor, icon, banner) {

        const existingTower = this.towers.get(towerId);

        yield new TowersApi(this.cityConfig(towerId)).editTower({
            towerId: towerId,
            tower: {
                name: name,
                primaryColor: primaryColor,
                secondaryColor:secondaryColor,
                adminAccountId: existingTower.adminAccountId
            },
            icon: icon,
            banner: banner
        }).catch(reason => {
            console.log("Error updating tower appearance");
            console.log(reason);
            if (reason instanceof Response) {
                reason.json().then(value => {
                    console.log(value);
                });
            }
        });
    }
}

export const TowerContext = createContext(new Towers());

export function TowerContextProvider({ children }) {
    const { cisBasePath, signedIn, accountUsername, accountPassword, invalidateSession } = useContext(SignInContext);
    return (
        <TowerContext.Provider
            value={new Towers(cisBasePath, signedIn, accountUsername, accountPassword, invalidateSession)}>
            {children}
        </TowerContext.Provider>
    );
}