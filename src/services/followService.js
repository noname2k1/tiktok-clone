import * as httpRequest from '~/utils/httpRequest';

const getFollowingUsers = async (page = 1) => {
    try {
        const res = await httpRequest.get('me/followings', {
            params: {
                page,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const follow = async (userID) => {
    try {
        const res = await httpRequest.post(`users/${userID}/follow`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

const unfollow = async (userID) => {
    try {
        const res = await httpRequest.post(`users/${userID}/unfollow`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export { getFollowingUsers, follow, unfollow };
