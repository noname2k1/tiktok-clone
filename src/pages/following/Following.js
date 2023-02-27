import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingEffect } from '~/components/effects';
import RecommendItem from '~/components/RecommendItem';
import * as videoService from '~/services/videoService';
import * as userService from '~/services/userService';
import { setVideos } from '~/store/slices/videoSlice';
import styles from './Following.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import Image from '~/components/Image';
import { CheckIcon } from '~/components/icons';
import { useFollow } from '~/hooks';
import { Link } from 'react-router-dom';
import GotoTop from '~/components/GotoTop';

const cx = classNames.bind(styles);

const Following = () => {
    const PAGE_TITLE = 'Following - tiktok clone by ninhnam';
    const FOLLOW = 'Follow';
    const FOLLOWING = 'Following';

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { followingUsers } = useSelector((state) => state.follow);
    const [suggestedUsers, setSuggestedUsers] = React.useState([]);
    const { videos } = useSelector((state) => state.video);
    const [loading, setLoading] = React.useState(true);

    const { followUser, unfollowUser } = useFollow();

    React.useEffect(() => {
        document.title = PAGE_TITLE;
        window.scrollTo(0, 0);
    }, []);

    React.useEffect(() => {
        if (followingUsers.length > 0 && token) {
            Promise.all(followingUsers.map((user) => videoService.getAllVideosOfUser(user.id)))
                .then((res) => {
                    const videos = res
                        .map((r) => r.map((v) => v))
                        .flat()
                        .sort((a, b) => {
                            if (a.created_at > b.created_at) {
                                return -1;
                            } else if (b.created_at > a.created_at) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
                    dispatch(setVideos(videos));
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => setLoading(false));
        } else {
            userService
                .getSuggestedUsers(1, 18)
                .then((res) => setSuggestedUsers(res))
                .catch((err) => console.log(err))
                .finally(() => setLoading(false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [followingUsers, videos]);

    const handleFollow = (event, userID) => {
        event.stopPropagation();
        event.preventDefault();
        if (followingUsers.find((followingUser) => followingUser.id === userID)) {
            unfollowUser(userID);
        } else followUser(userID);
    };

    return (
        <div className={cx('wrapper')}>
            {!loading &&
                token &&
                followingUsers.length > 0 &&
                videos &&
                videos.map((video) => <RecommendItem key={video.id} data={video} />)}
            <div className={cx('suggested-list')}>
                {!loading &&
                    (!token || followingUsers.length === 0) &&
                    suggestedUsers &&
                    suggestedUsers.map((user) => (
                        <Link
                            to={`/@${user.nickname}`}
                            className={cx('suggested-user')}
                            key={user.id}
                            style={{
                                backgroundImage: `url(${user.avatar})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }}
                        >
                            <div className={cx('overlay')}></div>
                            <div className={cx('user-info')}>
                                <Image src={user.avatar} large rounded />
                                <div className={cx('name')}>
                                    {user.first_name || user.last_name
                                        ? `${user.first_name} ${user.last_name}`
                                        : ''}
                                </div>
                                <div className={cx('nickname')}>
                                    {user.nickname} {user.tick && <CheckIcon />}
                                </div>
                                <Button
                                    primary={
                                        followingUsers.find(
                                            (followingUser) => followingUser.id === user.id
                                        ) && token
                                            ? false
                                            : true
                                    }
                                    long
                                    onClick={(e) => handleFollow(e, user.id)}
                                >
                                    {followingUsers.find(
                                        (followingUser) => followingUser.id === user.id
                                    ) && token
                                        ? FOLLOWING
                                        : FOLLOW}
                                </Button>
                            </div>
                        </Link>
                    ))}
            </div>
            {loading && <LoadingEffect />}
            <GotoTop />
        </div>
    );
};

export default Following;
