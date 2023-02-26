import React from 'react';
import styles from './Live.module.scss';
import classNames from 'classnames/bind';
import * as videoService from '~/services/videoService';
import { useDispatch, useSelector } from 'react-redux';
import { setTotalPages, setVideos } from '~/store/slices/videoSlice';
import LiveVideo from './LiveVideo';
import { LoadingEffect } from '~/components/effects';

const cx = classNames.bind(styles);

const Live = () => {
    const dispatch = useDispatch();
    const LIVE = 'Live';
    const FOR_YOU = 'For you';
    const FOLLOWING = 'Following';

    const { videos } = useSelector((state) => state.video);

    const [type, setType] = React.useState(FOR_YOU);
    const [autoPlay, setAutoPlay] = React.useState(true);
    const [expand, setExpand] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const setVideosToVideoStore = (videos, totalPages) => {
        dispatch(setVideos(videos));
        dispatch(setTotalPages(totalPages));
    };

    const handleTypeChange = (type) => {
        setType(type);
    };

    const handleExpand = () => {
        setExpand(true);
    };

    const handleCollapse = () => {
        setExpand(false);
    };

    React.useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `${LIVE} | TikTok`;
        videoService
            .getVideos(1)
            .then((res) => {
                setLoading(false);
                const initVideos = res.data;
                const totalPages = res.meta.pagination.total_pages;
                setVideosToVideoStore(initVideos, totalPages);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    return (
        <div className={cx('wrapper')}>
            {/* nav-type */}
            <nav className={cx('navigation-wrapper')}>
                <div
                    className={cx('navigation', {
                        hide: expand,
                    })}
                    onMouseEnter={handleExpand}
                >
                    <div
                        className={cx('navigation-item', {
                            active: type === FOR_YOU,
                        })}
                    ></div>
                    <div
                        className={cx('navigation-item', {
                            active: type === FOLLOWING,
                        })}
                    ></div>
                </div>
                <div
                    className={cx('navigation-expand', { show: expand })}
                    onMouseEnter={handleExpand}
                    onMouseLeave={handleCollapse}
                >
                    <div
                        className={cx('navigation-expand-item', {
                            active: type === FOR_YOU,
                        })}
                        onClick={() => handleTypeChange(FOR_YOU)}
                    >
                        {FOR_YOU}
                    </div>
                    <div
                        className={cx('navigation-expand-item', {
                            active: type === FOLLOWING,
                        })}
                        onClick={() => handleTypeChange(FOLLOWING)}
                    >
                        {FOLLOWING}
                    </div>
                </div>
            </nav>
            {loading && <LoadingEffect />}
            {/* container <videos> */}
            {!loading && (
                <div className={cx('container')}>
                    {/* video */}
                    {videos.map((video, index) => (
                        <LiveVideo
                            video={video}
                            key={video.uuid}
                            autoplay={{ autoPlay, setAutoPlay }}
                            videosLength={videos.length}
                            currentVideoIndex={index}
                            prevVideo={videos[index - 1]}
                            nextVideo={videos[index + 1]}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Live;
