import {FC, useContext, useState} from "react";
import {Context} from "../index";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";


export const AuthComponent: FC = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoginPage, setIsLoginPage] = useState(true)
    const {store} = useContext(Context)
    const nav = useNavigate();

    return (
        <div className={"auth_form"}>
            {isLoginPage ? <div>Login</div> : null}
            {!isLoginPage ? <div>Registration</div> : null}
            <input
                onChange={(e) => setUsername(e.target.value)}
                value={username} type="text" placeholder="username" required />
            <input
                onChange={(e) => setPassword(e.target.value)}
                value={password} type="password" placeholder="********" required />
            {isLoginPage ? <button onClick={() => {
                store.login(username, password).then(() => nav('/'))
            }}>login</button> : null}
            {!isLoginPage ? <button onClick={() => {
                store.registration(username, password).then(() => nav('/'))
            }}>registration</button> : null}
            {isLoginPage ? <p onClick={() => setIsLoginPage(false)}>Switch to registration</p> : null}
            {!isLoginPage ? <p onClick={() => setIsLoginPage(true)}>Switch to login</p> : null}
        </div>
    )
}

export default observer(AuthComponent)