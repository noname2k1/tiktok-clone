import PropTypes from 'prop-types';

import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import images from '~/assets/images';
import { CommentIcon, HeartIcon, MusicNoteIcon, SearchIcon, ShareIcon } from '../icons';
import Image from '../Image';

const NavBarHeight = 60;
const Wrapper = styled.div`
    background-image: url(${images.smartphoneFrame});
    background-size: cover;
    position: relative;
    width: 280px;
    height: 580px;
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const NavBar = styled.div`
    background-image: url(${images.smartphoneNavBar});
    background-size: contain;
    background-repeat: no-repeat;
    width: 100%;
    height: ${NavBarHeight}px;
`;

const VideoWrapper = styled.div`
    width: 100%;
    height: calc(100% - ${NavBarHeight}px);
    position: relative;
    overflow: hidden;
`;

const Video = styled.video`
    position: absolute;
    top: 10px;
    left: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 10px);
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
`;

const MobileHeader = styled.div`
    position: absolute;
    top: 40px;
    width: 100%;
    opacity: 0.8;
    user-select: none;
    cursor: default;
    nav {
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 100%;
        font-size: 1.4rem;
        .nav-item + .nav-item {
            margin-left: 20px;
        }
        .nav-item.search {
            position: absolute;
            right: 20px;
        }
        .selecting {
            border-bottom: 2px solid #fff;
        }
    }
`;

const VerticalBar = styled.div`
    position: absolute;
    right: 20px;
    bottom: 20px;
    opacity: 0.5;
    user-select: none;
    cursor: default;
    nav {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #fff;
        .nav-item + .nav-item {
            margin-top: 10px;
        }
        .nav-item.circle {
            width: 45px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background-color: #000;
            animation: ${(props) => (props.playing ? 'spin 2s linear infinite' : 'none')};
        }
        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    }
`;

const HorizontalBar = styled.div`
    position: absolute;
    bottom: 20px;
    color: #fff;
    width: 100%;
    left: 20px;
    bottom: 20px;
    opacity: 0.5;
    user-select: none;
    cursor: default;
    .nick-name {
    }
    .caption {
        width: 50%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .music {
        display: flex;
        align-items: center;
        position: relative;
        width: 60%;
        height: 20px;
    }
    .icon {
        display: flex;
        align-items: center;
    }
    .music-text {
        margin-left: 10px;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        white-space: nowrap;
        position: absolute;
        display: flex;
        overflow: hidden;
        align-items: center;
        text-overflow: ellipsis;
        width: 160px;
    }
`;

const MobilePreview = ({ video, videoObj, onError }) => {
    const videoRef = React.useRef(null);
    const [showControls, setShowControls] = React.useState(true);
    const { user } = useSelector((state) => state.auth);
    const [isPlaying, setIsPlaying] = React.useState(false);
    // console.log(isPlaying);

    const handleShowControls = () => {
        setShowControls(true);
    };

    const handleHideControls = () => {
        setShowControls(false);
    };

    const handlePlaying = () => {
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const MusicText = isPlaying ? 'marquee' : 'div';

    return (
        <Wrapper>
            <VideoWrapper
                onMouseEnter={handleShowControls}
                onTouchStart={handleShowControls}
                onMouseLeave={handleHideControls}
            >
                <Video
                    ref={videoRef}
                    src={video}
                    controls={showControls}
                    // loop
                    onError={onError}
                    preload='none'
                    onPause={handlePause}
                    onPlaying={handlePlaying}
                    playsInline
                ></Video>
                <MobileHeader hidden={showControls}>
                    <nav>
                        <div className='nav-item'>Following</div>
                        <div className='nav-item selecting'>For you</div>
                        <div className='nav-item search'>
                            <SearchIcon />
                        </div>
                    </nav>
                </MobileHeader>
                <VerticalBar playing={isPlaying} hidden={showControls}>
                    <nav>
                        <div className='nav-item'>
                            <Image src={user.avatar} alt={user.nickname} medium />
                        </div>
                        <div className='nav-item'>
                            <HeartIcon />
                        </div>
                        <div className='nav-item'>
                            <CommentIcon />
                        </div>
                        <div className='nav-item'>
                            <ShareIcon />
                        </div>
                        <div className='nav-item circle'>
                            <Image src={user.avatar} alt={user.nickname} small />
                        </div>
                    </nav>
                </VerticalBar>
                <HorizontalBar hidden={showControls}>
                    <div className='nick-name'>@{user.nickname}</div>
                    <div className='caption'>{videoObj.name}</div>
                    <div className='music'>
                        <div className='icon'>
                            <MusicNoteIcon />
                        </div>
                        <MusicText
                            className='music-text'
                            behavior='scroll'
                            direction='left'
                        >{`${user.first_name} ${user.last_name} original sound`}</MusicText>
                    </div>
                </HorizontalBar>
            </VideoWrapper>
            <NavBar />
        </Wrapper>
    );
};

MobilePreview.propTypes = {
    video: PropTypes.string,
    videoObj: PropTypes.object,
    onError: PropTypes.func.isRequired,
};

export default MobilePreview;
