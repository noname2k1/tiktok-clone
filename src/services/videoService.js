import * as httpRequest from '~/utils/httpRequest';

const FOR_YOU = 'for-you';

const getVideos = async (page = 1, type = FOR_YOU) => {
    try {
        const res = await httpRequest.get('videos', {
            params: {
                page,
                type,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
        // throw error;
    }
};

const getVideo = async (videoID) => {
    try {
        const res = await httpRequest.get(`videos/${videoID}`);
        return res.data;
    } catch (error) {
        console.log(error);
        // throw error;
    }
};

const getAllVideosOfUser = async (userID) => {
    try {
        const res = await httpRequest.get(`users/${userID}/videos`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getVideosUserLiked = async (userID) => {
    try {
        const res = await httpRequest.get(`users/${userID}/liked-videos`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const createVideo = async (data) => {
    try {
        const res = await httpRequest.post('videos', data);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const updateVideo = async (videoID, data) => {
    try {
        const res = await httpRequest.post(`videos/${videoID}?_method=PATCH`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const deleteVideo = async (videoID) => {
    try {
        const res = await httpRequest.del(`videos/${videoID}`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export {
    getVideos,
    getVideo,
    getAllVideosOfUser,
    getVideosUserLiked,
    createVideo,
    updateVideo,
    deleteVideo,
};
