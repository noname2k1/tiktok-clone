import React from 'react';
import styles from './CustomCheckbox.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const CustomCheckbox = React.forwardRef(({ thumbBg = 'var(--bg-color)', ...props }, ref) => {
    return (
        <div className={cx('container')}>
            <input type='checkbox' className={cx('checkbox-init')} {...props} ref={ref} />
            <label htmlFor={props.id} className={cx('fake-checkbox-wrapper')}>
                <div
                    className={cx('thumb')}
                    style={{
                        backgroundColor: thumbBg,
                    }}
                ></div>
            </label>
        </div>
    );
});

export default CustomCheckbox;
