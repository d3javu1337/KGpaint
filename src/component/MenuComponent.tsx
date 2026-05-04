import {FC, RefObject} from "react";
import {ILogic} from "../logic/Logic";
import {ButtonComponent} from "./ButtonComponent";
import {DrawMode} from "../model/Model";

interface MenuComponentProps {
    logic: RefObject<ILogic | null>;
}

const MenuComponent: FC<MenuComponentProps> = ({logic}) => {
    return (
        <div id="menu">
            <ButtonComponent id={1} name={"Dot"} onClick={() => logic.current?.setDrawMode(DrawMode.Dot)}/>
            <ButtonComponent id={2} name={"Line"} onClick={() => logic.current?.setDrawMode(DrawMode.Line)}/>
            <ButtonComponent id={3} name={"Circle"} onClick={() => logic.current?.setDrawMode(DrawMode.Circle)}/>
            <ButtonComponent id={4} name={"Rectangle"} onClick={() => logic.current?.setDrawMode(DrawMode.Rectangle)}/>
            <ButtonComponent id={5} name={"Polygon"} onClick={() => logic.current?.setDrawMode(DrawMode.Polygon)}/>
            <ButtonComponent id={6} name={"Fill"} onClick={() => logic.current?.setDrawMode(DrawMode.Fill)}/>
            <ButtonComponent id={7} name={"Text"} onClick={() => logic.current?.setDrawMode(DrawMode.Text)}/>
            <div id={"color_picker_wrapper"} className={"menu-button"}>
                <label>color picker</label>
                <input type={"color"} id={"color_picker"}
                       onChange={(e) => logic.current?.setColor(e.target.value)}/>
            </div>
            <div id={"thickness_picker_wrapper"} className={"menu-button"}>
                <label>thickness picker</label>
                <input type={"number"} min={1} defaultValue={1} id={"thickness_picker"}
                       onChange={(e) => logic.current?.setThickness(Number.parseInt(e.target.value))}/>
            </div>
            <ButtonComponent id={77} name={"Clear"} onClick={() => logic.current?.clear()}/>

            <ButtonComponent id={88} name={"Save"} onClick={() => logic.current?.save()}/>
            <div id={"image_loader"} className={"menu-button"} onClick={() => document.getElementById("fileinput")!.click()}>
                <label>load file</label>
                <input type="file" id={"fileinput"} accept="image/*" onChange={(e) => logic.current?.load(e)} hidden/>
            </div>
        </div>
    )
}

export default MenuComponent;