import React from 'react';
import styles from './Inbox.module.scss';
import classNames from 'classnames/bind';
import { BackIcon, GearIcon, MoreIcon, SendPlaneIcon } from '~/components/icons';
import { useSelector } from 'react-redux';
import Image from '~/components/Image';
import Moment from 'react-moment';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '~/config';
import CommentInput from '~/components/Custom/CommentInput';

const cx = classNames.bind(styles);

const Inbox = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const chatInputRef = React.useRef(null);

    const { from } = location.state || { from: { pathname: config.routes.home } };
    const MESSAGES = 'Messages';
    const CHAT_PLACEHOLDER = 'Type a message...';

    const { followingUsers } = useSelector((state) => state.follow);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [chatValue, setChatValue] = React.useState('');

    React.useEffect(() => {
        window.scrollTo(0, 0);
        document.title = MESSAGES + ' | TikTok-clone-by-ninh-nam';
    }, []);

    const handleBackToPreviousPage = () => {
        navigate(from);
    };

    const handleUserClick = (index) => {
        setCurrentIndex(index);
    };

    const handleChatInputChange = (e) => {
        setChatValue(e.target.textContent);
    };

    return (
        <div className={cx('wrapper')}>
            <aside className={cx('sidebar')}>
                <header className={cx('header')}>
                    <button onClick={handleBackToPreviousPage}>
                        <BackIcon />
                    </button>
                    <h3 className={cx('title')}>{MESSAGES}</h3>
                    <button className={cx('config-btn')}>
                        <GearIcon width='32' height='32' />
                    </button>
                </header>
                <ul className={cx('user-list')}>
                    {followingUsers.map((user, index) => (
                        <li
                            className={cx('user-item', {
                                active: index === currentIndex,
                            })}
                            onClick={() => handleUserClick(index)}
                            key={user.id}
                        >
                            <Image src={user.avatar} alt='tiktok-clone-by-ninh-nam' large rounded />
                            <div className={cx('item-info')}>
                                <h4 className={cx('item-name')}>
                                    {user.first_name || user.last_name
                                        ? `${user.first_name} ${user.last_name}`
                                        : user.nickname}
                                </h4>
                                <p className={cx('item-last-message')}>lasted message</p>
                                <span className={cx('time')}>
                                    <Moment fromNow>{user.created_at}</Moment>
                                    {' - '}
                                    <Moment format='DD/MM/yyyy HH:mm'>{user.created_at}</Moment>
                                </span>
                            </div>
                            <button className={cx('more-btn')}>
                                <MoreIcon width='30' height='30' />
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>
            <main className={cx('body')}>
                <header className='body-header'>
                    <div className={cx('body-header-user-info')}>
                        <Image
                            src={followingUsers[currentIndex].avatar}
                            alt='tiktok-clone-by-ninh-nam'
                            large
                            rounded
                        />
                        <div className={cx('text')}>
                            <h4 className={cx('name')}>
                                {followingUsers[currentIndex].first_name ||
                                followingUsers[currentIndex].last_name
                                    ? `${followingUsers[currentIndex].first_name} ${followingUsers[currentIndex].last_name}`
                                    : ''}
                            </h4>
                            <h3 className={cx('nickname')}>
                                @{followingUsers[currentIndex].nickname}
                            </h3>
                        </div>
                    </div>
                </header>
                <ul className={cx('message-list')}></ul>
                <footer className={cx('footer')}>
                    <CommentInput
                        value={chatValue}
                        ref={chatInputRef}
                        placeHolder={CHAT_PLACEHOLDER}
                        onChange={handleChatInputChange}
                        emoji
                        btnLabel={<SendPlaneIcon width='24' height='24' />}
                    />
                </footer>
            </main>
        </div>
    );
};

export default Inbox;
