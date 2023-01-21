import { v4 as uuid } from 'uuid';
import { Home, Following, Profile, Login, Live } from '~/pages';
import { HeaderOnly } from '~/layouts';
import config from '~/config';
import Search from '~/pages/search';
import Upload from '~/pages/upload';
import VideoDiscover from '~/pages/videoDiscover/VideoDiscover';
//Public routes
const publicRoutes = [
    { id: uuid(), path: config.routes.following, component: Following },
    { id: uuid(), path: config.routes.live, component: Live },
    {
        id: uuid(),
        path: config.routes.profile,
        component: Profile,
    },
    {
        id: uuid(),
        path: config.routes.login,
        component: Login,
        layout: null,
    },
    {
        id: uuid(),
        path: config.routes.upload,
        component: Upload,
        layout: null,
    },
    {
        id: uuid(),
        path: config.routes.search,
        component: Search,
        layout: HeaderOnly,
    },
    { id: uuid(), path: config.routes.home, component: Home },
    { id: uuid(), path: config.routes.tag, component: Home },
    {
        id: uuid(),
        path: config.routes.video,
        component: VideoDiscover,
        layout: null,
    },
];
//Private routes
const privateRoutes = [];

export { publicRoutes, privateRoutes };
