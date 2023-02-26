import PropTypes from 'prop-types';

import classNames from 'classnames/bind';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Link, useNavigate } from 'react-router-dom';

import styles from './Live.module.scss';
import { ArrowLargeIcon, UsersGroupIcon, WaveIcon } from '~/components/icons';
import Tooltip from '~/components/Tooltip';
import { numberFormater } from '~/helpers';

const cx = classNames.bind(styles);

const LiveVideo = ({
    video,
    autoplay = {},
    currentVideoIndex = 0,
    videosLength = 0,
    prevVideo,
    nextVideo,
}) => {
    const { autoPlay, setAutoPlay } = autoplay;
    const navigate = useNavigate();
    const videoRef = React.useRef(null);
    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    const AUTO_PLAY = 'Auto play';
    const CLICK_TO_WATCH_LIVE = 'Click to watch live';
    const LIVE = 'Live';
    const AUTO_WATCH_LIVE_TIME = 20;
    const AUTO_WATCH_LIVE = `Auto watch live for ${AUTO_WATCH_LIVE_TIME} seconds`;

    const [controls, setControls] = React.useState(false);

    const handleAutoPlay = (e) => {
        e.preventDefault();
        setAutoPlay(!autoPlay);
    };

    const handleVideoMouseEnter = () => {
        setControls(true);
    };

    const handleVideoMouseLeave = () => {
        setControls(false);
    };

    const handlePrevVideo = (e) => {
        e.preventDefault();
        if (currentVideoIndex > 0) {
            document.getElementById(prevVideo.uuid).scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    };

    const handleNextVideo = (e) => {
        e.preventDefault();
        if (currentVideoIndex < videosLength - 1) {
            document.getElementById(nextVideo.uuid).scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    };

    React.useEffect(() => {
        let timer;
        if (inView) {
            videoRef.current.play();
            if (autoPlay) {
                timer = setTimeout(() => {
                    navigate(`/@${video.user.nickname}/live`);
                }, AUTO_WATCH_LIVE_TIME * 1000);
            }
        } else {
            videoRef.current.pause();
        }
        return () => {
            clearTimeout(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView, autoPlay]);

    return (
        <Link
            to={`/@${video.user.nickname}/live`}
            className={cx('video-wrapper')}
            ref={ref}
            onMouseEnter={handleVideoMouseEnter}
            onMouseLeave={handleVideoMouseLeave}
            id={video.uuid}
        >
            <div className={cx('overlay')}></div>
            <video
                src={video.file_url}
                className={cx('video')}
                ref={videoRef}
                // autoPlay={autoPlay}
                controls={controls}
                loop={autoPlay}
            />
            <div className={cx('video-arrows')}>
                <div
                    placement='top'
                    className={cx('prev-btn', {
                        active: currentVideoIndex > 0,
                    })}
                    onClick={handlePrevVideo}
                >
                    <ArrowLargeIcon />
                </div>

                <div
                    placement='bottom'
                    className={cx('next-btn', {
                        active: currentVideoIndex < videosLength - 1,
                    })}
                    onClick={handleNextVideo}
                >
                    <ArrowLargeIcon />
                </div>
            </div>
            <div className={cx('tip')}>
                <div className={cx('line')}></div>
                <span>
                    <WaveIcon /> {CLICK_TO_WATCH_LIVE}
                </span>
                <div className={cx('line')}></div>
            </div>
            <div className={cx('video-tools')}>
                <div className={cx('video-tools-left')}>
                    <div className={cx('live')}>{LIVE}</div>
                    <div className={cx('user')}>
                        <div className={cx('nickname')}>@{video.user.nickname}</div>
                        <div className={cx('viewer')}>
                            <UsersGroupIcon />
                        </div>
                        <div className={cx('viewer-count')}>
                            {numberFormater(video.likes_count)}
                        </div>
                    </div>
                    <p className={cx('description')}>{video.description}</p>
                </div>
                <div className={cx('video-tools-right')}>
                    <div className={cx('item')} onClick={handleAutoPlay}>
                        <Tooltip content={AUTO_WATCH_LIVE} placement='top'>
                            <div className={cx('auto-play')}>
                                <span>{AUTO_PLAY}</span>: {autoPlay ? 'ON' : 'OFF'}
                            </div>
                        </Tooltip>
                    </div>
                    <div className={cx('item')}></div>
                </div>
            </div>
        </Link>
    );
};

LiveVideo.propTypes = {
    video: PropTypes.object.isRequired,
    autoplay: PropTypes.object,
    currentVideoIndex: PropTypes.number,
    videosLength: PropTypes.number,
    prevVideo: PropTypes.object,
    nextVideo: PropTypes.object,
};

export default LiveVideo;
