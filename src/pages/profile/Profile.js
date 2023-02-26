import React from 'react';
import styles from './Profile.module.scss';
import classNames from 'classnames/bind';
import Image from '~/components/Image';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as userService from '~/services/userService';
import * as videoService from '~/services/videoService';
import { numberFormater } from '~/helpers';
import Button from '~/components/Button';
import { EditIcon, LockIcon, PersonIcon, UserCheckIcon } from '~/components/icons';
import Tooltip from '~/components/Tooltip';
import { useFollow, useModal } from '~/hooks';
import { setSelectedUser } from '~/store/slices/userSlice';
import { setCurrentUser } from '~/store/slices/authSlice';
import { setVideos, setVideosOfUser } from '~/store/slices/videoSlice';
import { LoadingEffect } from '~/components/effects';
import GotoTop from '~/components/GotoTop';

const cx = classNames.bind(styles);

const Profile = () => {
    const dispatch = useDispatch();
    const { openEditProfileModal } = useModal();
    const params = useParams();
    const { pathname } = useLocation();
    const { nickname } = params;
    const { selectedUser } = useSelector((state) => state.user);
    const { token, user } = useSelector((state) => state.auth);
    const { followingUsers } = useSelector((state) => state.follow);
    const { videosOfUser } = useSelector((state) => state.video);
    const [isLoading, setIsLoading] = React.useState(true);
    let isMyProfile = false;
    if (token && Object.keys(user).length > 0) {
        isMyProfile = user.nickname === selectedUser.nickname;
    }
    const { followUser, unfollowUser } = useFollow();

    const [shareVideoType, setShareVideoType] = React.useState('');

    const isFollowing = followingUsers.some((user) => user.id === selectedUser.id);

    const myNickname = user.nickname;

    const othersNickname = selectedUser.nickname;

    const myName =
        user.first_name || user.last_name ? `${user.first_name} ${user.last_name}` : null;
    const name =
        selectedUser.first_name || selectedUser.last_name
            ? `${selectedUser.first_name} ${selectedUser.last_name}`
            : null;

    const FOLLOWING = 'Following';
    const FOLLOWER = 'Followers';
    const LIKES = 'Likes';
    const EDIT_PROFILE = 'Edit Profile';
    const FOLLOWED_LABEL = 'Message';
    const NOT_FOLLOWED_LABEL = 'Follow';
    const UN_FOLLOWED_LABEL = 'Unfollow';
    const NO_BIO = 'No bio yet.';
    const VIDEOS = 'Videos';
    const UPLOAD_VIDEO = 'Upload your first video';
    const VIDEO_PLACE = 'Your videos will appear here';
    const NO_VIDEOS = 'No videos yet.';

    const myBio = user.bio ? user.bio : NO_BIO;
    const othersBio = selectedUser.bio ? selectedUser.bio : NO_BIO;

    const statitics = [
        {
            id: 1,
            label: FOLLOWING,
            value: selectedUser.followings_count || 0,
        },
        {
            id: 2,
            label: FOLLOWER,
            value: selectedUser.followers_count || 0,
        },
        {
            id: 3,
            label: LIKES,
            value: selectedUser.likes_count || 0,
        },
    ];

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    React.useEffect(() => {
        if (selectedUser.nickname) {
            document.title = `${name ? name : ''} (@${selectedUser.nickname}) • Tiktok clone`;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedUser]);

    // console.log('avatar', avatar);
    React.useEffect(() => {
        setShareVideoType('');
        if (isMyProfile) {
            userService
                .getMyProfile()
                .then((res) => {
                    const { avatar, ...userLeft } = res;
                    const myProfile = { avatar: user.avatar, ...userLeft };
                    dispatch(setCurrentUser(myProfile));
                    // dispatch(setCurrentUser(res));
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        userService
            .getAnUser(nickname)
            .then((res) => {
                dispatch(setSelectedUser(res));
            })
            .catch((err) => {
                console.log(err);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nickname]);
    React.useEffect(() => {
        setIsLoading(true);
        videoService
            .getAllVideosOfUser(selectedUser.id)
            .then((res) => {
                dispatch(setVideosOfUser(res));
                dispatch(setVideos(res));
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            })
            .catch((err) => {
                console.log(err);
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedUser.id]);

    React.useEffect(() => {
        setIsLoading(true);
        if (shareVideoType === LIKES) {
            videoService
                .getVideosUserLiked(selectedUser.id)
                .then((res) => {
                    dispatch(setVideosOfUser(res));
                    dispatch(setVideos(res));
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 1000);
                })
                .catch((err) => {
                    console.log(err);
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 1000);
                });
        } else {
            videoService
                .getAllVideosOfUser(selectedUser.id)
                .then((res) => {
                    dispatch(setVideosOfUser(res));
                    dispatch(setVideos(res));
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 1000);
                })
                .catch((err) => {
                    console.log(err);
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 1000);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shareVideoType]);

    const handleSetShareVideoType = (type) => {
        setShareVideoType(type);
    };

    const handleFollow = () => {
        if (!isMyProfile && !isFollowing && selectedUser.id) {
            followUser(selectedUser.id);
        }
    };

    const handleUnfollow = () => {
        if (!isMyProfile && isFollowing && selectedUser.id) {
            unfollowUser(selectedUser.id);
        }
    };

    const handleHoverVideo = (e) => {
        const video = e.target;
        if (video.paused) {
            video.play();
        }
    };

    const handleLeaveVideo = (e) => {
        const video = e.target;
        if (!video.paused) {
            video.load();
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('user-info')}>
                <div className={cx('user-image')}>
                    <Image
                        src={isMyProfile ? user.avatar : selectedUser.avatar}
                        alt={selectedUser.nickname}
                        extraLarge
                        rounded
                    />
                </div>
                <div className={cx('user-text')}>
                    {(myNickname || othersNickname) && (
                        <h1 className={cx('user-nickname')}>
                            {isMyProfile ? myNickname : othersNickname}
                        </h1>
                    )}
                    {(name || myName) && (
                        <h3 className={cx('user-name')}>{isMyProfile ? myName : name}</h3>
                    )}
                    {isMyProfile && (
                        <Button className={cx('edit-btn')} small onClick={openEditProfileModal}>
                            <EditIcon /> <span className={cx('label')}>{EDIT_PROFILE}</span>
                        </Button>
                    )}
                    {!isMyProfile && !isFollowing && (
                        <Button className={cx('edit-btn')} primary medium onClick={handleFollow}>
                            <span className={cx('label')}>{NOT_FOLLOWED_LABEL}</span>
                        </Button>
                    )}
                    {!isMyProfile && isFollowing && (
                        <div className={cx('edit-btn-container')}>
                            <Button className={cx('edit-btn')} outline flex1>
                                <span className={cx('label')}>{FOLLOWED_LABEL}</span>
                            </Button>
                            <Tooltip content={UN_FOLLOWED_LABEL}>
                                <Button className={cx('edit-btn')} square onClick={handleUnfollow}>
                                    <UserCheckIcon />
                                </Button>
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>
            <div className={cx('user-statitics')}>
                {statitics.map(({ id, label, value }) => (
                    <div className={cx('statitics-item')} key={id}>
                        <span className={cx('statitics-value')}>{numberFormater(value)}</span>
                        <span className={cx('statitics-label')}>{label}</span>
                    </div>
                ))}
            </div>
            <p className={cx('user-bio')}>{isMyProfile ? myBio : othersBio}</p>
            <div className={cx('share-video-container')}>
                <div className={cx('share-video-type')}>
                    <div
                        className={cx('share-video-type-item', {
                            active: !shareVideoType,
                            default: true,
                        })}
                        onClick={() => handleSetShareVideoType('')}
                    >
                        {VIDEOS}
                    </div>
                    <div
                        className={cx('share-video-type-item', {
                            active: shareVideoType === LIKES,
                            likes: true,
                        })}
                        onClick={() => handleSetShareVideoType(LIKES)}
                    >
                        {/* <LockIcon /> */}
                        {LIKES}
                    </div>
                    <div className={cx('line')}></div>
                </div>
            </div>
            <div className={cx('user-videos')}>
                {isLoading && <LoadingEffect className={cx('loading')} />}
                {!isLoading &&
                    videosOfUser.map((video) => (
                        <Link
                            className={cx('col')}
                            key={video.id}
                            to={`/@${nickname}/video/${video.uuid}`}
                            state={{ from: pathname }}
                        >
                            <video
                                src={video.file_url}
                                muted
                                playsInline
                                poster={video.thumb_url}
                                loop
                                onMouseEnter={handleHoverVideo}
                                onMouseLeave={handleLeaveVideo}
                            ></video>
                        </Link>
                    ))}
                {!isLoading && isMyProfile && videosOfUser.length === 0 && (
                    <div className={cx('my-videos-empty')}>
                        <PersonIcon
                            width='120'
                            height='120'
                            style={{
                                fillOpacity: 0.34,
                                marginTop: '200px',
                                marginBottom: '20px',
                            }}
                        />
                        <h2>{UPLOAD_VIDEO}</h2>
                        <h4>{VIDEO_PLACE}</h4>
                    </div>
                )}
                {!isLoading && !isMyProfile && videosOfUser.length === 0 && (
                    <div className={cx('my-videos-empty')}>
                        <PersonIcon
                            width='120'
                            height='120'
                            style={{
                                fillOpacity: 0.34,
                                marginTop: '200px',
                                marginBottom: '20px',
                            }}
                        />
                        <h2>{NO_VIDEOS}</h2>
                    </div>
                )}
            </div>
            <GotoTop />
        </div>
    );
};

export default Profile;
