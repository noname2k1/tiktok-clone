import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import classNames from 'classnames/bind';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import images from '~/assets/images';
import Button from '~/components/Button';
import {
    MessagesActiveIcon,
    MessagesIcon,
    MoreIcon,
    NotificationsIcon,
    NotificationsIconActive,
    PlusIcon,
    TiktokCoinIcon,
} from '~/components/icons';
import Image from '~/components/Image';
import Menu from '~/components/Popper/Menu';
import routesConfig from '~/config/routes';
import { useGetMenuContent } from '~/hooks';
import useAuthModal from '~/hooks/useModal';
import Search from '~/layouts/components/Search';

import styles from './Header.module.scss';
import Notification from './Notification';
import config from '~/config';

// import TippyHeadless from '@tippyjs/react/headless';
const cx = classNames.bind(styles);
const Header = ({ full = false }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { token, user } = useSelector((state) => state.auth);
    const { DEFAULT_MENU_ITEMS, USER_MENU_ITEMS } = useGetMenuContent();
    const { openAuthModal } = useAuthModal();

    const [showNotifications, setShowNotifications] = React.useState(false);

    const handleOpenAuthModal = () => {
        openAuthModal();
    };

    const handleNavigateToUploadPage = () => {
        navigate(routesConfig.upload);
    };

    const handleOpenNotification = () => {
        setShowNotifications(!showNotifications);
    };

    const UPLOAD = 'Upload';
    const LOG_IN = 'Log in';
    const MESSAGES = 'Messages';
    const NOTIFICATIONS = 'Notifications';
    const GET_COINS = 'Get Coins';

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner', { full })}>
                <Link to={routesConfig.home} className={cx('logo')}>
                    <img src={images.logo} alt='tiktok-logo' />
                </Link>
                {/* Search start */}
                <Search />
                {/* Search end */}
                <div className={cx('actions')}>
                    <Button
                        className={cx('upload-btn')}
                        lefticon={<PlusIcon />}
                        onClick={handleNavigateToUploadPage}
                    >
                        {UPLOAD}
                    </Button>
                    {token && user ? (
                        <>
                            <div className={cx('separator')}></div>
                            <Tippy content={MESSAGES} placement='bottom'>
                                <Link
                                    to={config.routes.messages}
                                    state={{ from: location.pathname }}
                                    className={cx('action-btn')}
                                >
                                    {location.pathname.indexOf(config.routes.messages) !== -1 ? (
                                        <MessagesActiveIcon />
                                    ) : (
                                        <MessagesIcon />
                                    )}
                                </Link>
                            </Tippy>
                            <div className={cx('separator')}></div>
                            <Tippy
                                content={NOTIFICATIONS}
                                placement='bottom'
                                // visible
                                disabled={showNotifications}
                            >
                                <div className={cx('notification-wrapper')}>
                                    <button
                                        className={cx('action-btn')}
                                        onClick={handleOpenNotification}
                                    >
                                        {showNotifications ? (
                                            <NotificationsIconActive />
                                        ) : (
                                            <NotificationsIcon />
                                        )}
                                    </button>
                                    {showNotifications && <Notification />}
                                </div>
                            </Tippy>
                        </>
                    ) : (
                        <>
                            <Button primary onClick={handleOpenAuthModal}>
                                {LOG_IN}
                            </Button>
                        </>
                    )}
                    {user && token && location.pathname.indexOf(config.routes.live) !== -1 && (
                        <>
                            <div className={cx('separator')}></div>
                            <Button className={cx('get-coins-btn')}>
                                <div className={cx('get-coins-label')}>
                                    <TiktokCoinIcon />
                                    <div className={cx('text')}>{GET_COINS}</div>
                                </div>
                            </Button>
                        </>
                    )}
                    <Menu
                        items={token && user ? USER_MENU_ITEMS : DEFAULT_MENU_ITEMS}
                        disabled={showNotifications}
                    >
                        {token && user ? (
                            <Image
                                src={user.avatar}
                                className={cx('user-avatar')}
                                alt='name'
                                // fallback={}
                            />
                        ) : (
                            <button className={cx('more-btn')}>
                                <MoreIcon />
                            </button>
                        )}
                    </Menu>
                </div>
            </div>
        </header>
    );
};

export default Header;
