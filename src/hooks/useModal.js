import { useDispatch, useSelector } from 'react-redux';
import { setAuthModal, setEditModal, setDeleteModal } from '~/store/slices/modalSlice';
import useScrollLock from './useScrollLock';

const useModal = () => {
    const { lockScroll, unlockScroll } = useScrollLock();
    const { token, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const openAuthModal = () => {
        if (token && Object.keys(user).length > 0) return;
        dispatch(setAuthModal(true));
        lockScroll();
    };

    const closeAuthModal = () => {
        dispatch(setAuthModal(false));
        unlockScroll();
    };

    const openEditModal = (title, id, type) => {
        if (token && Object.keys(user).length > 0) {
            dispatch(setEditModal({ enabled: true, title, id, type }));
            lockScroll();
        }
    };

    const closeEditModal = () => {
        dispatch(setEditModal({ enabled: false, title: '', id: '', type: '' }));
        unlockScroll();
    };

    const openDeleteModal = (title, id, type) => {
        if (token && Object.keys(user).length > 0) {
            dispatch(setDeleteModal({ enabled: true, title, id, type }));
            lockScroll();
        }
    };

    const closeDeleteModal = () => {
        dispatch(setDeleteModal({ enabled: false, title: '', id: '', type: '' }));
        unlockScroll();
    };

    return {
        openAuthModal,
        closeAuthModal,
        openEditModal,
        closeEditModal,
        openDeleteModal,
        closeDeleteModal,
    };
};

export default useModal;
