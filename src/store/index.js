import { combineReducers, configureStore } from '@reduxjs/toolkit';
import videoSlice from './slices/videoSlice';
import modalSlice from './slices/modalSlice';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import followSlice from './slices/followSlice';
import commentSlice from './slices/commentSlice';
import termSlice from './slices/termSlice';
import globalComponentSlice from './slices/globalComponentSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const reducers = combineReducers({
    video: videoSlice,
    modal: modalSlice,
    auth: authSlice,
    user: userSlice,
    follow: followSlice,
    comment: commentSlice,
    term: termSlice,
    globalComponent: globalComponentSlice,
});

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['modal', 'comment', 'user', 'term'],
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
