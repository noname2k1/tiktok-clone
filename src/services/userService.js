import * as httpRequest from '~/utils/httpRequest';

const getSuggestedUsers = async (page = 1, perPage = 5) => {
    try {
        const res = await httpRequest.get('users/suggested', {
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

const getFollowingUsers = async (page = 1, perPage = 5) => {
    try {
        const res = await httpRequest.get('users/me', {
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

const getAnUser = async (nickname) => {
    try {
        const res = await httpRequest.get(`users/${nickname}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export { getSuggestedUsers, getFollowingUsers, getAnUser };
