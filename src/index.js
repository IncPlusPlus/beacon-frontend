import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import {AppRoutes} from './AppRoutes';
import {TowerContextProvider} from "./context/towerContext";
import {SignInContextProvider} from "./context/signInContext";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <SignInContextProvider>
                <TowerContextProvider>
                    <AppRoutes/>
                </TowerContextProvider>
            </SignInContextProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
