import PropTypes from 'prop-types';
import React from 'react';
import styles from './SuggestedAccounts.module.scss';
import classNames from 'classnames/bind';
import { CheckIcon } from '../icons';
import AccountPreview from './AccountPreview';
import { Link } from 'react-router-dom';
import Image from '../Image';

const cx = classNames.bind(styles);

const AccountItem = ({ show = false, user }) => {
    const Component = show ? AccountPreview : Link;
    const to = `/@${user.nickname}`;
    const userData = show ? user : undefined;
    return (
        <Component user={userData} to={to}>
            <div className={cx('account-item')}>
                {/* avatar */}
                <Image src={user.avatar} alt={user.nickname} className={cx('avatar')} small />
                {/* info */}
                <div className={cx('info')}>
                    <p className={cx('nickname')}>
                        <strong>{user.nickname}</strong>
                        {user.tick && <CheckIcon className={cx('check')} />}
                    </p>
                    <p className={cx('name')}>
                        {user.first_name || user.last_name
                            ? `${user.first_name} ${user.last_name}`
                            : 'anonymous'}
                    </p>
                </div>
            </div>
        </Component>
    );
};

AccountItem.propTypes = {
    show: PropTypes.bool,
    user: PropTypes.object.isRequired,
};

export default React.memo(AccountItem);
