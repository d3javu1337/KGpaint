import {auth_route, draw_route, err_route, images_route, view_route} from "./BaseRoutes";
import ImageShowPage from "../pages/ImageShowPage";
import PaintPage from "../pages/PaintPage";
import ImagesPage from "../pages/ImagesPage";
import AuthPage from "../pages/AuthPage";
import ErrPage from "../pages/ErrPage";

export const routes = [
    {
        path: draw_route,
        component: PaintPage
    },
    {
        path: view_route + '/:imageLink',
        component: ImageShowPage
    },
    {
        path: auth_route,
        component: AuthPage
    },
    {
        path: images_route,
        component: ImagesPage
    },
    {
        path: err_route,
        component: ErrPage
    },
]