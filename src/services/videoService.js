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
    }
};

const getVideo = async (videoID) => {
    try {
        const res = await httpRequest.get(`videos/${videoID}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export { getVideos, getVideo };
