import { createSlice } from '@reduxjs/toolkit';

const videoSlice = createSlice({
    name: 'video',
    initialState: {
        videos: [],
        currentVideo: {},
        totalPages: 0,
        videosOfUser: [],
    },
    reducers: {
        setVideos: (state, action) => {
            state.videos = action.payload;
        },
        setCurrentVideo: (state, action) => {
            state.currentVideo = action.payload;
        },
        setTotalPages: (state, action) => {
            state.totalPages = action.payload;
        },
        setVideosOfUser: (state, action) => {
            state.videosOfUser = action.payload;
        },
    },
});

const { actions, reducer } = videoSlice;
export const { setVideos, setCurrentVideo, setTotalPages, setVideosOfUser } = actions;
export default reducer;
