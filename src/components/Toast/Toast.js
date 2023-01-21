import PropTypes from 'prop-types';
import React from 'react';
import styles from './Toast.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Toast = ({ content, placement = 'top', appear: appearState = [] }) => {
    const [appear, setAppear] = appearState;
    const [disappear, setDisappear] = React.useState(false);

    const apperLife = 2000;
    React.useEffect(() => {
        let appearId;
        if (appear) {
            appearId = setTimeout(() => {
                setAppear(false);
                setDisappear(true);
            }, apperLife);
        }
        return () => {
            clearTimeout(appearId);
        };
    }, [appear, setAppear]);
    return (
        <div
            className={cx('wrapper', {
                [placement]: placement,
                appear,
                disappear,
            })}
        >
            <div className={cx('toast-container')}>{content}</div>
        </div>
    );
};

Toast.propTypes = {
    content: PropTypes.string,
    placement: PropTypes.string,
    appear: PropTypes.array,
};

export default Toast;
