import 'tippy.js/dist/tippy.css';

import Tippy from '@tippyjs/react';
import HeadlessTippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import React from 'react';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Button from '~/components/Button';
import {
    CloseLargeIcon,
    CommentIcon,
    HeartIcon,
    MoreIcon,
    MusicNoteIcon,
} from '~/components/icons';
import Image from '~/components/Image';
import AccountPreview from '~/components/SuggestedAccounts/AccountPreview';
import Video from '~/components/Video';
import { descriptionFormater, numberFormater } from '~/helpers';
import useAuthModal from '~/hooks/useModal';
import * as commentService from '~/services/commentService';
import * as followService from '~/services/followService';
import * as likeService from '~/services/likeService';
import * as videoService from '~/services/videoService';
import { addComment } from '~/store/slices/commentSlice';
import { follow, unfollow } from '~/store/slices/followSlice';
import { setToast } from '~/store/slices/globalComponentSlice';
import { setVideos, setCurrentVideo as setCV } from '~/store/slices/videoSlice';

import Comments from './comments';
import othersList from './othersList';
import styles from './VideoDiscover.module.scss';
import { Wrapper } from '~/components/Popper';
import useModal from '~/hooks/useModal';
import CommentInput from '~/components/Custom/CommentInput';

const cx = classNames.bind(styles);

const ButtonSC = styled.button`
    background-color: var(--btn-in-video-bg);
    border-radius: 50%;
    &:hover {
        background-color: var(--btn-in-video-hover-bg);
        opacity: 0.7;
    }
`;

const VideoDiscover = () => {
    const dispatch = useDispatch();
    const inputRef = React.useRef();
    const params = useParams();
    const location = useLocation();
    const { from } = location.state || { from: '/' };
    const navigate = useNavigate();
    const { videos, currentVideo: CV } = useSelector((state) => state.video);
    const { openEditModal, openDeleteModal } = useModal();
    const hostName = process.env.REACT_APP_HOST_URL;
    const currentLink = `${hostName}${location.pathname}`;
    const COMMENT_PLACEHOLDER = 'Add comment...';
    const COMMENT_BTN_LABEL = 'Post';
    const FOLLOW_BTN_LABEL = 'Follow';
    const FOLLOWING_BTN_LABEL = 'Following';
    const COPY_LINK_BTN_LABEL = 'Copy Link';
    const COPIED = 'Copied';
    const DELETE_VIDEO_TITLE = 'Are you sure you want to delete this video?';
    const PRIVACY_SETTING = 'Privacy Settings';
    const DELETE = 'Delete';
    const COMMENTS_TURNED_OFF = 'Comments are turned off';
    const MAX_LENGTH = 150;

    const [currentVideo, setCurrentVideo] = React.useState({
        music: '',
        description: 'loading...',
        user: {
            nickname: 'loading...',
            first_name: 'loading...',
            last_name: '...',
        },
        comments_count: 0,
        likes_count: 0,
    });

    const [comment, setComment] = React.useState('');
    const { openAuthModal } = useAuthModal();
    const { followingUsers } = useSelector((state) => state.follow);
    const { token, user } = useSelector((state) => state.auth);

    React.useLayoutEffect(() => {
        const videoId = params.videoId;
        const existVideo = videos.find((video) => video.uuid === videoId);
        if (!existVideo || !Object.keys(existVideo).length > 0) {
            videoService.getVideo(videoId).then((video) => {
                setCurrentVideo(video);
                dispatch(setCV(video));
            });
        } else {
            setCurrentVideo(existVideo);
            dispatch(setCV(existVideo));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.videoId, videos]);

    const allows = CV.allows;
    React.useLayoutEffect(() => {
        setCurrentVideo((prev) => ({ ...prev, allows }));
    }, [allows]);

    const updateLikeState = (video, videoID) => {
        const videoIndex = videos.findIndex((video) => video.uuid === videoID);
        if (videoIndex === -1) {
            setCurrentVideo({
                ...currentVideo,
                is_liked: video.is_liked,
                likes_count: video.likes_count,
            });
        } else {
            const newVideos = JSON.parse(JSON.stringify(videos));
            newVideos[videoIndex].is_liked = video.is_liked;
            newVideos[videoIndex].likes_count = video.likes_count;
            dispatch(setVideos(newVideos));
        }
    };

    const handleLikeVideo = (likeState, videoID) => {
        if (!token || !user) {
            openAuthModal();
        }
        // unlike
        if (likeState) {
            likeService.unlikePost(videoID).then((thisVideo) => {
                updateLikeState(thisVideo, videoID);
            });
        } else {
            // like
            likeService.likePost(videoID).then((thisVideo) => {
                updateLikeState(thisVideo, videoID);
            });
        }
    };

    const handleFollowUser = (followState, userID) => {
        if (!token || !user) {
            openAuthModal();
        }
        // unfollow
        if (followState) {
            followService.unfollow(userID).then((thisUser) => {
                dispatch(unfollow(thisUser));
            });
        } else {
            // follow
            followService.follow(userID).then((thisUser) => {
                dispatch(follow(thisUser));
            });
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(currentLink);
        dispatch(setToast({ enabled: true, content: COPIED }));
    };

    const handleCommentChange = (e) => {
        setComment(e.target.textContent);
    };

    const handleBackToPreviousPage = () => {
        navigate(from);
    };

    const handleDeleteVideo = () => {
        openDeleteModal(DELETE_VIDEO_TITLE, currentVideo.id, 'video');
    };

    const handlePrivacySettings = () => {
        openEditModal(PRIVACY_SETTING, currentVideo.id, 'video');
    };

    const handleCreateComment = () => {
        if (comment) {
            commentService.createComment(currentVideo.uuid, comment).then((data) => {
                // console.log(data);
                dispatch(addComment(data));
            });
            setComment('');
            inputRef.current.textContent = '';
        }
    };

    return (
        <section className={cx('wrapper')}>
            {/* left */}
            <div className={cx('video-container')}>
                <Video
                    medium
                    poster={currentVideo.thumb_url}
                    src={currentVideo.file_url}
                    // ref={videoRef}
                />
                <ButtonSC className={cx('close-btn')} onClick={handleBackToPreviousPage}>
                    <CloseLargeIcon />
                </ButtonSC>
            </div>
            {/* right */}
            <div className={cx('video-info')}>
                <div className={cx('user-info')}>
                    <AccountPreview
                        user={currentVideo.user}
                        offset={[260, 0]}
                        placement='bottom-end'
                    >
                        <div className={cx('avatar')}>
                            <Image
                                src={currentVideo.user?.avatar}
                                alt={currentVideo.user?.nickname}
                                rounded
                                medium
                            />
                        </div>
                    </AccountPreview>
                    <AccountPreview
                        user={currentVideo.user}
                        placement='bottom-end'
                        offset={[90, 0]}
                    >
                        <div className={cx('user')}>
                            <p className={cx('nickname')}>{currentVideo.user?.nickname}</p>
                            <p className={cx('name')}>
                                {`${currentVideo.user?.first_name} ${currentVideo.user?.last_name}`}
                                {' · '}
                                <span className={cx('created-at')}>
                                    <Moment fromNow>{currentVideo.created_at}</Moment>
                                </span>
                            </p>
                        </div>
                    </AccountPreview>
                    {currentVideo.user?.id !== user.id ? (
                        <div className={cx('follow-btn')}>
                            <Button
                                outline={
                                    !followingUsers.some(
                                        (user) => user.id === currentVideo.user?.id
                                    )
                                }
                                medium
                                onClick={() => {
                                    const followState = followingUsers.some(
                                        (user) => user.id === currentVideo.user?.id
                                    );
                                    handleFollowUser(followState, currentVideo.user?.id);
                                }}
                            >
                                {followingUsers.some((user) => user.id === currentVideo.user?.id)
                                    ? FOLLOWING_BTN_LABEL
                                    : FOLLOW_BTN_LABEL}
                            </Button>
                        </div>
                    ) : (
                        <HeadlessTippy
                            interactive
                            // visible
                            placement='bottom-end'
                            render={(attrs) => (
                                <Wrapper>
                                    <div className={cx('more-list')}>
                                        <div
                                            className={cx('more-item')}
                                            onClick={handlePrivacySettings}
                                        >
                                            {PRIVACY_SETTING}
                                        </div>
                                        <div
                                            className={cx('more-item')}
                                            onClick={handleDeleteVideo}
                                        >
                                            {DELETE}
                                        </div>
                                    </div>
                                </Wrapper>
                            )}
                        >
                            <div className={cx('more-btn')}>
                                <MoreIcon />
                            </div>
                        </HeadlessTippy>
                    )}
                </div>
                <div className={cx('video-statistics')}>
                    <p className={cx('description')}>
                        {descriptionFormater(currentVideo.description)}
                    </p>
                    {currentVideo.music && (
                        <p className={cx('music')}>
                            <MusicNoteIcon />
                            <span className={cx('text')}>{currentVideo.music}</span>
                        </p>
                    )}
                    <div className={cx('video-reaction')}>
                        <header>
                            <div
                                className={cx('like')}
                                onClick={() =>
                                    handleLikeVideo(currentVideo.is_liked, currentVideo.uuid)
                                }
                            >
                                <div className={cx('icon', { liked: currentVideo.is_liked })}>
                                    <HeartIcon width={20} height={20} />
                                </div>
                                {currentVideo.likes_count && (
                                    <strong className={cx('value')}>
                                        {numberFormater(currentVideo.likes_count)}
                                    </strong>
                                )}
                            </div>
                            <div className={cx('comment')}>
                                <div className={cx('icon')}>
                                    <CommentIcon width={20} height={20} />
                                </div>
                                {currentVideo.comments_count && (
                                    <strong className={cx('value')}>
                                        {numberFormater(currentVideo.comments_count)}
                                    </strong>
                                )}
                            </div>
                            <div className={cx('others')}>
                                {othersList.map((item) => {
                                    const { id, tooltip, icon, link } = item;
                                    const Wrapper = tooltip ? Tippy : 'div';
                                    const Child = 'link' in item ? 'a' : 'div';
                                    return (
                                        <Wrapper
                                            key={id}
                                            // interactive
                                            content={tooltip}
                                        >
                                            <Child
                                                href={link}
                                                target='_blank'
                                                className={cx('others-item')}
                                            >
                                                {icon}
                                            </Child>
                                        </Wrapper>
                                    );
                                })}
                            </div>
                        </header>
                        <div className={cx('video-link')}>
                            <div className={cx('link-wrapper')}>{currentLink}</div>
                            <button className={cx('copy-link-btn')} onClick={handleCopyLink}>
                                {COPY_LINK_BTN_LABEL}
                            </button>
                        </div>
                    </div>
                </div>
                {/* comments list */}
                {currentVideo && currentVideo?.allows?.indexOf('comment') !== -1 ? (
                    <>
                        <Comments
                            commentsCount={currentVideo.comments_count}
                            hostID={currentVideo.user.id}
                        />
                        <CommentInput
                            ref={inputRef}
                            value={comment}
                            maxLength={MAX_LENGTH}
                            onClick={handleCreateComment}
                            onChange={handleCommentChange}
                            placeholder={COMMENT_PLACEHOLDER}
                            btnLabel={COMMENT_BTN_LABEL}
                            at
                            emoji
                        />
                    </>
                ) : (
                    <div className={cx('notice')}>{COMMENTS_TURNED_OFF}</div>
                )}
            </div>
        </section>
    );
};

export default VideoDiscover;
