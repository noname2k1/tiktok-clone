import PropTypes from 'prop-types';
import React from 'react';
import styles from './Video.module.scss';
import classNames from 'classnames/bind';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLargeIcon, MuteIcon, PauseIcon, PlayIcon, UnMuteIcon } from '~/components/icons';
import VolumeTable from '~/components/Popper/VolumeTable';
import InputRange from '../InputRange';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

const ButtonSC = styled.button`
    background-color: var(--btn-in-video-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    ${({ placement }) => {
        switch (placement) {
            case 'top':
                return `transform: rotate(-90deg);`;
            case 'bottom':
                return `transform: rotate(90deg);`;
            case 'left':
                return `transform: rotate(-180deg);`;
            case 'right':
                return `transform: rotate(0deg);`;
            default:
                return `transform: rotate(0deg);`;
        }
    }}
    &:hover {
        background-color: var(--btn-in-video-hover-bg);
        opacity: 0.7;
    }
`;

const Video = React.forwardRef(
    ({ src, to, small = true, medium = false, large = false, poster, state }, ref) => {
        const videoRef = React.useRef();
        const [isPlaying, setIsPlaying] = React.useState(true);
        const [isMuted, setIsMuted] = React.useState(true);
        const [volume, setVolume] = React.useState(0.5);
        const [duration, setDuration] = React.useState(0);
        const [currentTime, setCurrentTime] = React.useState(0);
        const location = useLocation();

        const videos = useSelector((state) => state.video.videos);
        let prevVideoIndex, nextVideoIndex;
        const currentVideoIndex = videos.findIndex((video) => video.file_url === src);
        prevVideoIndex = currentVideoIndex > 0 ? currentVideoIndex - 1 : currentVideoIndex;
        nextVideoIndex =
            currentVideoIndex < videos.length - 1 ? currentVideoIndex + 1 : currentVideoIndex;

        const max = 100;
        // public methods
        React.useImperativeHandle(ref, () => ({
            // set
            play: () => {
                videoRef.current.play();
                setIsPlaying(true);
            },
            pause: () => {
                videoRef.current.pause();
                setIsPlaying(false);
            },
        }));

        React.useEffect(() => {
            const setCurrentTimePerSecond = setTimeout(() => {
                if (isPlaying) setCurrentTime(videoRef.current.currentTime);
                // console.log('currentTime', videoRef.current.currentTime);
            }, 1000);
            return () => {
                clearTimeout(setCurrentTimePerSecond);
            };
        }, [currentTime, isPlaying, location]);

        React.useEffect(() => {
            if (!isPlaying) {
                setIsPlaying(true);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [location]);

        // format time
        const covertTime = (time) => {
            const minutes = Math.floor(+time / 60);
            const seconds = Math.floor(+time - minutes * 60);
            return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        };

        // private methods
        const controls = {
            // get
            paused: () => {
                return videoRef.current.paused;
            },
            muted: () => {
                return videoRef.current.muted;
            },
            volume: () => {
                return videoRef.current.volume;
            },
            // set
            play: () => {
                videoRef.current.play();
                setIsPlaying(true);
                setVolume(0.5);
                setIsMuted(false);
            },
            pause: () => {
                videoRef.current.pause();
                setIsPlaying(false);
            },
            mute: () => {
                videoRef.current.muted = true;
                setIsMuted(true);
            },
            unmute: () => {
                videoRef.current.muted = false;
                setIsMuted(false);
            },
            changeVolume: (value) => {
                videoRef.current.volume = +value;
                videoRef.current.play();
                setIsPlaying(true);
            },
        };
        // handle events

        const handleLoadedVideo = () => {
            setDuration(videoRef.current.duration);
            setCurrentTime(videoRef.current.currentTime);
        };
        const handlePlayVideo = () => {
            if (controls.paused()) {
                controls.play();
            } else {
                controls.pause();
            }
        };

        const handleMuteVideo = () => {
            if (controls.muted()) {
                const volume = localStorage.getItem('volume');
                controls.changeVolume(volume);
                setVolume(volume);
                controls.unmute();
            } else {
                if (controls.volume() > 0) {
                    localStorage.setItem('volume', controls.volume());
                } else {
                    localStorage.setItem('volume', 0.5);
                }
                controls.mute();
                controls.changeVolume(0);
                setVolume(0);
            }
        };

        const handleVolumeChange = (value) => {
            setVolume(value);
            videoRef.current.volume = value;
            if (value === 0) {
                setIsMuted(true);
            } else {
                setIsMuted(false);
            }
        };

        const handleSeekVideo = (e) => {
            const value = Math.floor((e.target.value / max) * duration);
            // console.log('val: ' + value);
            videoRef.current.currentTime = value;
            setCurrentTime(value);
        };

        const classNames = cx('wrapper', {
            small,
            medium,
            large,
        });

        const WrapBtnComponent = to ? 'div' : ButtonSC;

        const controlsJSX = (
            <>
                {!to && <div className={cx('video-overlay')} onClick={handlePlayVideo}></div>}
                <div
                    className={cx('switch-btn', { 'un-hide': !isPlaying })}
                    onClick={handlePlayVideo}
                >
                    {isPlaying ? (
                        <>{medium ? <PauseIcon width='30px' height='30px' /> : <PauseIcon />}</>
                    ) : (
                        <>{medium ? <PlayIcon width='30px' height='30px' /> : <PlayIcon />}</>
                    )}
                </div>
                <VolumeTable
                    changeVolume={handleVolumeChange}
                    currentVolume={volume}
                    offset={[100, 40]}
                    small={small}
                    medium={medium}
                    large={large}
                >
                    <WrapBtnComponent
                        className={cx('mute-btn', { 'un-hide': !isPlaying })}
                        onClick={handleMuteVideo}
                    >
                        {isMuted ? <MuteIcon /> : <UnMuteIcon />}
                    </WrapBtnComponent>
                </VolumeTable>
                {!to && medium && (
                    <>
                        {currentVideoIndex > 0 && (
                            <WrapBtnComponent placement='top' className={cx('prev-btn')}>
                                <Link
                                    to={`/@${videos[prevVideoIndex].user.nickname}/video/${videos[prevVideoIndex].uuid}`}
                                    replace={true}
                                    state={state}
                                >
                                    <ArrowLargeIcon />
                                </Link>
                            </WrapBtnComponent>
                        )}
                        {currentVideoIndex < videos.length - 1 && (
                            <WrapBtnComponent placement='bottom' className={cx('next-btn')}>
                                <Link
                                    to={`/@${videos[nextVideoIndex].user.nickname}/video/${videos[nextVideoIndex].uuid}`}
                                    replace={true}
                                    state={state}
                                >
                                    <ArrowLargeIcon />
                                </Link>
                            </WrapBtnComponent>
                        )}
                    </>
                )}
                {(medium || large) && (
                    <div className={cx('timeline-container')}>
                        <InputRange
                            step={1}
                            min={0}
                            max={max}
                            height={'auto'}
                            valueState={[(currentTime / duration) * max || 0, handleSeekVideo]}
                        />
                        <span className={cx('time')}>
                            {covertTime(currentTime)} / {covertTime(duration)}
                        </span>
                    </div>
                )}
            </>
        );
        if (!to) {
            return (
                <div
                    className={classNames}
                    style={{
                        backgroundImage: `url(${poster})`,
                    }}
                >
                    <video
                        title='video'
                        src={src}
                        ref={videoRef}
                        muted
                        autoPlay
                        // controls
                        playsInline
                        loop
                        poster={poster}
                        onLoadedData={handleLoadedVideo}
                    ></video>
                    {controlsJSX}
                </div>
            );
        }
        return (
            <div className={classNames}>
                <Link to={to} state={state}>
                    <video
                        title='video'
                        src={src}
                        ref={videoRef}
                        muted
                        autoPlay
                        // controls
                        playsInline
                        loop
                        poster={poster}
                    ></video>
                </Link>
                {controlsJSX}
            </div>
        );
    }
);

Video.propTypes = {
    src: PropTypes.string,
    to: PropTypes.string,
    small: PropTypes.bool,
    medium: PropTypes.bool,
    large: PropTypes.bool,
    poster: PropTypes.string,
    state: PropTypes.object,
};

export default Video;
