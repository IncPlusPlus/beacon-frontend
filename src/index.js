import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import {AppRoutes} from './AppRoutes';
import {TowerContextProvider} from "./context/towerContext";
import {SignInContextProvider} from "./context/signInContext";
import {UserContextProvider} from './context/userContext';
import Modal from 'react-modal';

// Import all stylesheets
import './styles/index.css';
import './styles/signin.css';
import './styles/towerList.css';
import './styles/towerDetails.css';
import './styles/messaging.css';
import './styles/userInfo.css';
import './styles/modal.css';
import './styles/memberlist.css';

Modal.setAppElement('#root');

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <SignInContextProvider>
                <UserContextProvider>
                    <TowerContextProvider>
                        <AppRoutes/>
                    </TowerContextProvider>
                </UserContextProvider>
            </SignInContextProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
