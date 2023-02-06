import { createSlice } from '@reduxjs/toolkit';

const globalComponentSlice = createSlice({
    name: 'globalComponent',
    initialState: {
        toast: {
            enabled: false,
            content: '',
            placement: 'top',
        },
    },
    reducers: {
        setToast: (state, action) => {
            state.toast = {
                ...state.toast,
                ...action.payload,
            };
        },
    },
});

const { actions, reducer } = globalComponentSlice;
export const { setToast } = actions;
export default reducer;
