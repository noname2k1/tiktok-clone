import React, { useState, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './Upload.module.scss';
import Button from '~/components/Button';
import images from '~/assets/images';
import { useDispatch, useSelector } from 'react-redux';
import { setToast } from '~/store/slices/globalComponentSlice';
import { AtIcon, CloseLargeIcon, HashtagIcon, SearchIcon, WarningIcon } from '~/components/icons';
import CustomCheckbox from '~/components/Custom/CustomCheckbox';
import CustomSelect from '~/components/Custom/CustomSelect';
import MobilePreview from '~/components/MobilePreview';
import ReplaceVideoDialog from '~/components/modals/ReplaceVideoDialog';
import CircularProgressbar from '~/components/CircularProgressBar/CircularProgressBar';
import * as videoService from '~/services/videoService';
import { LoadingEffect } from '~/components/effects';
import ListUser from './ListUser';
import { useModal } from '~/hooks';

const cx = classNames.bind(styles);
const UploadBody = () => {
    const TEXT_VAR = {
        MAX_LENGTH_CAPTION: 150,
        CAPTION: 'Caption',
        CAPTION_SEARCH: '@Friends',
        COVER: 'Cover',
        VIEWABLE_TITLE: 'Who can watch this video',
        ALLOWS_TITLE: 'Allow user to:',
        DICARD: 'Discard',
        POST: 'Post',
        MAIN_TITLE: 'Upload Video',
        SUB_TITLE: 'Post a video to your account',
        POST_SUCCESS: 'Post video successfully',
        NO_VIDEO: 'Please upload a video first',
        DEFAULT_MUSIC: 'original sound',
        MAXIMUM_CHARACTER: () => `Maximum ${TEXT_VAR.MAX_LENGTH_CAPTION} characters`,
        PUBLIC: 'Public',
        FRIENDS: 'Friends',
        PRIVATE: 'Private',
        UPLOAD_PLACE_TITLE: 'Select video to upload',
        UPLOAD_PLACE_SUB_TITLE: 'Or drag and drop a file',
        FILE_FORMAT: 'MP4 or WebM',
        FILE_RESOLUTION: '720x1280 resolution or higher',
        FILE_DURATION: 'Up to 30 minutes',
        FILE_SIZE: 'Less than 2 GB',
        SELECT_FILE: 'Select a file',
        CANCEL: 'Cancel',
        CHANGE_VIDEO: 'Change video',
        DIVIDE_VIDEO_TITLE: 'Divide videos and edit',
        DIVIDE_VIDEO_DESCRIPTION:
            'You can quickly divide videos into multiple parts, remove redundant parts and turn landscape videos into portrait videos',
        EDIT: 'Edit',
        COMMENT: 'Comment',
        DUET: 'Duet',
        STITCH: 'Stitch',
        MUSIC: 'Music',
        THUMNAIL_TIME: 'Thumbnail time',
        RUN_A_COPYRIGHT_CHECK: 'Run a copyright check',
        COPYRIGHT_CHECK_NOTICE: 'Copyright check will not begin until your video is uploaded.',
        COPYRIGHT_CHECK_INFO: `We'll check your video for potential copyright infringements on
                                used sounds. If infringements are found, you can edit the video
                                before posting.`,
        COPYRIGHT_CHECK_INFO_LINK: 'Learn more',
    };

    const dispatch = useDispatch();
    const inputFileRef = useRef(null);
    const inputCaptionRef = useRef(null);
    const inputSearchUserRef = useRef(null);
    const checkboxRef = useRef(null);
    const videoRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [caption, setCaption] = useState('');
    const [searchUser, setSearchUser] = useState('');
    const [viewable, setViewable] = useState({
        id: 0,
        value: 'public',
        label: TEXT_VAR.PUBLIC,
    });
    const [loadingPercent, setLoadingPercent] = useState(0);
    const [replaceDialog, setReplaceDialog] = useState(false);
    const [music, setMusic] = useState(TEXT_VAR.DEFAULT_MUSIC);
    const [cover, setCover] = useState(null);
    const [videoDuration, setVideoDuration] = useState(0);
    const [thumbnail_time, setThumbnail_time] = useState(0);
    const [allows, setAllows] = useState({
        comment: true,
        duet: true,
        stitch: true,
    });
    const [copyrightcheck, setCopyrightcheck] = useState(false);
    const [listUsers, setListUser] = useState({
        allUsers: false,
        followingUsers: false,
    });
    const [loading, setLoading] = useState(false);

    const { token, user } = useSelector((state) => state.auth);
    const { openAuthModal } = useModal();

    const handleStartChooseVideo = () => {
        inputFileRef.current.click();
    };

    const handleDropFile = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setSelectedFile(file);
    };

    const handleInputVideo = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleOpenEditVideoUploaded = () => {
        if (!selectedFile) {
            dispatch(setToast({ enabled: true, content: TEXT_VAR.NO_VIDEO }));
        }
    };

    const handleCaptionChange = (event) => {
        const { value } = event.target;
        setCaption(value);
    };

    const handleSearchUserChange = (event) => {
        setSearchUser(event.target.value);
    };

    const handleAddHashTagChar = () => {
        if (caption.length < TEXT_VAR.MAX_LENGTH_CAPTION) {
            setCaption((prevCaption) => prevCaption + '#');
        }
    };
    const handleAddAtChar = () => {
        setListUser({ allUsers: false, followingUsers: true });
        setTimeout(() => {
            inputSearchUserRef?.current?.focus();
        }, 100);
    };

    const handleClickItem = (item) => {
        setCaption((prevCaption) => prevCaption + item);
        handleRemoveListUser();
    };

    const handleRemoveListUser = () => {
        setListUser({ allUsers: false, followingUsers: false });
        setSearchUser('');
        setTimeout(() => {
            inputCaptionRef?.current?.focus();
        }, 100);
    };

    const handleViewableChange = (item) => {
        setViewable(item);
    };

    const handleAllowsChange = (event) => {
        const { name } = event.target;
        setAllows((prevAllows) => ({
            ...prevAllows,
            [name]: !prevAllows[name],
        }));
    };

    const handleMusicChange = (event) => {
        const { value } = event.target;
        setMusic(value);
    };

    const handleThumbnailTimeChange = (event) => {
        const { value } = event.target;
        setThumbnail_time(value);
    };

    const handleRemoveVideo = () => {
        setSelectedFile(null);
        URL.revokeObjectURL(videoUrl);
        setVideoUrl(null);
        setReplaceDialog(false);
        inputFileRef.current.value = '';
        setCaption('');
        setLoadingPercent(0);
        setThumbnail_time(0);
        setMusic(TEXT_VAR.DEFAULT_MUSIC);
        setVideoDuration(0);
    };

    const handleOpenReplaceVideoModal = () => {
        setReplaceDialog(true);
    };

    const handlePostVideo = () => {
        if (token && Object.keys(user).length > 0) {
            setLoading(true);
            const data = new FormData();
            data.append('upload_file', selectedFile);
            data.append('description', caption);
            data.append('viewable', viewable.value);

            if (allows.comment) {
                data.append('allows[]', 'comment');
            }
            if (allows.duet) {
                data.append('allows[]', 'duet');
            }
            if (allows.stitch) {
                data.append('allows[]', 'stitch');
            }

            data.append('music', music);
            data.append('thumbnail_time', thumbnail_time);

            videoService
                .createVideo(data)
                .then((res) => {
                    // console.log(res);
                    handleRemoveVideo();
                    setLoading(false);
                    dispatch(setToast({ enabled: true, content: TEXT_VAR.POST_SUCCESS }));
                })
                .catch((err) => {
                    // console.log(err);
                    setLoading(false);
                });
        } else {
            openAuthModal();
        }
    };

    React.useEffect(() => {
        if (caption.length > TEXT_VAR.MAX_LENGTH_CAPTION) {
            dispatch(
                setToast({
                    enabled: true,
                    content: TEXT_VAR.MAXIMUM_CHARACTER(),
                })
            );
            setCaption(caption.slice(0, TEXT_VAR.MAX_LENGTH_CAPTION));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [caption]);

    React.useEffect(() => {
        let timer = null;
        if (videoUrl) {
            timer = setInterval(() => {
                setLoadingPercent((prevPercent) => {
                    if (prevPercent < 100) {
                        return prevPercent + Math.floor(Math.min(50, Math.random() * 20));
                    }
                    return prevPercent;
                });
            }, 100);
        }
        return () => {
            clearInterval(timer);
            setLoadingPercent(0);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoUrl]);

    const loaddedVideo = () => {
        setVideoDuration(videoRef.current.duration);
    };

    React.useEffect(() => {
        if (loadingPercent >= 100 && videoUrl && selectedFile) {
            setCaption(selectedFile.name.split('.mp4' || 'webm')[0]);
        }
    }, [loadingPercent, selectedFile, videoUrl]);

    React.useEffect(() => {
        let timer = null;
        if (selectedFile) {
            const videoUrl = URL.createObjectURL(selectedFile);
            setVideoUrl(videoUrl);
        }
        return () => {
            if (videoUrl) {
                clearInterval(timer);
                handleRemoveVideo();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFile]);

    return (
        <div className={cx('container')}>
            {videoUrl && (
                <video
                    src={videoUrl}
                    ref={videoRef}
                    style={{ display: 'none' }}
                    onLoadedData={loaddedVideo}
                ></video>
            )}
            <div className={cx('wrapper')}>
                <header>
                    <h2 className={cx('main-title')}>{TEXT_VAR.MAIN_TITLE}</h2>
                    <p className={cx('main-description')}>{TEXT_VAR.SUB_TITLE}</p>
                </header>
                <input
                    type='file'
                    name='video'
                    ref={inputFileRef}
                    style={{
                        display: 'none',
                    }}
                    onInput={handleInputVideo}
                    accept='video/mp4,video/webm'
                />
                <div className={cx('upload-body')}>
                    {!selectedFile && !videoUrl && loadingPercent === 0 && (
                        <div
                            className={cx('upload-video-place')}
                            onClick={handleStartChooseVideo}
                            onDrop={handleDropFile}
                            onDragOver={(event) => event.preventDefault()}
                        >
                            <img src={images.cloudIcon} alt='tiktok-clone-by-ninhnam' />
                            <div className={cx('main-title')}>{TEXT_VAR.UPLOAD_PLACE_TITLE}</div>
                            <div>{TEXT_VAR.UPLOAD_PLACE_SUB_TITLE}</div>
                            <div>{TEXT_VAR.FILE_FORMAT}</div>
                            <div>{TEXT_VAR.FILE_RESOLUTION}</div>
                            <div>{TEXT_VAR.FILE_DURATION}</div>
                            <div>{TEXT_VAR.FILE_SIZE}</div>
                            <Button primary>{TEXT_VAR.SELECT_FILE}</Button>
                        </div>
                    )}
                    {selectedFile && videoUrl && loadingPercent < 100 && (
                        <div className={cx('upload-video-place')}>
                            <CircularProgressbar percentage={loadingPercent} />
                            <Button onClick={handleRemoveVideo}>{TEXT_VAR.CANCEL}</Button>
                        </div>
                    )}
                    {selectedFile && videoUrl && loadingPercent >= 100 && (
                        <div className={cx('upload-video-preview')}>
                            <MobilePreview
                                video={videoUrl}
                                videoObj={selectedFile}
                                onError={handleRemoveVideo}
                            />
                            <div className={cx('upload-video-replace')}>
                                <img src={images.checkIcon} alt='tiktok-clone-by-ninhnam' />
                                <span className={cx('preview-caption')}>{caption}</span>
                                <span
                                    className={cx('change-video')}
                                    onClick={handleOpenReplaceVideoModal}
                                >
                                    {TEXT_VAR.CHANGE_VIDEO}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className={cx('upload-video-info')}>
                        <div className={cx('entrance')}>
                            <div className={cx('entrance-inside')}>
                                <img src={images.divide} alt='tiktokclone' />
                                <div className={cx('entrance-text')}>
                                    <div className={cx('title')}>{TEXT_VAR.DIVIDE_VIDEO_TITLE}</div>
                                    <p>{TEXT_VAR.DIVIDE_VIDEO_DESCRIPTION}</p>
                                </div>
                            </div>
                            <Button primary medium onClick={handleOpenEditVideoUploaded}>
                                {TEXT_VAR.EDIT}
                            </Button>
                        </div>
                        <div className={cx('caption-wrapper')}>
                            <div className={cx('caption-text')}>
                                {!listUsers.allUsers && !listUsers.followingUsers ? (
                                    <>
                                        <span className={cx('title')}>{TEXT_VAR.CAPTION}</span>
                                        <span className={cx('limit-characters')}>
                                            {caption.length}/{TEXT_VAR.MAX_LENGTH_CAPTION}
                                        </span>
                                    </>
                                ) : (
                                    <span className={cx('title')}>{TEXT_VAR.CAPTION_SEARCH}</span>
                                )}
                            </div>
                            <div
                                className={cx('caption-input-wrapper')}
                                style={{
                                    paddingLeft:
                                        listUsers.allUsers || listUsers.followingUsers
                                            ? '50px'
                                            : '20px',
                                    paddingRight:
                                        listUsers.allUsers || listUsers.followingUsers
                                            ? '40px'
                                            : '80px',
                                }}
                            >
                                {(listUsers.allUsers || listUsers.followingUsers) && (
                                    <div className={cx('before-input')}>
                                        <div className={cx('before-input-item')}>
                                            <SearchIcon />
                                        </div>
                                    </div>
                                )}

                                {listUsers.allUsers || listUsers.followingUsers ? (
                                    <>
                                        <input
                                            type='text'
                                            name='caption'
                                            value={searchUser}
                                            onChange={handleSearchUserChange}
                                            className={cx('caption-input')}
                                            ref={inputSearchUserRef}
                                        />
                                        <div className={cx('after-input')}>
                                            <div
                                                className={cx('after-input-item')}
                                                onClick={handleRemoveListUser}
                                            >
                                                <CloseLargeIcon />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            type='text'
                                            name='caption'
                                            value={caption}
                                            onChange={handleCaptionChange}
                                            className={cx('caption-input')}
                                            ref={inputCaptionRef}
                                        />
                                        <div className={cx('after-input')}>
                                            <div
                                                className={cx('after-input-item')}
                                                onClick={handleAddAtChar}
                                            >
                                                <AtIcon />
                                            </div>
                                            <div
                                                className={cx('after-input-item')}
                                                onClick={handleAddHashTagChar}
                                            >
                                                <HashtagIcon />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            {(listUsers.allUsers || listUsers.followingUsers) && (
                                <ListUser searchValue={searchUser} clickItem={handleClickItem} />
                            )}
                        </div>
                        <div className={cx('cover-wrapper')}>
                            <span className={cx('title')}>{TEXT_VAR.COVER}</span>
                            <div className={cx('cover-inside')}></div>
                        </div>
                        <div className={cx('viewable-wrapper')}>
                            <span className={cx('title')}>{TEXT_VAR.VIEWABLE_TITLE}</span>
                            <CustomSelect
                                items={[
                                    { id: 0, value: 'public', label: TEXT_VAR.PUBLIC },
                                    { id: 1, value: 'friends', label: TEXT_VAR.FRIENDS },
                                    { id: 2, value: 'private', label: TEXT_VAR.PRIVATE },
                                ]}
                                onChange={handleViewableChange}
                                value={viewable}
                                long
                            />
                        </div>
                        <div className={cx('allows-wrapper')}>
                            <span className={cx('title')}>{TEXT_VAR.ALLOWS_TITLE}</span>
                            <div className={cx('allows-inside')}>
                                <div className={cx('allows-item')}>
                                    <input
                                        type='checkbox'
                                        name='comment'
                                        id='comment'
                                        checked={allows.comment}
                                        onChange={handleAllowsChange}
                                    />
                                    <label htmlFor='comment'>{TEXT_VAR.COMMENT}</label>
                                </div>
                                <div className={cx('allows-item')}>
                                    <input
                                        type='checkbox'
                                        name='duet'
                                        id='duet'
                                        checked={allows.duet}
                                        onChange={handleAllowsChange}
                                    />
                                    <label htmlFor='duet'>{TEXT_VAR.DUET}</label>
                                </div>
                                <div className={cx('allows-item')}>
                                    <input
                                        type='checkbox'
                                        name='stitch'
                                        id='stitch'
                                        checked={allows.stitch}
                                        onChange={handleAllowsChange}
                                    />
                                    <label htmlFor='stitch'>{TEXT_VAR.STITCH}</label>
                                </div>
                            </div>
                        </div>
                        <div className={cx('music-wrapper')}>
                            <span className={cx('title')}>{TEXT_VAR.MUSIC}</span>
                            <div className={cx('music-inside')}>
                                <input
                                    type='text'
                                    name='music'
                                    value={music}
                                    onChange={handleMusicChange}
                                />
                            </div>
                        </div>
                        <div className={cx('thumbnail-time-wrapper')}>
                            <span className={cx('title')}>{TEXT_VAR.THUMNAIL_TIME}</span>
                            <div className={cx('music-inside')}>
                                <input
                                    type='number'
                                    name='thumbnail_time'
                                    value={thumbnail_time}
                                    min={0}
                                    step={1}
                                    max={videoDuration}
                                    onChange={handleThumbnailTimeChange}
                                />
                            </div>
                        </div>
                        <div className={cx('copyright-check-wrapper')}>
                            <div className={cx('row')}>
                                <span className={cx('title')}>
                                    {TEXT_VAR.RUN_A_COPYRIGHT_CHECK}
                                </span>
                                <CustomCheckbox
                                    name='copyright'
                                    id='copyright'
                                    ref={checkboxRef}
                                    checked={copyrightcheck}
                                    onChange={() => setCopyrightcheck(!copyrightcheck)}
                                />
                            </div>
                            {copyrightcheck && loadingPercent < 100 ? (
                                <div className={cx('warning')}>
                                    <span className={cx('icon')}>
                                        <WarningIcon />
                                    </span>
                                    {TEXT_VAR.COPYRIGHT_CHECK_NOTICE}
                                </div>
                            ) : (
                                <p className={cx('intruction')}>
                                    {TEXT_VAR.COPYRIGHT_CHECK_INFO}
                                    <a href='/'>{TEXT_VAR.COPYRIGHT_CHECK_INFO_LINK}</a>
                                </p>
                            )}
                        </div>
                        <div className={cx('upload-button-wrapper')}>
                            <Button large onClick={handleRemoveVideo}>
                                {TEXT_VAR.DICARD}
                            </Button>
                            <Button
                                primary
                                large
                                disabled={
                                    !selectedFile ||
                                    !videoUrl ||
                                    !caption ||
                                    caption.length > TEXT_VAR.MAX_LENGTH_CAPTION ||
                                    loading
                                }
                                onClick={handlePostVideo}
                                style={{ maxHeight: '46.67px' }}
                            >
                                {loading ? <LoadingEffect /> : TEXT_VAR.POST}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <ReplaceVideoDialog
                visible={replaceDialog}
                ok={handleRemoveVideo}
                cancel={() => setReplaceDialog(false)}
            />
        </div>
    );
};

export default UploadBody;
