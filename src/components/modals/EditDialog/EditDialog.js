import React from 'react';
import Dialog from '../Dialog';
import { useSelector, useDispatch } from 'react-redux';
import { useModal } from '~/hooks';
import * as commentService from '~/services/commentService';
import { editComment } from '~/store/slices/commentSlice';

const EditDialog = () => {
    const dispatch = useDispatch();
    const { editModal } = useSelector((state) => state.modal);
    const [newComment, setNewComment] = React.useState('');
    const { id, type } = editModal;
    const { closeEditModal } = useModal();
    const EDIT_LABEL = 'Done';
    const CANCEL_LABEL = 'Cancel';
    const INPUT_PLACEHOLDER = 'Edit your comment';
    const handleEdit = () => {
        switch (type) {
            case 'comment':
                // console.log('Delete comment', id);
                if (newComment) {
                    commentService
                        .editComment(id, newComment)
                        .then((res) => {
                            dispatch(editComment(res));
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
                break;
            default:
                console.log('edit default', id);
                break;
        }
    };
    const options = [
        {
            label: EDIT_LABEL,
            onClick: () => {
                handleEdit();
                closeEditModal();
                setNewComment('');
            },
        },
        {
            label: CANCEL_LABEL,
            onClick: () => {
                closeEditModal();
                setNewComment('');
            },
        },
    ];

    const handleNewCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    return (
        <Dialog visible={editModal.enabled} title={editModal.title} options={options}>
            <textarea
                type='text'
                name='new-comment'
                value={newComment}
                placeholder={INPUT_PLACEHOLDER}
                onChange={handleNewCommentChange}
            />
        </Dialog>
    );
};

export default EditDialog;
