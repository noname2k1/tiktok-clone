import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        selectedUser: {},
    },
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
    },
});

const { actions, reducer } = userSlice;
export const { setSelectedUser } = actions;
export default reducer;
