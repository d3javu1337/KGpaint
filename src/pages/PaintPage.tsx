import {observer} from "mobx-react-lite";
import {ILogic, instance} from "../logic/Logic";
import React, {useCallback, useRef} from "react";
import MenuComponent from "../component/MenuComponent";
import CanvasComponent from "../component/CanvasComponent";

const PaintPage = () => {
    let log: ILogic;

    const ref = useRef<ILogic>(null);

    const handleReady = useCallback ((canvas: HTMLCanvasElement)=> {
        log = instance(canvas);
        ref.current = log;
    }, []);

    return (
        <>
            <MenuComponent logic={ref} />
            <CanvasComponent onReady={handleReady} logic = {ref}/>
        </>
    )
}

export default observer(PaintPage)