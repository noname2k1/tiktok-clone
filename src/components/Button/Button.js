import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Button.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

const Button = ({
    to,
    href,
    primary = false,
    outline = false,
    small = false,
    medium = false,
    large = false,
    normal = true,
    disabled = false,
    rounded = false,
    lefticon = false,
    righticon = false,
    separateTop = false,
    children,
    onClick,
    className,
    ...props
}) => {
    let Component = 'button';
    let classes = cx('wrapper', {
        primary,
        outline,
        small,
        medium,
        normal,
        large,
        disabled,
        rounded,
        [className]: className,
        'separate-top': separateTop,
        'no-icon': !lefticon && !righticon,
    });

    if (disabled) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
    }

    const _props = {
        onClick,
        ...props,
    };

    if (to) {
        Component = Link;
        _props.to = to;
    } else if (href) {
        Component = 'a';
        _props.href = href;
    }

    return (
        <Component className={classes} {..._props}>
            {lefticon && (
                <span className={cx('left-icon', 'icon')}>{lefticon}</span>
            )}
            <span>{children}</span>
            {righticon && (
                <span className={cx('right-icon', 'icon')}>{righticon}</span>
            )}
        </Component>
    );
};

Button.propTypes = {
    to: PropTypes.string,
    href: PropTypes.string,
    primary: PropTypes.bool,
    outline: PropTypes.bool,
    small: PropTypes.bool,
    large: PropTypes.bool,
    normal: PropTypes.bool,
    disabled: PropTypes.bool,
    rounded: PropTypes.bool,
    lefticon: PropTypes.node,
    righticon: PropTypes.node,
    separateTop: PropTypes.bool,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
};

export default Button;
