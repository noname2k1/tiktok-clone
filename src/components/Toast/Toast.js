import React from 'react';
import styles from './Toast.module.scss';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { setToast } from '~/store/slices/globalComponentSlice';

const cx = classNames.bind(styles);

const Toast = () => {
    const dispatch = useDispatch();
    const { toast } = useSelector((state) => state.globalComponent);
    const { content, placement, enabled } = toast;
    // const [disappear, setDisappear] = React.useState(false);

    const apperLife = 2000;
    React.useEffect(() => {
        let appearId;
        if (enabled) {
            appearId = setTimeout(() => {
                // setDisappear(true);
                dispatch(setToast({ enabled: false }));
            }, apperLife);
        }
        return () => {
            clearTimeout(appearId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);

    return (
        <div
            className={cx('wrapper', {
                [placement]: placement,
                appear: enabled,
            })}
        >
            <div className={cx('toast-container')}>{content}</div>
        </div>
    );
};

export default Toast;
