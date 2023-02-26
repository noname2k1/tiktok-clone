import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Wrapper.module.scss';
import React from 'react';

const cx = classNames.bind(styles);
const Wrapper = ({ className, children }) => {
    return (
        <div
            className={cx('wrapper', {
                [className]: className,
            })}
        >
            {children}
        </div>
    );
};

Wrapper.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export default Wrapper;
