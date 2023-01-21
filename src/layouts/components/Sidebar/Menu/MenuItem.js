import PropTypes from 'prop-types';
import React from 'react';
import styles from './Menu.module.scss';
import classNames from 'classnames/bind';
import { NavLink } from 'react-router-dom';

const cx = classNames.bind(styles);

const MenuItem = ({ to, icon, activeIcon, title }) => {
    return (
        <NavLink
            end
            to={to}
            className={(nav) => {
                return cx('menu-item-wrapper', { active: nav.isActive });
            }}
            children={(nav) => {
                return (
                    <>
                        {nav.isActive ? activeIcon : icon}
                        <span className={cx('title')}>{title}</span>
                    </>
                );
            }}
        />
    );
};

MenuItem.propTypes = {
    to: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    title: PropTypes.string.isRequired,
};

export default MenuItem;
