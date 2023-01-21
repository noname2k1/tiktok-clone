import { configureStore } from '@reduxjs/toolkit';
import videoSlice from './slices/videoSlice';

const store = configureStore({
    reducer: {
        // video: videoReducer,
        video: videoSlice,
    },
});

export default store;
