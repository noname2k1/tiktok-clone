import PropTypes from 'prop-types';
import React from 'react';
import Button from '~/components/Button';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

const MenuItem = ({ data, onClick, separateTop = false }) => {
    return (
        <Button
            className={cx('menu-item')}
            lefticon={data.icon}
            onClick={onClick}
            to={data.to}
            separateTop={separateTop}
        >
            {data.title}
        </Button>
    );
};

MenuItem.propTypes = {
    data: PropTypes.shape({
        title: PropTypes.string.isRequired,
        icon: PropTypes.node,
        to: PropTypes.string,
    }).isRequired,
    onClick: PropTypes.func,
    separateTop: PropTypes.bool,
};

export default MenuItem;
