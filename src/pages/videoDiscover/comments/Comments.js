import 'tippy.js/dist/tippy.css';

import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ArrowDownIcon, HeartIcon, HeartSolidIcon } from '~/components/icons';
import Image from '~/components/Image';
import AccountPreview from '~/components/SuggestedAccounts/AccountPreview';
import useAuthModal from '~/hooks/useModal';
import * as commentService from '~/services/commentService';
import * as likeService from '~/services/likeService';

import styles from './Comments.module.scss';
import { numberFormater } from '~/helpers';
import MoreOptions from './MoreOptions';
import { setComments } from '~/store/slices/commentSlice';

const cx = classNames.bind(styles);

const Comments = ({ commentsCount, hostID }) => {
    const dispatch = useDispatch();
    const { openAuthModal } = useAuthModal();
    const nameRef = React.useRef(null);
    const params = useParams();
    const [loading, setLoading] = React.useState(true);
    const [replies, setReplies] = React.useState([]);
    const { token, user: currentUser } = useSelector((state) => state.auth);
    const { comments } = useSelector((state) => state.comment);

    React.useEffect(() => {
        const videoId = params.videoId;
        setLoading(true);
        commentService
            .getComments(videoId)
            .then((comments) => {
                dispatch(setComments(comments));
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.videoId, commentsCount]);

    const REPLIES_BTN_LABEL = 'View more replies';
    const COMMENT_NOT_FOUND = 'No comments yet';
    const UN_AUTHORIZED = 'You need to login to use comment.';
    const GO_TO_LOGIN = 'Login';
    const REPLY = 'Reply';
    const LOADING = 'Loading...';
    const CREATER = 'Creator';

    const handleOpenAuthModal = () => {
        openAuthModal();
    };

    const updateLikeState = (comment) => {
        const commentIndex = comments.findIndex((cmt) => cmt.id === comment.id);
        const commentList = JSON.parse(JSON.stringify(comments));
        commentList[commentIndex].is_liked = comment.is_liked;
        commentList[commentIndex].likes_count = comment.likes_count;
        dispatch(setComments(commentList));
    };

    const handleLikeComment = (likeState, commentID) => {
        if (!token || !Object.keys(currentUser).length > 0) {
            openAuthModal();
        }
        // unlike
        if (likeState) {
            likeService.unlikeComment(commentID).then((thisComment) => {
                updateLikeState(thisComment);
            });
        } else {
            // like
            likeService.likeComment(commentID).then((thisComment) => {
                updateLikeState(thisComment);
            });
        }
    };

    const handleMouseEnter = () => {
        nameRef.current.style.textDecoration = 'underline';
    };

    const handleMouseLeave = () => {
        nameRef.current.style.textDecoration = 'none';
    };

    const HighLightCreator = ({ text, children }) => {
        return (
            <>
                {children} <span className={cx('highlight-text')}>{text}</span>
            </>
        );
    };

    return (
        <div className={cx('comments')}>
            {token && Object.keys(currentUser).length > 0 && loading && (
                <div className={cx('loading')}>{LOADING}</div>
            )}
            {!loading &&
                token &&
                Object.keys(currentUser).length > 0 &&
                comments &&
                comments.length === 0 && <p className={cx('no-comment')}>{COMMENT_NOT_FOUND}</p>}
            {!loading &&
                token &&
                Object.keys(currentUser).length > 0 &&
                comments &&
                comments.length > 0 &&
                comments.map((commentItem) => {
                    // constants
                    const { id, user, comment, created_at, is_liked, likes_count } = commentItem;
                    const isCreator = user.id === hostID;
                    const isMe = currentUser.id === user.id;
                    const nameOthers =
                        user.first_name || user.last_name
                            ? `${user.first_name} ${user.last_name}`
                            : user.nickname;

                    return (
                        <div key={id} className={cx('comment')}>
                            <AccountPreview user={user} offset={[270, 0]} placement='bottom-end'>
                                <div
                                    className={cx('avatar')}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <Image src={user.avatar} alt={user.nickname} rounded medium />
                                </div>
                            </AccountPreview>
                            <div className={cx('comment-content')}>
                                <AccountPreview user={user} offset={[70, 20]}>
                                    <p className={cx('name')} ref={nameRef}>
                                        {isCreator ? (
                                            <HighLightCreator text={CREATER}>
                                                {nameOthers} ·
                                            </HighLightCreator>
                                        ) : (
                                            nameOthers
                                        )}
                                    </p>
                                </AccountPreview>
                                <p className={cx('content')}>{comment}</p>
                                <div className={cx('comment-features')}>
                                    <span>
                                        {' '}
                                        <Moment fromNow>{created_at}</Moment>
                                    </span>
                                    <span className={cx('reply-btn')}>{REPLY}</span>
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
                            <div className={cx('options')}>
                                <MoreOptions isCreator={isCreator} isMe={isMe} commentid={id} />
                                <div
                                    className={cx('heart', { liked: is_liked })}
                                    onClick={() => handleLikeComment(is_liked, id)}
                                >
                                    {is_liked ? (
                                        <HeartIcon width={20} height={20} />
                                    ) : (
                                        <HeartSolidIcon />
                                    )}
                                </div>
                                <div
                                    className={cx('value')}
                                    onClick={() => handleLikeComment(is_liked, id)}
                                >
                                    {numberFormater(likes_count)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            {(!token || Object.keys(currentUser).length === 0) && (
                <p className={cx('un-authorization')}>
                    {UN_AUTHORIZED}{' '}
                    <span className={cx('go-to-login')} onClick={handleOpenAuthModal}>
                        {GO_TO_LOGIN}
                    </span>
                </p>
            )}
        </div>
    );
};

Comments.propTypes = {
    commentsCount: PropTypes.number,
    hostID: PropTypes.number,
};

export default Comments;
