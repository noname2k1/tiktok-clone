import { combineReducers, configureStore } from '@reduxjs/toolkit';
import videoSlice from './slices/videoSlice';
import modalSlice from './slices/modalSlice';
import authSlice from './slices/authSlice';
import followSlice from './slices/followSlice';
import commentSlice from './slices/commentSlice';
import globalComponentSlice from './slices/globalComponentSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const reducers = combineReducers({
    video: videoSlice,
    modal: modalSlice,
    auth: authSlice,
    follow: followSlice,
    comment: commentSlice,
    globalComponent: globalComponentSlice,
});

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['modal', 'video', 'globalComponent', 'follow', 'comment'],
};

// const reducersNotPersist = {
//     video: videoSlice,
//     modal: modalSlice,
//     auth: authSlice,
// };

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
