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

export { getFollowingUsers };
