import 'tippy.js/dist/tippy.css';
import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import React from 'react';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Button from '~/components/Button';
import { AtIcon, CloseLargeIcon, CommentIcon, EmojiIcon, HeartIcon } from '~/components/icons';
import Image from '~/components/Image';
import AccountPreview from '~/components/SuggestedAccounts/AccountPreview';
import Toast from '~/components/Toast';
import Video from '~/components/Video';
import { descriptionFormater, numberFormater } from '~/helpers';
import * as videoService from '~/services/videoService';
import * as commentService from '~/services/commentService';
import * as likeService from '~/services/likeService';
import * as followService from '~/services/followService';

import Comments from './comments';
import othersList from './othersList';
import styles from './VideoDiscover.module.scss';
import config from '~/config';
import useAuthModal from '~/hooks/useModal';
import { setVideos } from '~/store/slices/videoSlice';
import { follow, unfollow } from '~/store/slices/followSlice';
import { setToast } from '~/store/slices/globalComponentSlice';

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
    const divInputRef = React.useRef();
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const videos = useSelector((state) => state.video.videos);
    const hostName = 'https://www.tiktok.com';
    const currentLink = `${hostName}${location.pathname}`;
    const COMMENT_PLACEHOLDER = 'Add comment...';
    const COMMENT_BTN_LABEL = 'Post';
    const FOLLOW_BTN_LABEL = 'Follow';
    const FOLLOWING_BTN_LABEL = 'Following';
    const COPIED = 'Copied';
    const MAX_LENGTH = 150;
    const [currentVideo, setCurrentVideo] = React.useState({
        music: '',
        description: 'loading...',
        user: {
            nickname: 'loading...',
            first_name: 'loading...',
            last_name: '...',
        },
    });

    const [comment, setComment] = React.useState('');
    const { openAuthModal } = useAuthModal();
    const { followingUsers } = useSelector((state) => state.follow);
    const { token, user } = useSelector((state) => state.auth);

    React.useEffect(() => {
        const videoId = params.videoId;
        const currrentVideo = videos.find((video) => video.uuid === videoId);
        if (!currrentVideo) {
            videoService.getVideo(videoId).then((video) => {
                setCurrentVideo(video);
            });
        } else {
            setCurrentVideo(currrentVideo);
        }
    }, [params.videoId, videos]);

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
        if (
            comment.length > MAX_LENGTH &&
            e.key !== 'Backspace' &&
            e.key !== 'Delete' &&
            e.key !== 'Enter' &&
            e.key !== 'ArrowLeft' &&
            e.key !== 'ArrowRight' &&
            e.key !== 'ArrowUp' &&
            e.key !== 'ArrowDown' &&
            e.key !== ''
        ) {
            e.preventDefault();
        }
    };

    const handleFocusInput = () => {
        divInputRef.current.focus();
    };

    const handleBackToPreviousPage = () => {
        navigate(config.routes.home);
    };

    const loadComments = async () => {
        commentService
            .getComments(currentVideo.uuid)
            .then((comments) => {
                const commentsCount = comments.length;
                // console.log(commentsCount);
                setCurrentVideo((prev) => ({ ...prev, comments_count: commentsCount }));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleCreateComment = () => {
        if (comment) {
            commentService.createComment(currentVideo.uuid, comment).then((data) => {
                loadComments();
            });
            setComment('');
            divInputRef.current.textContent = '';
        }
    };

    return (
        <section className={cx('wrapper')}>
            {/* left */}
            <div className={cx('video-container')}>
                <Video
                    medium
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
                                src={currentVideo.user.avatar}
                                alt={currentVideo.user.nickname}
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
                            <p className={cx('nickname')}>{currentVideo.user.nickname}</p>
                            <p className={cx('name')}>
                                {`${currentVideo.user.first_name} ${currentVideo.user.last_name}`}
                                {' · '}
                                <span className={cx('created-at')}>
                                    <Moment fromNow>{currentVideo.created_at}</Moment>
                                </span>
                            </p>
                        </div>
                    </AccountPreview>
                    <div className={cx('follow-btn')}>
                        <Button
                            outline={
                                !followingUsers.some((user) => user.id === currentVideo.user.id)
                            }
                            medium
                            onClick={() => {
                                const followState = followingUsers.some(
                                    (user) => user.id === currentVideo.user.id
                                );
                                handleFollowUser(followState, currentVideo.user.id);
                            }}
                        >
                            {followingUsers.some((user) => user.id === currentVideo.user.id)
                                ? FOLLOWING_BTN_LABEL
                                : FOLLOW_BTN_LABEL}
                        </Button>
                    </div>
                </div>
                <div className={cx('video-statistics')}>
                    <p className={cx('description')}>
                        {descriptionFormater(currentVideo.description)}
                    </p>
                    {currentVideo.music && <p className={cx('music')}>{currentVideo.music}</p>}
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
                                <strong className={cx('value')}>
                                    {numberFormater(currentVideo.likes_count)}
                                </strong>
                            </div>
                            <div className={cx('comment')}>
                                <div className={cx('icon')}>
                                    <CommentIcon width={20} height={20} />
                                </div>
                                <strong className={cx('value')}>
                                    {numberFormater(currentVideo.comments_count)}
                                </strong>
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
                                Copy link
                            </button>
                        </div>
                    </div>
                </div>
                {/* comments list */}
                <Comments
                    commentsCount={currentVideo.comments_count}
                    hostID={currentVideo.user.id}
                />
                <div className={cx('comment-box')}>
                    <div className={cx('comment-input')}>
                        {!comment && (
                            <div className={cx('comment-placeholder')} onClick={handleFocusInput}>
                                {COMMENT_PLACEHOLDER}
                            </div>
                        )}
                        {/* input area */}
                        <div
                            className={cx('comment-input-area')}
                            contentEditable
                            onInput={handleCommentChange}
                            onKeyDown={handleCommentChange}
                            ref={divInputRef}
                            spellCheck='false'
                        />
                        <div className={cx('comment-tools')}>
                            <div className={cx('comment-tools-item')}>
                                <AtIcon />
                            </div>
                            <div className={cx('comment-tools-item')}>
                                <EmojiIcon />
                            </div>
                        </div>
                        {comment.length > 44 && (
                            <div
                                className={cx('text-count', {
                                    max: comment.length >= MAX_LENGTH,
                                })}
                            >
                                {comment.length > MAX_LENGTH ? MAX_LENGTH : comment.length}/
                                {MAX_LENGTH}
                            </div>
                        )}
                    </div>
                    <div
                        className={cx('comment-btn', { active: comment })}
                        onClick={handleCreateComment}
                    >
                        {COMMENT_BTN_LABEL}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VideoDiscover;
