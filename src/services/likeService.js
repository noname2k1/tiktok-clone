import * as httpRequest from '~/utils/httpRequest';

const likePost = async (videoID) => {
    try {
        const res = await httpRequest.post(`videos/${videoID}/like`);
        return res.data;
    } catch (error) {
        return error;
    }
};

const unlikePost = async (videoID) => {
    try {
        const res = await httpRequest.post(`videos/${videoID}/unlike`);
        return res.data;
    } catch (error) {
        return error;
    }
};

const likeComment = async (commentID) => {
    try {
        const res = await httpRequest.post(`comments/${commentID}/like`);
        return res.data;
    } catch (error) {
        return error;
    }
};

const unlikeComment = async (commentID) => {
    try {
        const res = await httpRequest.post(`comments/${commentID}/unlike`);
        return res.data;
    } catch (error) {
        return error;
    }
};

export { likePost, unlikePost, likeComment, unlikeComment };
