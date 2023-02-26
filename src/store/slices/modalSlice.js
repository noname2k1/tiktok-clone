import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        authModal: false,
        editModal: {
            enabled: false,
            title: '',
            id: '',
            type: '',
        },
        deleteModal: {
            enabled: false,
            title: '',
            id: '',
            type: '',
        },
        reportModal: {
            enabled: false,
            title: '',
        },
        editProfileModal: {
            enabled: false,
        },
    },
    reducers: {
        closeAllModals: (state) => {
            state.authModal = false;
        },
        setAuthModal: (state, action) => {
            state.authModal = action.payload;
        },
        setEditModal: (state, action) => {
            state.editModal = {
                ...state.editModal,
                ...action.payload,
            };
        },
        setDeleteModal: (state, action) => {
            state.deleteModal = {
                ...state.deleteModal,
                ...action.payload,
            };
        },
        setReportModal: (state, action) => {
            state.reportModal = {
                ...state.reportModal,
                ...action.payload,
            };
        },
        setEditProfileModal: (state, action) => {
            state.editProfileModal = {
                ...state.editProfileModal,
                ...action.payload,
            };
        },
    },
});

const { actions, reducer } = modalSlice;
export const {
    closeAllModals,
    setAuthModal,
    setEditModal,
    setDeleteModal,
    setReportModal,
    setEditProfileModal,
} = actions;
export default reducer;
