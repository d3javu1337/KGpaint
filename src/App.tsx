import React, {FC, useCallback, useRef} from 'react';
import './App.css';
import MenuComponent from "./component/MenuComponent";
import CanvasComponent from "./component/CanvasComponent";
import {ILogic, instance} from "./logic/Logic";

const App: FC = () =>  {
    let log: ILogic;

    const ref = useRef<ILogic>(null);

    const handleReady = useCallback ((canvas: HTMLCanvasElement)=> {
        log = instance(canvas);
        ref.current = log;
    }, []);

    return (
        <div className="App">
            <MenuComponent logic={ref} />
            <CanvasComponent onReady={handleReady} logic = {ref}/>
        </div>
    )
}

export default App;
