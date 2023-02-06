import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '~/hooks';
import * as commentService from '~/services/commentService';
import { deleteComment } from '~/store/slices/commentSlice';
import Dialog from '../Dialog';

const DeleteDialog = () => {
    const dispatch = useDispatch();
    const { deleteModal } = useSelector((state) => state.modal);
    const { id, type } = deleteModal;
    const { closeDeleteModal } = useModal();
    const DELETE_LABEL = 'Delete';
    const CANCEL_LABEL = 'Cancel';
    const handleDelete = () => {
        switch (type) {
            case 'comment':
                // console.log('Delete comment', id);
                commentService.deleteComment(id).then((res) => {
                    if (res.status === 200) {
                        dispatch(deleteComment(id));
                    }
                });
                break;
            default:
                console.log('Delete default', id);
                break;
        }
    };
    const options = [
        {
            label: DELETE_LABEL,
            onClick: () => {
                handleDelete();
                closeDeleteModal();
            },
        },
        {
            label: CANCEL_LABEL,
            onClick: () => {
                closeDeleteModal();
            },
        },
    ];
    return <Dialog visible={deleteModal.enabled} title={deleteModal.title} options={options} />;
};

export default DeleteDialog;
