import {AccountManagementApi, CityManagementApi, Configuration} from "beacon-central-identity-server";

// eslint-disable-next-line
const QA_URL = "https://beacon-cis-main-staging.herokuapp.com";
// eslint-disable-next-line
const PROD_URL = "https://beacon-cis-main-staging.herokuapp.com";
// eslint-disable-next-line
const LOCAL_URL = "http://localhost:9876";

// Is of type ConfigurationParameters
export const DefaultConfig = {
    basePath: LOCAL_URL,
};

export const AccountManagementHelper = new AccountManagementApi(new Configuration(DefaultConfig));
export const CityManagementHelper = new CityManagementApi(new Configuration(DefaultConfig));