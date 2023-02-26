import * as httpRequest from '~/utils/httpRequest';

const getComments = async (videoID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await httpRequest.get(`videos/${videoID}/comments`);
            resolve(res.data);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

const createComment = async (videoID, comment) => {
    try {
        const res = await httpRequest.post(`videos/${videoID}/comments`, {
            comment,
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

const editComment = async (commentID, newComment) => {
    try {
        const res = await httpRequest.patch(`comments/${commentID}`, {
            comment: newComment,
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

const deleteComment = async (commentID) => {
    try {
        await httpRequest.del(`comments/${commentID}`);
        return { status: 200, message: 'Delete comment successfully' };
    } catch (error) {
        console.log(error);
    }
};

export { getComments, createComment, editComment, deleteComment };
