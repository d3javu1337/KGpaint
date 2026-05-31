import {FC} from "react";
import {ButtonComponent} from "./ButtonComponent";
import ImageService from "../service/ImageService";
import {observer} from "mobx-react-lite";

interface ImageComponentProps {
    name: string
    link: string | null
    linkId: string
    id: string
    visibility?: boolean
    onUpdate: () => void;
}

const ImageComponent: FC<ImageComponentProps> = ({name, link, linkId,  id, visibility, onUpdate}) => {

    return (
        <div className={"image"}>
            <div className={"image_name"}>
                name: {name}
            </div>
            <div className={"image_id"}>
                id: {id}
            </div>
            <div className={"image_visibility"}>
                {visibility != null ? "Private: " + visibility : null}
            </div>
            {link != null ? <div className={"image_link"}>
                link: <a href={link}>{link}</a>
            </div> : null}
            {link != null ? <ButtonComponent id={1} name={"change visibility"}
                                             onClick={() => ImageService.changeVisibility(linkId, !visibility).then(onUpdate)}/> : null}
            {link == null ? <ButtonComponent id={1} name={"create link"}
                                             onClick={() => ImageService.createLink(id).then(onUpdate)}/> : null}
        </div>
    )
}

export default observer(ImageComponent)