import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
import { CheckIcon } from '~/components/icons';
import Image from '~/components/Image';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);
const AccountItem = ({ data, ...props }) => {
    return (
        <Link to={`/@${data.nickname}`} className={cx('wrapper')} {...props}>
            <Image className={cx('avatar')} alt={data.full_name} src={data.avatar} />
            <div className={cx('infor')}>
                <h4 className={cx('name')}>
                    <span>{data.full_name}</span>
                    {data.tick && <CheckIcon />}
                </h4>
                <span className={cx('username')}>{data.nickname}</span>
            </div>
        </Link>
    );
};

AccountItem.propTypes = {
    data: PropTypes.object.isRequired,
};

export default AccountItem;
