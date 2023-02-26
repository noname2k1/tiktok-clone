const routes = {
    home: '/',
    profile: '@:nickname',
    login: '/login',
    logout: '/logout',
    register: '/register',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    changePassword: '/change-password',
    feedback: '/feedback',
    following: '/following',
    live: '/live',
    liveStream: '@:nickname/live',
    search: '/search',
    upload: '/upload',
    tag: 'tag/:tag',
    video: '@:nickname/video/:videoId',
    messages: '/messages',
};

export default routes;
