import PropTypes from 'prop-types';
import React from 'react';
import styles from './Menu.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Menu = ({ children }) => {
    return <nav className={cx('wrapper')}>{children}</nav>;
};

Menu.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Menu;
