import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Video from '~/components/Video';
import { descriptionFormater, numberFormater } from '~/helpers';
import useAuthModal from '~/hooks/useModal';
import * as likeService from '~/services/likeService';
import * as followService from '~/services/followService';
import { setVideos } from '~/store/slices/videoSlice';

import Button from '../Button';
import { CommentIcon, HeartIcon, MusicNoteIcon, ShareIcon } from '../icons';
import Image from '../Image';
import AccountPreview from '../SuggestedAccounts/AccountPreview';
import styles from './RecommendItem.module.scss';
import { follow, unfollow } from '~/store/slices/followSlice';

const cx = classNames.bind(styles);

const RecommendItem = ({ data }) => {
    const dispatch = useDispatch();
    const [ref, inView] = useInView({
        threshold: 0.5,
    });

    const FOLLOW_BTN_LABEL = 'Follow';
    const FOLLOWING_BTN_LABEL = 'Following';

    const { videos } = useSelector((state) => state.video);
    const { openAuthModal } = useAuthModal();
    const { token, user } = useSelector((state) => state.auth);
    const { followingUsers } = useSelector((state) => state.follow);

    const updateLikeState = (video, videoID) => {
        const videoIndex = videos.findIndex((video) => video.uuid === videoID);
        const newVideos = JSON.parse(JSON.stringify(videos));
        newVideos[videoIndex].is_liked = video.is_liked;
        newVideos[videoIndex].likes_count = video.likes_count;
        dispatch(setVideos(newVideos));
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

    const updateFollowState = (user, userID) => {
        const newVideos = JSON.parse(JSON.stringify(videos));
        for (let i = 0; i < newVideos.length; i++) {
            if (newVideos[i].user.id === userID) {
                newVideos[i].user.is_followed = user.is_followed;
                newVideos[i].user.followers_count = user.followers_count;
            }
        }
        dispatch(setVideos(newVideos));
    };

    const handleFollowUser = (followState, userID) => {
        if (!token || !user) {
            openAuthModal();
        }
        // unlike
        if (followState) {
            followService.unfollow(userID).then((thisUser) => {
                updateFollowState(thisUser, userID);
                dispatch(unfollow(thisUser));
            });
        } else {
            // like
            followService.follow(userID).then((thisUser) => {
                updateFollowState(thisUser, userID);
                dispatch(follow(thisUser));
            });
        }
    };

    const videoRef = React.useRef();

    React.useEffect(() => {
        if (inView) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    }, [inView]);

    return (
        <div className={cx('wrapper')} ref={ref}>
            <AccountPreview user={data.user} placement='bottom-start'>
                <div className={cx('avatar-wrapper')}>
                    <Image src={data.user.avatar} alt={data.user.nickname} rounded large />
                </div>
            </AccountPreview>

            <div className={cx('post-container')}>
                <header className={cx('header')}>
                    <AccountPreview user={data.user}>
                        <div className={cx('user-info')}>
                            <p className={cx('nickname')}>{data.user.nickname}</p>
                            <p
                                className={cx('name')}
                            >{`${data.user.first_name} ${data.user.last_name}`}</p>
                        </div>
                    </AccountPreview>
                    <p className={cx('caption')}>{descriptionFormater(data.description)}</p>
                    {data.music && (
                        <p className={cx('music')}>
                            <MusicNoteIcon />
                            {data.music}
                        </p>
                    )}
                </header>
                <div className={cx('video-container')}>
                    <Video
                        src={data.file_url}
                        ref={videoRef}
                        poster={data.thumb_url}
                        to={`@${data.user.nickname}/video/${data.uuid}`}
                    />

                    <div className={cx('video-features')}>
                        <ul className={cx('features-list')}>
                            <li
                                className={cx('feature-item')}
                                onClick={() => handleLikeVideo(data.is_liked, data.uuid)}
                            >
                                <div className={cx('icon', { liked: data.is_liked })}>
                                    <HeartIcon />
                                </div>
                                <strong className={cx('value')}>
                                    {numberFormater(data.likes_count)}
                                </strong>
                            </li>
                            <li className={cx('feature-item')}>
                                <Link to={`@${data.user.nickname}/video/${data.uuid}`}>
                                    <div className={cx('icon')}>
                                        <CommentIcon />
                                    </div>
                                    <strong className={cx('value')}>
                                        {numberFormater(data.comments_count)}
                                    </strong>
                                </Link>
                            </li>
                            <li className={cx('feature-item')}>
                                <div className={cx('icon')}>
                                    <ShareIcon />
                                </div>
                                <strong className={cx('value')}>
                                    {numberFormater(data.shares_count)}
                                </strong>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <Button
                outline={!followingUsers.some((user) => user.id === data.user.id)}
                small
                className={cx('follow-btn')}
                onClick={() => {
                    const followState = data.user.is_followed;
                    handleFollowUser(followState, data.user.id);
                }}
            >
                {followingUsers.some((user) => user.id === data.user.id)
                    ? FOLLOWING_BTN_LABEL
                    : FOLLOW_BTN_LABEL}
            </Button>
        </div>
    );
};

RecommendItem.propTypes = {
    data: PropTypes.object,
};

export default RecommendItem;
