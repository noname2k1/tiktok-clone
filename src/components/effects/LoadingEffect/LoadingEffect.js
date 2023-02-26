import React from 'react';
import classNames from 'classnames/bind';
import styles from './LoadingEffect.module.scss';

const cx = classNames.bind(styles);

const LoadingEffect = ({ className }) => {
    return (
        <div
            className={cx('wrapper', {
                [className]: className,
            })}
        >
            <div className={cx('circle')}></div>
            <div className={cx('circle')}></div>
        </div>
    );
};

export default LoadingEffect;
