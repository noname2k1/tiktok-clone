import React from 'react';
import styled from 'styled-components';
import { Wrapper } from '~/components/Popper';
import classNames from 'classnames';
import Image from '~/components/Image';
import { LoadingEffect } from '~/components/effects';

const NotificationWrapper = styled(Wrapper)`
    position: absolute;
    right: -50px;
    display: flex;
    width: fit-content;
    top: calc(100% + 12px);
    flex-direction: column;
    min-height: calc(100vh - var(--default-layout-header-height) - 24px);

    .header {
        padding: 24px 16px 0;
    }
    .header-title {
        margin-bottom: 8px;
        color: var(--text-color);
    }

    .notifications-type-list {
        display: flex;
        width: 30vw;
        flex-wrap: wrap;
        margin-bottom: 8px;
    }
    .notifications-type-item {
        color: var(--text-color);
        margin-right: 8px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 20px;
        background-color: var(--light-bg);
        font-size: 1.6rem;
        font-weight: 600;
        margin: 0 8px 8px 0;
        &.active {
            background-color: var(--primary-color);
            color: var(--bg-color);
        }
    }

    .content {
        flex: 1;
        overflow-y: hidden;
        &:hover {
            overflow-y: auto;
        }
        padding: 0 16px 16px;
        .content-item {
        }
    }

    .item-time {
        font-size: 1.6rem;
        color: var(--light-color);
        font-weight: 600;
        margin-bottom: 8px;
    }

    .item-content {
        display: flex;
        align-items: center;
        .item-content-avatar {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .item-content-info {
        margin-left: 8px;
        .nickname {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--nickname-color);
        }
        .action-wrapper {
            display: flex;
            align-items: center;
            color: var(--lighter-color);
            .action {
                margin-right: 8px;
            }
        }
    }
`;

const Notification = () => {
    const NOTIFACATIONS = 'Notifications';
    const ALL_ACTIVITY = 'All activity';
    const LIKES = 'Likes';
    const COMMENTS = 'Comments';
    const MENTIONS_AND_TAGS = 'Mentions & tags';
    const FOLLOWERS = 'Followers';

    const [active, setActive] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const handleActive = (id) => {
        setActive(id);
        setLoading(true);

        //fake call api
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    const NOTIFICATION_LIST = [
        {
            id: 0,
            title: ALL_ACTIVITY,
        },
        {
            id: 1,
            title: LIKES,
        },
        {
            id: 2,
            title: COMMENTS,
        },
        {
            id: 3,
            title: MENTIONS_AND_TAGS,
        },
        {
            id: 4,
            title: FOLLOWERS,
        },
    ];
    return (
        <NotificationWrapper>
            <header className='header'>
                <h2 className='header-title'>{NOTIFACATIONS}</h2>
                <div className='notifications-type-list'>
                    {NOTIFICATION_LIST.map((item) => (
                        <div
                            className={classNames('notifications-type-item', {
                                active: active === item.id,
                            })}
                            key={item.id}
                            onClick={() => handleActive(item.id)}
                        >
                            <span className='title'>{item.title}</span>
                        </div>
                    ))}
                </div>
            </header>
            {loading ? (
                <LoadingEffect />
            ) : (
                <div className='content'>
                    <div className='content-item'>
                        <header className='item-time'>Yesterday</header>
                        <div className='item-content'>
                            <div className='item-content-avatar'>
                                <Image large rounded />
                            </div>
                            <div className='item-content-info'>
                                <span className='nickname'>John Doe</span>
                                <div className='action-wrapper'>
                                    <span className='action'>liked your post</span>
                                    <div className='time'>2 hours ago</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </NotificationWrapper>
    );
};

export default Notification;
