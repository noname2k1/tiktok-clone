import React from 'react';
import styles from './DiscoverLive.module.scss';
import classNames from 'classnames/bind';
import { Link, useParams } from 'react-router-dom';
import Image from '../Image';
import {
    CollapseIcon,
    ExpandIcon,
    HorizontalArrow,
    MoreIcon,
    MusicNoteSmallIcon,
    PlayIcon,
    Rank1Icon,
    Rank2Icon,
    Rank3Icon,
    SendPlaneIcon,
    ShareIcon,
    TikTokGoldenCoinIcon,
    UsersGroupIcon,
    WarningIcon,
} from '../icons';
import * as videoService from '../../services/videoService';
import * as userService from '../../services/userService';
import Button from '../Button';
import { LoadingEffect } from '../effects';
import AccountPreview from '../SuggestedAccounts/AccountPreview';
import { chunkArray, numberFormater } from '~/helpers';
import gifts from './gifts';
import { useFollow, useMediaQuery } from '~/hooks';
import { useSelector } from 'react-redux';
import CommentInput from '../Custom/CommentInput';

const cx = classNames.bind(styles);

const DiscoverLive = () => {
    const params = useParams();
    const { nickname } = params;
    const commentRef = React.useRef(null);

    const FOLLOW = 'Follow';
    const FOLLOWING = 'Following';
    const WARNING = 'This LIVE is pre-recorded.';
    const LIVE_CHAT = 'LIVE chat';
    const LIVING = 'is LIVE';
    const WELCOME_CHAT_ROOM_MESSAGE =
        'Welcome to TikTok LIVE! Have fun interacting with others in real time. Hosts must be 18 or older to go LIVE. Viewers must be 18 or older to recharge and send Gifts. Remember to follow our Community Guidelines.';
    // const JOINED = 'joined';
    const LANGUAGE_CODE = 'en';
    const SEND = 'Send';
    const COIN_BALANCE = 'Coin Balance';
    const GET_COINS = 'Get Coins';
    const TOP_VIEWERS = 'Top Viewers';
    const RECOMMEND_LIVE_VIDEOS = 'Recommend LIVE videos';

    const [video, setVideo] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [showChatroom, setShowChatroom] = React.useState(true);
    const [currentGiftpage, setCurrentGiftpage] = React.useState(0);
    const [comment, setComment] = React.useState('');

    const { user } = useSelector((state) => state.auth);
    let { videos } = useSelector((state) => state.video);
    videos = videos.filter((video) => video.user.nickname !== nickname);

    const isMe = user?.nickname === nickname;
    const { followingUsers } = useSelector((state) => state.follow);
    const { followUser, unfollowUser } = useFollow();

    const name =
        video.user?.first_name || video.user?.last_name
            ? `${video.user?.first_name} ${video.user?.last_name}`
            : '';

    const isSmallMobile = useMediaQuery('(max-width: 340px)');
    const isMediumMobile = useMediaQuery('(max-width: 460px)');
    const isMobile = useMediaQuery('(max-width: 530px)');
    const isLargeMobile = useMediaQuery('(max-width: 620px)');
    const isSmallTablet = useMediaQuery('(max-width: 750px)');
    const isTablet = useMediaQuery('(max-width: 889px)');
    const isDesktop = useMediaQuery('(min-width: 890px)');
    const isMediumDesktop = useMediaQuery('(min-width: 1000px)');
    const isLargeDesktop = useMediaQuery('(min-width: 1280px)');
    const isExtraLargeDesktop = useMediaQuery('(min-width: 1410px)');
    const isExtraExtraLargeDesktop = useMediaQuery('(min-width: 1536px)');

    let giftList = [];
    let giftPage = 0;
    if (isExtraExtraLargeDesktop) {
        giftList = chunkArray(gifts, 10);
        giftPage = gifts.length / 10;
        if (!showChatroom) {
            giftList = chunkArray(gifts, 14);
            giftPage = gifts.length / 14;
        }
    } else if (isExtraLargeDesktop) {
        giftList = chunkArray(gifts, 8);
        giftPage = gifts.length / 8;
        if (!showChatroom) {
            giftList = chunkArray(gifts, 11);
            giftPage = gifts.length / 11;
        }
    } else if (isLargeDesktop) {
        giftList = chunkArray(gifts, 7);
        giftPage = gifts.length / 7;
        if (!showChatroom) {
            giftList = chunkArray(gifts, 10);
            giftPage = gifts.length / 10;
        }
    } else if (isMediumDesktop) {
        giftList = chunkArray(gifts, 6);
        giftPage = gifts.length / 6;
        if (!showChatroom) {
            giftList = chunkArray(gifts, 10);
            giftPage = gifts.length / 10;
        }
    } else if (isDesktop) {
        giftList = chunkArray(gifts, 8);
        giftPage = gifts.length / 8;
    } else if (isSmallMobile) {
        giftList = chunkArray(gifts, 1);
        giftPage = gifts.length / 1;
    } else if (isMediumMobile) {
        giftList = chunkArray(gifts, 2);
        giftPage = gifts.length / 2;
    } else if (isMobile) {
        giftList = chunkArray(gifts, 3);
        giftPage = gifts.length / 3;
    } else if (isLargeMobile) {
        giftList = chunkArray(gifts, 4);
        giftPage = gifts.length / 4;
    } else if (isSmallTablet) {
        giftList = chunkArray(gifts, 5);
        giftPage = gifts.length / 5;
    } else if (isTablet) {
        giftList = chunkArray(gifts, 7);
        giftPage = gifts.length / 7;
    }

    React.useEffect(() => {
        window.scrollTo(0, 0);
        userService
            .getAnUser(nickname)
            .then((user) => {
                videoService
                    .getAllVideosOfUser(user.id)
                    .then((videos) => {
                        setVideo(videos[0]);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [nickname]);

    React.useEffect(() => {
        document.title = `${name} (@${nickname}) ${LIVING} | TikTok Clone by ninhnam`;
    }, [name, nickname]);

    const handleFollow = () => {
        followUser(video.user.id);
    };

    const handleUnfollow = () => {
        unfollowUser(video.user.id);
    };

    const handleShowHideChatroom = () => {
        setShowChatroom(!showChatroom);
    };

    const handlePreviousGiftPage = () => {
        if (currentGiftpage > 0) {
            setCurrentGiftpage(currentGiftpage - 1);
        }
    };

    const handleNextGiftPage = () => {
        if (currentGiftpage < giftPage - 1) {
            setCurrentGiftpage(currentGiftpage + 1);
        }
    };

    const handleCommentChange = (e) => {
        setComment(e.target.textContent);
    };

    return (
        <div className={cx('container')}>
            {loading ? (
                <LoadingEffect />
            ) : (
                <>
                    {/* video */}
                    <div
                        className={cx('scrollable-wrapper', {
                            collapsed: !showChatroom,
                        })}
                    >
                        <div className={cx('video-wrapper')}>
                            <header className={cx('header')}>
                                <div className={cx('left')}>
                                    {video.user && (
                                        <AccountPreview user={video.user}>
                                            <div className={cx('avatar')}>
                                                <Image src={video.user?.avatar} medium rounded />
                                            </div>
                                        </AccountPreview>
                                    )}
                                    <div className={cx('info')}>
                                        {video.user && (
                                            <AccountPreview user={video.user}>
                                                <div className={cx('top')}>
                                                    <div className={cx('nickname')}>
                                                        {video.user?.nickname}
                                                    </div>
                                                    <div className={cx('name')}>{name}</div>
                                                </div>
                                            </AccountPreview>
                                        )}
                                        <div className={cx('bottom')}>
                                            <div className={cx('description')}>
                                                {video.description}
                                            </div>
                                            <div className={cx('viewers')}>
                                                <UsersGroupIcon />
                                                {numberFormater(video.likes_count)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('right')}>
                                    <Button className={cx('button')}>
                                        <ShareIcon />
                                    </Button>
                                    <Button className={cx('button')}>
                                        <MoreIcon />
                                    </Button>
                                    {user &&
                                        Object.keys(user).length > 0 &&
                                        !isMe &&
                                        !followingUsers.find(
                                            (user) => video.user?.id === user.id
                                        ) && (
                                            <Button
                                                primary
                                                medium
                                                className={cx('follow-btn')}
                                                onClick={handleFollow}
                                            >
                                                {FOLLOW}
                                            </Button>
                                        )}
                                    {user &&
                                        Object.keys(user).length > 0 &&
                                        !isMe &&
                                        followingUsers.find(
                                            (user) => video.user?.id === user.id
                                        ) && (
                                            <Button
                                                medium
                                                className={cx('follow-btn')}
                                                onClick={handleUnfollow}
                                            >
                                                {FOLLOWING}
                                            </Button>
                                        )}

                                    {!showChatroom && (
                                        <div
                                            className={cx('expand')}
                                            onClick={handleShowHideChatroom}
                                        >
                                            <ExpandIcon />
                                        </div>
                                    )}
                                </div>
                            </header>
                        </div>
                        <div className={cx('video')}>
                            <div className={cx('overlay')}></div>
                            <video
                                src={video.file_url}
                                poster={video.thumnail_url}
                                controls
                                // autoPlay
                            ></video>
                        </div>
                        <div className={cx('warning')}>
                            <WarningIcon />
                            {WARNING}
                        </div>
                        <div className={cx('gift-wrapper')}>
                            {currentGiftpage > 0 && (
                                <div
                                    className={cx('prev-gifts-page')}
                                    onClick={handlePreviousGiftPage}
                                >
                                    <HorizontalArrow />
                                </div>
                            )}
                            <div className={cx('gift-list')}>
                                {giftList &&
                                    giftList[currentGiftpage]?.map((gift) => (
                                        <div className={cx('gift-item')} key={gift.id}>
                                            <div className={cx('gift-image')}>
                                                <img
                                                    src={gift.icon}
                                                    alt='tiktok-clone-by-ninhnam'
                                                />
                                            </div>
                                            <div className={cx('name')}>
                                                {Object.keys(gift.name).length > 0 &&
                                                typeof gift.name === 'object'
                                                    ? gift.name[LANGUAGE_CODE]
                                                    : gift.name}
                                            </div>
                                            <div className={cx('coin')}>
                                                {gift.coin} {gift.coin > 1 ? 'coins' : 'coin'}
                                            </div>
                                            <Button primary className={cx('send-btn')}>
                                                {SEND}
                                            </Button>
                                        </div>
                                    ))}
                            </div>
                            {currentGiftpage < giftPage - 1 && (
                                <div className={cx('next-gifts-page')} onClick={handleNextGiftPage}>
                                    <HorizontalArrow />
                                </div>
                            )}
                        </div>
                        <div className={cx('coin-balance-wrapper')}>
                            <span className={cx('label')}>{COIN_BALANCE}:</span>
                            <div className={cx('coin-value')}>{numberFormater(2000)}</div>
                            <div className={cx('coin-icon')}>
                                <TikTokGoldenCoinIcon />
                            </div>
                            <Button outline>{GET_COINS}</Button>
                        </div>
                        <div className={cx('recommended-videos')}>
                            <h2 className={cx('title')}>{RECOMMEND_LIVE_VIDEOS}</h2>
                            <div className={cx('video-list')}>
                                {videos &&
                                    videos.map((video) => (
                                        <Link
                                            to={`/@${video.user.nickname}/live`}
                                            className={cx('video-item')}
                                            key={video.id}
                                        >
                                            <div className={cx('video-item-top')}>
                                                <div
                                                    className={cx('video-thumbnail')}
                                                    style={{
                                                        backgroundImage: `url(${video.thumb_url})`,
                                                    }}
                                                ></div>
                                                <video
                                                    src={video.file_url}
                                                    className={cx('video-element')}
                                                />
                                                <div className={cx('video-overlay')}>
                                                    <PlayIcon />
                                                </div>
                                            </div>
                                            <div className={cx('video-item-bottom')}>
                                                <div className={cx('avatar')}>
                                                    <Image
                                                        src={video.user?.avatar}
                                                        medium
                                                        rounded
                                                    />
                                                </div>
                                                <div className={cx('video-info')}>
                                                    <div className={cx('video-description')}>
                                                        {video.description}
                                                    </div>
                                                    <div className={cx('user-name')}>
                                                        {video.user?.first_name +
                                                            ' ' +
                                                            video.user?.last_name}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </div>
                    {/* chatroom */}
                    <div
                        className={cx('chatroom-wrapper', {
                            collapsed: !showChatroom,
                        })}
                    >
                        <header className={cx('chat-room-header')}>
                            <div className={cx('collapse-btn')} onClick={handleShowHideChatroom}>
                                <CollapseIcon />
                            </div>
                            <span className={cx('text')}>{LIVE_CHAT}</span>
                        </header>
                        <div className={cx('body')}>
                            <div className={cx('top-viewer')}>
                                <header className={cx('top-viewer-header')}>
                                    <span>{TOP_VIEWERS}</span>
                                    <HorizontalArrow />
                                </header>
                                <div className={cx('top-viewer-body')}>
                                    {video.user && (
                                        <AccountPreview user={video.user}>
                                            <div className={cx('top1')}>
                                                <Rank1Icon width='44' height='44' />
                                                <div className={cx('user')}>
                                                    <div className={cx('avatar')}>
                                                        <Image
                                                            src={video.user?.avatar}
                                                            medium
                                                            rounded
                                                        />
                                                    </div>
                                                    <div className={cx('nickname')}>
                                                        {video.user?.nickname}
                                                    </div>
                                                    <div className={cx('coin')}>
                                                        <TikTokGoldenCoinIcon />0
                                                    </div>
                                                </div>
                                            </div>
                                        </AccountPreview>
                                    )}
                                    <div className={cx('top2-and-top3')}>
                                        {video.user && (
                                            <>
                                                <AccountPreview user={video.user}>
                                                    <div className={cx('top2')}>
                                                        <Rank2Icon width='30' height='30' />
                                                        <div className={cx('user')}>
                                                            <div className={cx('avatar')}>
                                                                <Image
                                                                    src={video.user?.avatar}
                                                                    small
                                                                    rounded
                                                                />
                                                            </div>
                                                            <div className={cx('info')}>
                                                                <div className={cx('nickname')}>
                                                                    {video.user?.nickname}
                                                                </div>
                                                                <div className={cx('coin')}>
                                                                    <TikTokGoldenCoinIcon />0
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccountPreview>
                                                <AccountPreview user={video.user}>
                                                    <div className={cx('top3')}>
                                                        <Rank3Icon width='30' height='30' />
                                                        <div className={cx('user')}>
                                                            <div className={cx('avatar')}>
                                                                <Image
                                                                    src={video.user?.avatar}
                                                                    small
                                                                    rounded
                                                                />
                                                            </div>
                                                            <div className={cx('info')}>
                                                                <div className={cx('nickname')}>
                                                                    {video.user?.nickname}
                                                                </div>
                                                                <div className={cx('coin')}>
                                                                    <TikTokGoldenCoinIcon />0
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccountPreview>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={cx('messages')}>
                                <div className={cx('welcome-message', 'message')}>
                                    <div className={cx('icon-wrapper')}>
                                        <MusicNoteSmallIcon />
                                    </div>
                                    {WELCOME_CHAT_ROOM_MESSAGE}
                                </div>
                            </div>
                        </div>
                        <div className={cx('chat-box')}>
                            <CommentInput
                                value={comment}
                                ref={commentRef}
                                onChange={handleCommentChange}
                                emoji
                                btnLabel={<SendPlaneIcon width='24' height='24' />}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DiscoverLive;
