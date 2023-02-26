import { createSlice } from '@reduxjs/toolkit';

const termSlice = createSlice({
    name: 'term',
    initialState: {
        termAvatarURL: {
            enabled: false,
            url: '',
        },
    },
    reducers: {
        setTermAvatarEnabled: (state, action) => {
            state.termAvatarURL.enabled = action.payload;
        },
        setTermAvatarURL: (state, action) => {
            state.termAvatarURL.url = action.payload;
        },
    },
});

const { actions, reducer } = termSlice;
export const { setTermAvatarURL, setTermAvatarEnabled } = actions;
export default reducer;
