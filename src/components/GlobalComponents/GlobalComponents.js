import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthModalProvider } from '~/contexts';
import { setFollowingUsers } from '~/store/slices/followSlice';
import httpRequest from '~/utils/httpRequest';
import { AuthModal } from '../modals';
import Toast from '../Toast';
import * as followService from '~/services/followService';
import DeleteDialog from '../modals/DeleteDialog/DeleteDialog';
import EditDialog from '../modals/EditDialog';

const GlobalComponents = () => {
    const dispatch = useDispatch();
    const { token, user } = useSelector((state) => state.auth);
    React.useLayoutEffect(() => {
        const scrollBarCompensation = window.innerWidth - document.body.offsetWidth;
        document.body.style.setProperty('--scrollbar-compensation', `${scrollBarCompensation}px`);
        if (token) {
            httpRequest.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete httpRequest.defaults.headers.common['Authorization'];
        }
        if (token && Object.keys(user).length > 0) {
            followService.getFollowingUsers().then((followingUsers) => {
                dispatch(setFollowingUsers(followingUsers));
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <AuthModalProvider>
                <AuthModal />
            </AuthModalProvider>
            {/* editDialog */}
            <EditDialog />
            {/* deleteDialog */}
            <DeleteDialog />

            {/* display toast */}
            <Toast />
        </>
    );
};

export default GlobalComponents;
