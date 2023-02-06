import 'tippy.js/dist/tippy.css';

import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import images from '~/assets/images';
import Button from '~/components/Button';
import { MessagesIcon, MoreIcon, NotificationsIcon, PlusIcon } from '~/components/icons';
import Image from '~/components/Image';
import Menu from '~/components/Popper/Menu';
import routesConfig from '~/config/routes';
import { useGetMenuContent } from '~/hooks';
import useAuthModal from '~/hooks/useModal';
import Search from '~/layouts/components/Search';

import styles from './Header.module.scss';

const cx = classNames.bind(styles);
const Header = () => {
    const { token, user } = useSelector((state) => state.auth);
    const { DEFAULT_MENU_ITEMS, USER_MENU_ITEMS } = useGetMenuContent();
    const { openAuthModal } = useAuthModal();
    const handleOpenAuthModal = () => {
        openAuthModal();
    };

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
                    {token && user ? (
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
                            <Button primary onClick={handleOpenAuthModal}>
                                Log in
                            </Button>
                        </>
                    )}
                    <Menu items={token && user ? USER_MENU_ITEMS : DEFAULT_MENU_ITEMS}>
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
