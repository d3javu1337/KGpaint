import {observer} from "mobx-react-lite";
import {AuthComponent} from "../component/AuthComponent";

const AuthPage = () => {
    return (
        <>
            <AuthComponent/>
        </>
    )
}

export default observer(AuthPage)