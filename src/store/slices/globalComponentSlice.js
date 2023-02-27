import { createSlice } from '@reduxjs/toolkit';

const globalComponentSlice = createSlice({
    name: 'globalComponent',
    initialState: {
        toast: {
            enabled: false,
            content: '',
            placement: 'top',
        },
        darkMode: false,
    },
    reducers: {
        setToast: (state, action) => {
            state.toast = {
                ...state.toast,
                ...action.payload,
            };
        },
        setDarkMode: (state, action) => {
            state.darkMode = action.payload;
        },
    },
});

const { actions, reducer } = globalComponentSlice;
export const { setToast, setDarkMode } = actions;
export default reducer;
