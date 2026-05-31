import {FC} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import {routes} from "../routes/Routes";

const AppRouter: FC = () => {
    return (
        <Routes>
            { routes.map(({path, component}) =>
                <Route key={path} path={path} Component={component}/>
            )}
            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    )
}

export default AppRouter;