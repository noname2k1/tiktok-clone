import { createSlice } from '@reduxjs/toolkit';

const videoSlice = createSlice({
    name: 'video',
    initialState: {
        videos: [],
        totalPages: 0,
    },
    reducers: {
        setVideos: (state, action) => {
            state.videos = action.payload;
        },
        setTotalPages: (state, action) => {
            state.totalPages = action.payload;
        },
    },
});

const { actions, reducer } = videoSlice;
export const { setVideos, setTotalPages } = actions;
export default reducer;
