import React from 'react';
import classNames from 'classnames/bind';
import styles from './VideoDiscover.module.scss';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import * as commentService from '~/services/commentService';
import * as videoService from '~/services/videoService';
import Image from '~/components/Image';
import Button from '~/components/Button';
import { descriptionFormater, numberFormater } from '~/helpers';
import {
    AtIcon,
    CloseLargeIcon,
    CommentIcon,
    ArrowDownIcon,
    EmojiIcon,
    HeartIcon,
} from '~/components/icons';
import othersList from './othersList';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Toast from '~/components/Toast';
import Video from '~/components/Video';
import { useSelector } from 'react-redux';
import Moment from 'react-moment';
import styled from 'styled-components';
import routes from '~/config/routes';

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
    const divInputRef = React.useRef();
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const videos = useSelector((state) => state.video.videos);
    const hostName = 'https://www.tiktok.com';
    const currentLink = `${hostName}${location.pathname}`;
    const COMMENT_PLACEHOLDER = 'Add comment...';
    const COMMENT_BTN_LABEL = 'Post';
    const REPLIES_BTN_LABEL = 'View more replies';
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

    const [comments, setComments] = React.useState([]);
    const [replies, setReplies] = React.useState([]);
    const [comment, setComment] = React.useState('');
    const [appear, setAppear] = React.useState(false);

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
        commentService
            .getComments(params.videoId)
            .then((comments) => {
                setComments(comments);
            })
            .catch((err) => console.log(err));
    }, [params.videoId, videos]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(currentLink);
        setAppear(true);
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
        navigate(routes.home);
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
                    <div className={cx('avatar')}>
                        <Image
                            src={currentVideo.user.avatar}
                            alt={currentVideo.user.nickname}
                            rounded
                            medium
                        />
                    </div>
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
                    <Button outline medium>
                        Follow
                    </Button>
                </div>
                <div className={cx('video-statistics')}>
                    <p className={cx('description')}>
                        {descriptionFormater(currentVideo.description)}
                    </p>
                    {currentVideo.music && <p className={cx('music')}>{currentVideo.music}</p>}
                    <div className={cx('video-reaction')}>
                        <header>
                            <div className={cx('like')}>
                                <div className={cx('icon')}>
                                    <HeartIcon />
                                </div>
                                <strong className={cx('value')}>
                                    {numberFormater(currentVideo.likes_count)}
                                </strong>
                            </div>
                            <div className={cx('comment')}>
                                <div className={cx('icon')}>
                                    <CommentIcon />
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
                <div className={cx('comments')}>
                    {comments.map((commentItem) => {
                        const { id, user, comment, created_at } = commentItem;
                        return (
                            <div key={id} className={cx('comment')}>
                                <div className={cx('avatar')}>
                                    <Image src={user.avatar} alt={user.nickname} rounded medium />
                                </div>
                                <div className={cx('comment-content')}>
                                    <p className={cx('name')}>
                                        {user.first_name || user.last_name
                                            ? `${user.first_name} ${user.last_name}`
                                            : user.nickname}
                                    </p>
                                    <p className={cx('content')}>{comment}</p>
                                    <div className={cx('comment-features')}>
                                        <span>
                                            {' '}
                                            <Moment fromNow>{created_at}</Moment>
                                        </span>
                                        <span className={cx('reply-btn')}>Reply</span>
                                    </div>
                                    <p
                                        className={cx('view-more', {
                                            [id]: id,
                                        })}
                                    >
                                        {replies.length > 0 && (
                                            <>
                                                {REPLIES_BTN_LABEL}({replies.length})
                                                <ArrowDownIcon />
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
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
                    <div className={cx('comment-btn', { active: comment })}>
                        {COMMENT_BTN_LABEL}
                    </div>
                </div>
            </div>
            {/* copy link toast */}
            <Toast content='copied' appear={[appear, setAppear]} />
        </section>
    );
};

export default VideoDiscover;
