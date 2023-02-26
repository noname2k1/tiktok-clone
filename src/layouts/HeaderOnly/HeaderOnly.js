import classNames from 'classnames/bind';
import React from 'react';

import Header from '../components/Header';
import styles from './HeaderOnly.module.scss';

const cx = classNames.bind(styles);

const HeaderOnly = ({ children }) => {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
};

export default HeaderOnly;
