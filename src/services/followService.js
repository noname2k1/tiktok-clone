import * as httpRequest from '~/utils/httpRequest';

const getFollowingUsers = async (page = 1, perPage = 5) => {
    try {
        const res = await httpRequest.get('me/followings', {
            params: {
                page,
                per_page: perPage,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

const follow = async (userID) => {
    try {
        const res = await httpRequest.post(`users/${userID}/follow`);
        return res.data;
    } catch (error) {
        return error;
    }
};

const unfollow = async (userID) => {
    try {
        const res = await httpRequest.post(`users/${userID}/unfollow`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export { getFollowingUsers, follow, unfollow };
