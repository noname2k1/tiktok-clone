import React from 'react';
import { useSelector } from 'react-redux';
import { AuthModalProvider } from '~/contexts';
import httpRequest from '~/utils/httpRequest';

import { AuthModal } from '../modals';
import DeleteDialog from '../modals/DeleteDialog/DeleteDialog';
import EditDialog from '../modals/EditDialog';
import EditProfileModal from '../modals/EditProfileModal';
import Toast from '../Toast';

const GlobalComponents = () => {
    const { token } = useSelector((state) => state.auth);
    const { darkMode } = useSelector((state) => state.globalComponent);
    React.useLayoutEffect(() => {
        const scrollBarCompensation = window.innerWidth - document.body.offsetWidth;
        document.body.style.setProperty('--scrollbar-compensation', `${scrollBarCompensation}px`);
        if (token) {
            httpRequest.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete httpRequest.defaults.headers.common['Authorization'];
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useLayoutEffect(() => {
        if (darkMode) {
            document.querySelector(':root').dataset.theme = 'dark';
        } else {
            document.querySelector(':root').dataset.theme = 'light';
        }
    }, [darkMode]);

    return (
        <>
            <AuthModalProvider>
                <AuthModal />
            </AuthModalProvider>

            {/* Edit profile modal */}
            <EditProfileModal />
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
