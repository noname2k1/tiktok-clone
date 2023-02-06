import React from 'react';
import classNames from 'classnames/bind';
import styles from './LoadingEffect.module.scss';

const cx = classNames.bind(styles);

const LoadingEffect = () => {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('circle')}></div>
            <div className={cx('circle')}></div>
        </div>
    );
};

export default LoadingEffect;
