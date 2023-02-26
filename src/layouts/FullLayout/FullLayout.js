import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import styles from './FullLayout.module.scss';

const cx = classNames.bind(styles);
const FullLayout = ({ children }) => {
    return (
        <div className={cx('wrapper')}>
            <Header full />
            <div className={cx('container')}>
                <Sidebar medium suggested={false} />
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
};

FullLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default FullLayout;
