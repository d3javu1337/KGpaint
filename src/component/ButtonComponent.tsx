import {FC} from "react";

interface ButtonComponentProps {
    id: number,
    name: string,
    onClick: Function
}

export const ButtonComponent: FC<ButtonComponentProps> = ({id, name, onClick}) => {
    return (
        <div id={"button"+id} className={"menu-button"} onClick={() => onClick()}>
            {name}
        </div>
    )
}