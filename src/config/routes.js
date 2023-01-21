const routes = {
    home: '/',
    profile: '@:nickname',
    login: 'login',
    register: 'register',
    forgotPassword: 'forgot-password',
    resetPassword: 'reset-password',
    changePassword: 'change-password',
    feedback: 'feedback',
    following: 'following',
    live: 'live',
    search: 'search',
    upload: 'upload',
    tag: 'tag/:tag',
    video: '@:nickname/video/:videoId',
};

export default routes;
