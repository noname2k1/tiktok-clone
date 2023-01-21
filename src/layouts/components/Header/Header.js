import React from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import images from '~/assets/images';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import Button from '~/components/Button';
import Menu from '~/components/Popper/Menu';
import {
    DarkModeIcon,
    HelpIcon,
    KeyBoardIcon,
    LanguagesIcon,
    LiveSmallIcon,
    LogoutIcon,
    MessagesIcon,
    MoreIcon,
    NotificationsIcon,
    PersonIcon,
    PlusIcon,
    SettingsIcon,
    TiktokCoinIcon,
} from '~/components/icons';
import { Link } from 'react-router-dom';
import Image from '~/components/Image';
import Search from '~/layouts/components/Search';
import routesConfig from '~/config/routes';

const cx = classNames.bind(styles);
const Header = () => {
    const handleChange = (item) => {
        console.log(item);
    };
    const MENU_ITEMS = [
        {
            title: 'English',
            icon: <LanguagesIcon />,
            children: {
                data: [
                    {
                        type: 'language',
                        title: 'English',
                        code: 'en',
                    },
                    {
                        type: 'language',
                        title: 'Vietnamese',
                        code: 'vi',
                    },
                ],
                title: 'Language',
            },
        },
        {
            title: 'Feedback and help',
            icon: <HelpIcon />,
            to: '/feedback',
        },
        {
            title: 'Keyboard shortcuts',
            icon: <KeyBoardIcon />,
        },
        {
            title: 'Dark mode',
            icon: <DarkModeIcon />,
        },
    ];

    const currentUser = true;
    const userMenu = [
        {
            title: 'View profile',
            icon: <PersonIcon />,
            to: '/my-profile',
        },
        {
            title: 'Get Coins',
            icon: <TiktokCoinIcon />,
            to: '/my-profile',
        },
        {
            title: 'Live Studio',
            icon: <LiveSmallIcon />,
            to: '/my-profile',
        },
        {
            title: 'Settings',
            icon: <SettingsIcon />,
            to: '/my-profile',
        },
        ...MENU_ITEMS,
        {
            title: 'Log out',
            icon: <LogoutIcon />,
            to: '/logout',
            separateTop: true,
        },
    ];

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link to={routesConfig.home} className={cx('logo')}>
                    <img src={images.logo} alt='tiktok-logo' />
                </Link>
                {/* Search start */}
                <Search />
                {/* Search end */}
                <div className={cx('actions')}>
                    <Button lefticon={<PlusIcon />}>Upload</Button>
                    {currentUser ? (
                        <>
                            <Tippy content='Messages'>
                                <button className={cx('action-btn')}>
                                    <MessagesIcon />
                                </button>
                            </Tippy>
                            <Tippy content='Notifications'>
                                <button className={cx('action-btn')}>
                                    <NotificationsIcon />
                                </button>
                            </Tippy>
                        </>
                    ) : (
                        <>
                            <Button primary>Log in</Button>
                        </>
                    )}
                    <Menu
                        items={currentUser ? userMenu : MENU_ITEMS}
                        onChange={handleChange}
                    >
                        {currentUser ? (
                            <Image
                                src='https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tiktok-obj/1663032433476609.jpeg?x-expires=1671120000&x-signature=rToOO%2B291lTHghETGPaFfzIghkc%3D'
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
