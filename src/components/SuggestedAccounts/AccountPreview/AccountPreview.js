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

const cx = classNames.bind(styles);

const AccountPreview = ({ children, to, user, placement = 'bottom' }) => {
    const renderPreview = (attrs) => {
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
                        <Button primary className={cx('follow-btn')}>
                            Follow
                        </Button>
                    </header>
                    {/* info */}
                    <div className={cx('info')}>
                        <p className={cx('nickname')}>
                            <strong>{user.nickname}</strong>
                            {user.tick && <CheckIcon className={cx('check')} />}
                        </p>
                        <p
                            className={cx('name')}
                        >{`${user.first_name} ${user.last_name}`}</p>
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
                </Wrapper>
            </div>
        );
    };

    return (
        <Link to={to}>
            <Tippy
                // visible
                interactive
                render={renderPreview}
                offset={[-20, 0]}
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
    to: PropTypes.string,
    user: PropTypes.object,
    placement: PropTypes.string,
};

export default AccountPreview;
