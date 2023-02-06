import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'follow',
    initialState: {
        followingUsers: [],
    },
    reducers: {
        setFollowingUsers: (state, action) => {
            state.followingUsers = action.payload;
        },
        follow: (state, action) => {
            state.followingUsers.push(action.payload);
        },
        unfollow: (state, action) => {
            const index = state.followingUsers.findIndex((user) => user.id === action.payload.id);
            state.followingUsers.splice(index, 1);
        },
    },
});

const { actions, reducer } = authSlice;
export const { setFollowingUsers, follow, unfollow } = actions;
export default reducer;
