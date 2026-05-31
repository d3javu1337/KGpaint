import {FC, useContext} from "react";
import {Context} from "../index";
import {NavLink, useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";

const Header: FC = () => {
    const {store} = useContext(Context)
    const nav = useNavigate()

    if (store.isAuth) {
        return (
            <div id={"header"}>
                <NavLink to="/">Paint</NavLink>
                <NavLink to={"/images"}>Images</NavLink>
                <button onClick={() => store.logout().then(() => nav('/'))}>Logout</button>
            </div>
        )
    }
    return (
        <div>
            <NavLink to="/">Paint</NavLink>
            <NavLink to={"/auth"}>Login/Registration</NavLink>
        </div>
    )
}

export default observer(Header);