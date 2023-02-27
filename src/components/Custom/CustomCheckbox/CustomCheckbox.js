import PropTypes from 'prop-types';

import React from 'react';
import styles from './CustomCheckbox.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const CustomCheckbox = React.forwardRef(
    ({ className, onClick, thumbBg = 'var(--bg-color, #fff)', ...props }, ref) => {
        return (
            <div
                className={cx('container', {
                    [className]: className,
                })}
            >
                <input type='checkbox' className={cx('checkbox-init')} {...props} ref={ref} />
                <label htmlFor={props.id} className={cx('fake-checkbox-wrapper')} onClick={onClick}>
                    <div
                        className={cx('thumb')}
                        style={{
                            backgroundColor: thumbBg,
                        }}
                    ></div>
                </label>
            </div>
        );
    }
);

CustomCheckbox.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    thumbBg: PropTypes.string,
};

export default CustomCheckbox;
