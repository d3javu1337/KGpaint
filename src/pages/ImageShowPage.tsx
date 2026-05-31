import {observer} from "mobx-react-lite";
import {ILogic, instance} from "../logic/Logic";
import React, {FC, useCallback, useRef} from "react";
import MenuComponent from "../component/MenuComponent";
import CanvasComponent from "../component/CanvasComponent";
import ImageService from "../service/ImageService";
import {useLocation} from "react-router-dom";

const ImageShowPage: FC = () => {

    const path = useLocation();
    const from = path.pathname;
    const splittedPath = from?.split('/');
    const link = String(splittedPath[splittedPath.length - 1])
    let log: ILogic;
    console.log(link)
    console.log(from)
    console.log(splittedPath)

    const ref = useRef<ILogic>(null);

    const handleReady = useCallback ((canvas: HTMLCanvasElement)=> {
        log = instance(canvas);
        ref.current = log;
        const image = ImageService.getImage(link);
        image.then(img => {
            console.log(img);
            log.loadBlob(img.data)
        })
    }, []);

    return (
        <>
            <MenuComponent logic={ref} />
            <CanvasComponent onReady={handleReady} logic = {ref}/>
        </>
    )
}

export default observer(ImageShowPage);