import PropTypes from 'prop-types';
import React from 'react';
import Tippy from '@tippyjs/react/headless';
import styles from './AccountPreview.module.scss';
import classNames from 'classnames/bind';
import { CheckIcon } from '../../icons';
import { Wrapper } from '../../Popper';
import Button from '../../Button';
import Image from '~/components/Image';
import { Link } from 'react-router-dom';
import { numberFormater } from '~/helpers';
import { useDispatch, useSelector } from 'react-redux';
import useAuthModal from '~/hooks/useModal';
import * as followService from '~/services/followService';
import { follow, unfollow } from '~/store/slices/followSlice';

const cx = classNames.bind(styles);

const AccountPreview = ({ children, user, placement = 'bottom', offset = [-20, 0] }) => {
    const dispatch = useDispatch();
    const { followingUsers } = useSelector((state) => state.follow);
    const { token, user: currentUser } = useSelector((state) => state.auth);
    const { openAuthModal } = useAuthModal();

    const renderPreview = (attrs) => {
        const FOLLOW_BTN_LABEL = 'Follow';
        const FOLLOWING_BTN_LABEL = 'Following';

        const handleFollow = (e) => {
            e.preventDefault();
            if (!token || !currentUser) {
                openAuthModal();
            }
            if (followingUsers.some((followingUser) => followingUser.id === user.id)) {
                // unfollow
                followService.unfollow(user.id).then((thisUser) => {
                    dispatch(unfollow(thisUser));
                });
            } else {
                // follow
                followService.follow(user.id).then((thisUser) => {
                    dispatch(follow(thisUser));
                });
            }
        };

        return (
            <div {...attrs}>
                <Wrapper className={cx('account-preview')}>
                    <header className={cx('header')}>
                        {/* avatar */}
                        <Image
                            src={user.avatar}
                            alt={user.nickname}
                            className={cx('avatar')}
                            medium
                            rounded
                        />
                        {/* follow button */}
                        {token &&
                            Object.keys(currentUser).length > 0 &&
                            currentUser.id !== user.id && (
                                <Button
                                    primary={
                                        !followingUsers.some(
                                            (followingUser) => followingUser.id === user.id
                                        )
                                    }
                                    className={cx('follow-btn')}
                                    onClick={handleFollow}
                                >
                                    {followingUsers.some(
                                        (followingUser) => followingUser.id === user.id
                                    )
                                        ? FOLLOWING_BTN_LABEL
                                        : FOLLOW_BTN_LABEL}
                                </Button>
                            )}
                    </header>
                    {/* info */}
                    <div className={cx('info')}>
                        <p className={cx('nickname')}>
                            <strong>{user.nickname}</strong>
                            {user.tick && <CheckIcon className={cx('check')} />}
                        </p>
                        <p className={cx('name')}>{`${user.first_name} ${user.last_name}`}</p>
                    </div>
                    <p className={cx('statistical')}>
                        <span className={cx('stat-item')}>
                            <strong className={cx('value')}>
                                {numberFormater(+user.followers_count)}
                            </strong>
                            <span className={cx('label')}>Followers</span>
                        </span>
                        <span className={cx('stat-item')}>
                            <strong className={cx('value')}>
                                {numberFormater(+user.likes_count)}
                            </strong>
                            <span className={cx('label')}>Likes</span>
                        </span>
                    </p>
                    {user.bio && (
                        <footer className={cx('bio')}>
                            <p>{user.bio}</p>
                        </footer>
                    )}
                </Wrapper>
            </div>
        );
    };

    return (
        <Link to={`/@${user.nickname}`}>
            <Tippy
                // visible
                interactive
                render={renderPreview}
                offset={offset}
                placement={placement}
                delay={[1000, 0]}
            >
                {children}
            </Tippy>
        </Link>
    );
};

AccountPreview.propTypes = {
    children: PropTypes.node.isRequired,
    user: PropTypes.object,
    placement: PropTypes.string,
    offset: PropTypes.array,
};

export default AccountPreview;
