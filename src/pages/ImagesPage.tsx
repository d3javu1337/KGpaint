import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import ImageService from "../service/ImageService";
import {Image} from "../model/ApiModel";
import ImageComponent from "../component/ImageComponent";
import {gateway_api_url} from "../http/api";

const ImagesPage = () => {
    const [images, setImages] = useState<Array<Image>>([]);

    const fetch = () => ImageService
        .getImages()
        .then(res => {
            try {
                console.log(res.data);
                setImages(res.data.images);
            } catch (e) {
                console.error(e);
            }
        })

    useEffect(() => {fetch()}, [setImages]);

    return (
        <>
            {
                Array.isArray(images) && images.map((image) =>
                    <ImageComponent
                        key={image.id}
                        name={image.name}
                        linkId={image.link}
                        link={image.link != null ? `${gateway_api_url}/image/${image.link}` : null}
                        id={image.id}
                        visibility={image.isPrivate}
                        onUpdate={fetch} />
                )
            }
        </>
    )
}

export default observer(ImagesPage)