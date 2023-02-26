import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '~/config';
import { useModal } from '~/hooks';
import * as commentService from '~/services/commentService';
import * as videoService from '~/services/videoService';
import { deleteComment } from '~/store/slices/commentSlice';
import { setToast } from '~/store/slices/globalComponentSlice';
import { setVideos } from '~/store/slices/videoSlice';

import Dialog from '../Dialog';

const DeleteDialog = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { from } = location.state || { from: config.routes.home };
    const videoID = location.pathname.split('/')[location.pathname.split('/').length - 1];
    const { deleteModal } = useSelector((state) => state.modal);
    const { videos } = useSelector((state) => state.video);
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
                        const videoIndex = videos.findIndex((video) => video.id === videoID);
                        if (videoIndex !== -1) {
                            const copyVideos = JSON.parse(JSON.stringify(videos));
                            copyVideos[videoIndex].comments_count -= 1;
                            dispatch(setVideos(copyVideos));
                        } else {
                        }
                        dispatch(
                            setToast({
                                enabled: true,
                                content: 'Deleted',
                                placement: 'top',
                            })
                        );
                        dispatch(deleteComment(id));
                    }
                });
                break;
            case 'video':
                videoService
                    .deleteVideo(id)
                    .then((res) => {
                        dispatch(
                            setToast({ enabled: true, content: 'Deleted video', placement: 'top' })
                        );
                        setTimeout(() => {
                            navigate(from, { replace: true });
                        }, 600);
                    })
                    .then((err) => {
                        // console.log(err);
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
