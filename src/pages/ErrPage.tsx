import {FC} from "react";
import {observer} from "mobx-react-lite";
import {useSearchParams} from "react-router-dom";

const ErrPage: FC = () => {
    const [params] = useSearchParams()
    const message = params.get("message") || 'Unexpected error'
    const code = params.get("code") || '500'
    return (
        <div>
            <div>Error</div>
            <div>{code}</div>
            <div>{message}</div>
        </div>
    )
}

export default observer(ErrPage);