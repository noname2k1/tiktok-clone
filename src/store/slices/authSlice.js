import { createSlice } from '@reduxjs/toolkit';
import httpRequest from '~/utils/httpRequest';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: '',
        user: {},
    },
    reducers: {
        login: (state, action) => {
            const { token, user } = action.payload;
            state.token = token;
            state.user = user;
            httpRequest.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        },
        logout: (state) => {
            state.token = '';
            state.user = {};
            delete httpRequest.defaults.headers.common['Authorization'];
        },
        setCurrentUser: (state, action) => {
            state.user = {
                ...state.user,
                ...action.payload,
            };
        },
    },
});

const { actions, reducer } = authSlice;
export const { login, logout, setCurrentUser } = actions;
export default reducer;
