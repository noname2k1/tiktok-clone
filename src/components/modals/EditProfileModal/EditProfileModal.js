import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import PhotoEditor from '~/components/PhotoEditor';
import { useModal } from '~/hooks';
import { setTermAvatarEnabled, setTermAvatarURL } from '~/store/slices/termSlice';

import PrimaryModal from '../PrimaryModal';
import BodyModal from './BodyModal';

const EditProfileModal = () => {
    const dispatch = useDispatch();
    const { closeEditProfileModal } = useModal();
    const { editProfileModal } = useSelector((state) => state.modal);
    const { user } = useSelector((state) => state.auth);
    const { termAvatarURL } = useSelector((state) => state.term);
    const HEADER_TITLE = 'Edit Profile';

    const defaultValues = {
        nickname: user.nickname,
        first_name: user.first_name,
        last_name: user.last_name,
        bio: user.bio,
    };

    const formManager = useForm({
        defaultValues,
    });

    const handleCloseModal = () => {
        closeEditProfileModal(formManager.reset, defaultValues);
        closePhotoEditor();
    };

    const closePhotoEditor = () => {
        dispatch(setTermAvatarURL(''));
        dispatch(setTermAvatarEnabled(false));
    };

    return (
        <PrimaryModal
            visible={editProfileModal.enabled}
            headerTitle={HEADER_TITLE}
            closeButtonBg
            closeFunc={handleCloseModal}
            headerBorder
        >
            {termAvatarURL.enabled && termAvatarURL.url && (
                <PhotoEditor img={termAvatarURL.url} cancel={closePhotoEditor} />
            )}
            <BodyModal
                formManager={formManager}
                cancel={handleCloseModal}
                defaultValues={defaultValues}
                avatar={user.avatar}
            />
        </PrimaryModal>
    );
};

export default EditProfileModal;
