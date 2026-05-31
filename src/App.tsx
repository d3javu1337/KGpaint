import React, {FC} from 'react';
import './App.css';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./component/AppRouter";
import Header from "./component/Header";

const App: FC = () =>  {
    return (
        <BrowserRouter>
            <Header />
            <AppRouter/>
        </BrowserRouter>
    )
}

export default App;
