import { v4 as uuid } from 'uuid';
import { Home, Following, Profile, Login, Live, Logout } from '~/pages';
import { HeaderOnly, FullLayout } from '~/layouts';
import config from '~/config';
import Search from '~/pages/search';
import Upload from '~/pages/upload';
import VideoDiscover from '~/pages/videoDiscover/VideoDiscover';
import Inbox from '~/pages/Inbox';
import DiscoverLive from '~/components/DiscoverLive';
//Public routes
const publicRoutes = [
    { id: uuid(), path: config.routes.following, component: Following, layout: FullLayout },
    { id: uuid(), path: config.routes.live, component: Live, layout: FullLayout },
    {
        id: uuid(),
        path: config.routes.profile,
        component: Profile,
        layout: FullLayout,
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
    {
        id: uuid(),
        path: config.routes.login,
        component: Login,
        layout: null,
    },
    {
        id: uuid(),
        path: config.routes.logout,
        component: Logout,
        layout: null,
    },
    {
        id: uuid(),
        path: config.routes.liveStream,
        component: DiscoverLive,
        layout: FullLayout,
    },
    {
        id: uuid(),
        path: config.routes.messages,
        component: Inbox,
        layout: HeaderOnly,
    },
];
//Private routes
const privateRoutes = [];

export { publicRoutes, privateRoutes };
