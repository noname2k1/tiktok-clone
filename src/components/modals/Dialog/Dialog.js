import PropTypes from 'prop-types';

import React from 'react';
import classNames from 'classnames/bind';
import styles from './Dialog.module.scss';

const cx = classNames.bind(styles);

const Dialog = ({ title, options = [], visible = false, children }) => {
    return (
        <div className={cx('overlay', { visible })}>
            <div className={cx('wrapper')}>
                <header className={cx('dialog-header')}>{title}</header>
                <div className={cx('dialog-body')}>{children}</div>
                {options.length > 0 && (
                    <div className={cx('dialog-options')}>
                        {options.map((option, index) => (
                            <div key={index} className={cx('option')} onClick={option.onClick}>
                                <span style={option.style}>{option.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

Dialog.propTypes = {
    title: PropTypes.string,
    options: PropTypes.array,
    visible: PropTypes.bool,
};

export default Dialog;
