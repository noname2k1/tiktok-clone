import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import CustomCheckbox from '~/components/Custom/CustomCheckbox';
import CustomSelect from '~/components/Custom/CustomSelect';
import { useModal } from '~/hooks';
import * as commentService from '~/services/commentService';
import * as videoService from '~/services/videoService';
import { editComment } from '~/store/slices/commentSlice';
import { setToast } from '~/store/slices/globalComponentSlice';
import { setCurrentVideo } from '~/store/slices/videoSlice';

import Dialog from '../Dialog';

const Wrapper = styled.div`
    width: 100%;
    padding-top: 0;
    .viewable-title {
        font-weight: 600;
        margin-bottom: 1rem;
        display: inline-block;
    }
    .input-wrapper {
        margin-top: 1rem;
    }

    .privacy-allows {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        align-items: center;
        .allows-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 80%;
        }
    }

    label {
        font-weight: 600;
    }
`;
const EditDialog = () => {
    const dispatch = useDispatch();
    const dataRef = React.useRef({});

    const { editModal } = useSelector((state) => state.modal);
    const [newComment, setNewComment] = React.useState('');
    const { id, type } = editModal;
    const { currentVideo } = useSelector((state) => state.video);

    const PUBLIC = 'Public';
    const FRIENDS = 'Friends';
    const PRIVATE = 'Private';
    const viewableOptions = [
        { id: 0, label: PUBLIC, value: 'public' },
        {
            id: 1,
            label: FRIENDS,
            value: 'friends',
        },
        {
            id: 2,
            label: PRIVATE,
            value: 'private',
        },
    ];
    const defaultViewable = viewableOptions.find(
        (option) => currentVideo.viewable === option.value
    );
    const [viewable, setViewable] = React.useState({});

    React.useEffect(() => {
        if (currentVideo) {
            setViewable(defaultViewable);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentVideo]);

    const { closeEditModal } = useModal();
    const EDIT_LABEL = 'Done';
    const CANCEL_LABEL = 'Cancel';
    const INPUT_PLACEHOLDER = 'Edit your comment';
    const EDITED = 'Edited';
    const VIEWABLE_TITLE = 'Who can watch this video?';
    const DESCRIPTION = 'Description';
    const Music = 'Music';
    const ALLOW_COMMENT = 'Allow comment';
    const ALLOW_DUET = 'Allow duet';
    const ALLOW_STITCH = 'Allow stitch';

    const viewableChange = (item) => {
        setViewable(item);
    };

    const handleEdit = () => {
        switch (type) {
            case 'comment':
                // console.log('Delete comment', id);
                if (newComment) {
                    commentService
                        .editComment(id, newComment)
                        .then((res) => {
                            dispatch(
                                setToast({ enabled: true, content: EDITED, placement: 'top' })
                            );
                            dispatch(editComment(res));
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
                break;
            case 'video':
                console.log('edit video', id);
                const data = new FormData();
                data.append('description', dataRef.current.description.value);
                data.append('music', dataRef.current.music.value);
                data.append('viewable', viewable.value);
                let allows = [];
                if (dataRef.current.comment.checked) allows.push('comment');
                if (dataRef.current.duet.checked) allows.push('duet');
                if (dataRef.current.stitch.checked) allows.push('stitch');
                data.append('allows', JSON.stringify(allows));

                videoService
                    .updateVideo(id, data)
                    .then((res) => {
                        dispatch(setToast({ enabled: true, content: EDITED, placement: 'top' }));
                        setTimeout(() => {
                            window.location.reload();
                        }, 600);
                    })
                    .then((err) => {
                        console.log(err);
                    });
                break;
            default:
                console.log('edit default', id);
                break;
        }
    };

    const reset = () => {
        setNewComment('');
        closeEditModal();
    };

    const options = [
        {
            label: EDIT_LABEL,
            onClick: () => {
                handleEdit();
                reset();
            },
        },
        {
            label: CANCEL_LABEL,
            onClick: () => {
                reset();
            },
        },
    ];

    const handleCheckboxChange = () => {
        const data = new FormData();
        let allows = [];
        if (dataRef.current.comment.checked) allows.push('comment');
        if (dataRef.current.duet.checked) allows.push('duet');
        if (dataRef.current.stitch.checked) allows.push('stitch');
        data.append('allows', JSON.stringify(allows));

        videoService.updateVideo(id, data).then((res) => {
            dispatch(
                setCurrentVideo({
                    ...currentVideo,
                    allows,
                })
            );
        });
    };

    const handleNewCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    return (
        <Dialog visible={editModal.enabled} title={editModal.title} options={options}>
            {type === 'comment' && (
                <textarea
                    type='text'
                    name='new-comment'
                    value={newComment}
                    placeholder={INPUT_PLACEHOLDER}
                    onChange={handleNewCommentChange}
                />
            )}
            {type === 'video' && (
                <Wrapper>
                    <span className='viewable-title'>{VIEWABLE_TITLE}</span>
                    <CustomSelect
                        medium
                        items={viewableOptions}
                        value={viewable}
                        onChange={viewableChange}
                    />
                    <div className='input-wrapper'>
                        <label htmlFor='description'>{DESCRIPTION}</label>
                        <input
                            type='text'
                            name='description'
                            id='description'
                            ref={(el) => (dataRef.current['description'] = el)}
                            placeholder={DESCRIPTION}
                            defaultValue={currentVideo.description}
                        />
                    </div>
                    <div className='input-wrapper'>
                        <label htmlFor='music'>{Music}</label>
                        <input
                            type='text'
                            name='music'
                            id='music'
                            ref={(el) => (dataRef.current['music'] = el)}
                            placeholder={Music}
                            defaultValue={currentVideo.music}
                        />
                    </div>
                    <div className='privacy-allows'>
                        <div className='allows-item'>
                            <label htmlFor='comment'>{ALLOW_COMMENT}</label>
                            <CustomCheckbox
                                defaultChecked={currentVideo.allows.indexOf('comment') !== -1}
                                id='comment'
                                name='comment'
                                ref={(el) => (dataRef.current['comment'] = el)}
                                onChange={handleCheckboxChange}
                            />
                        </div>
                        <div className='allows-item'>
                            <label htmlFor='duet'>{ALLOW_DUET}</label>
                            <CustomCheckbox
                                defaultChecked={currentVideo.allows.indexOf('duet') !== -1}
                                name='duet'
                                id='duet'
                                ref={(el) => (dataRef.current['duet'] = el)}
                                onChange={handleCheckboxChange}
                            />
                        </div>
                        <div className='allows-item'>
                            <label htmlFor='stitch'>{ALLOW_STITCH}</label>
                            <CustomCheckbox
                                defaultChecked={currentVideo.allows.indexOf('stitch') !== -1}
                                name='stitch'
                                id='stitch'
                                ref={(el) => (dataRef.current['stitch'] = el)}
                                onChange={handleCheckboxChange}
                            />
                        </div>
                    </div>
                </Wrapper>
            )}
        </Dialog>
    );
};

export default EditDialog;
