import PropTypes from 'prop-types';
import React from 'react';
import Button from '~/components/Button';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import CustomCheckbox from '~/components/Custom/CustomCheckbox';
import { useDispatch, useSelector } from 'react-redux';
import { setDarkMode } from '~/store/slices/globalComponentSlice';

const cx = classNames.bind(styles);

const MenuItem = ({ data, onClick, separateTop = false }) => {
    const dispatch = useDispatch();
    const { darkMode } = useSelector((state) => state.globalComponent);
    const [darkModeTerm, setDarkModeTerm] = React.useState(darkMode);

    React.useEffect(() => {
        setDarkModeTerm(darkMode);
    }, [darkMode]);

    let righticon = null;
    let customOnClick = onClick;
    if (data.target === 'dark-mode') {
        customOnClick = () => {
            dispatch(setDarkMode(!darkMode));
        };
        righticon = (
            <CustomCheckbox
                name='dark-mode'
                id='dark-mode'
                className={cx('dark-mode-checkbox')}
                checked={darkModeTerm}
                onChange={() => {}}
                onClick={(e) => {
                    e.preventDefault();
                }}
            />
        );
    }
    return (
        <Button
            className={cx('menu-item')}
            id-target={data.target}
            lefticon={data.icon}
            righticon={righticon}
            onClick={customOnClick}
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
