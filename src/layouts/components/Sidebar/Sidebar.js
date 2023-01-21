import React from 'react';
import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';
import Menu, { MenuItem } from './Menu';
import {
    HomeIcon,
    HomeActiveIcon,
    UsersGroupIcon,
    UsersGroupActiveIcon,
    LiveBigIcon,
    LiveBigActiveIcon,
} from '~/components/icons';
import SuggestedAccounts from '~/components/SuggestedAccounts';
import * as userService from '~/services/userService';
import * as followService from '~/services/followService';

const cx = classNames.bind(styles);
const INITIAL_PAGE = 1;
const SEE_ALL_PAGE = 2;
const INITIAL_PER_PAGE = 5;
const SEE_ALL_COUNT = 20;

const Sidebar = () => {
    const [page, setPage] = React.useState({
        suggested: INITIAL_PAGE,
        following: INITIAL_PAGE,
    });
    const [perPage, setPerPage] = React.useState({
        suggested: INITIAL_PER_PAGE,
        following: INITIAL_PER_PAGE,
    });
    const [isSeeAll, setIsSeeAll] = React.useState({
        suggested: false,
        following: false,
    });
    const [suggestedUsers, setSuggestedUsers] = React.useState([]);
    const [followingUsers, setFollowingUsers] = React.useState([]);

    React.useEffect(() => {
        const getSuggestedUsers = () => {
            userService
                .getSuggestedUsers(page.suggested, perPage.suggested)
                .then((users) => {
                    // console.log(users);
                    if (page.suggested === INITIAL_PAGE) {
                        setSuggestedUsers(users);
                    } else {
                        setSuggestedUsers((prevUsers) => [
                            ...prevUsers,
                            ...users,
                        ]);
                    }
                })
                .catch((error) => console.log(error));
        };
        getSuggestedUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page.suggested, perPage.suggested]);
    React.useEffect(() => {
        const getFollowingUsers = () => {
            followService
                .getFollowingUsers(page.following, perPage.following)
                .then((users) => {
                    // console.log(users);
                    if (page.following === INITIAL_PAGE) {
                        setFollowingUsers(users);
                    } else {
                        setFollowingUsers((prevUsers) => [
                            ...prevUsers,
                            ...users,
                        ]);
                    }
                })
                .catch((error) => console.log(error));
        };
        getFollowingUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page.following, perPage.following]);

    const handleViewChangeSuggestedUsers = () => {
        setIsSeeAll((prev) => {
            return {
                ...prev,
                suggested: !prev.suggested,
            };
        });
        if (isSeeAll.suggested) {
            setPage((prev) => {
                return {
                    ...prev,
                    suggested: INITIAL_PAGE,
                };
            });
            setPerPage((prev) => {
                return {
                    ...prev,
                    suggested: INITIAL_PER_PAGE,
                };
            });
        } else {
            setPage((prev) => {
                return {
                    ...prev,
                    suggested: SEE_ALL_PAGE,
                };
            });
            setPerPage((prev) => {
                return {
                    ...prev,
                    suggested: SEE_ALL_COUNT,
                };
            });
        }
    };
    const handleViewChangeFollowingUsers = () => {
        setIsSeeAll((prev) => {
            return {
                ...prev,
                following: !prev.following,
            };
        });
        if (isSeeAll.following) {
            setPage((prev) => {
                return {
                    ...prev,
                    following: INITIAL_PAGE,
                };
            });
            setPerPage((prev) => {
                return {
                    ...prev,
                    following: INITIAL_PER_PAGE,
                };
            });
        } else {
            setPage((prev) => {
                return {
                    ...prev,
                    following: SEE_ALL_PAGE,
                };
            });
            setPerPage((prev) => {
                return {
                    ...prev,
                    following: SEE_ALL_COUNT,
                };
            });
        }
    };

    return (
        <aside className={cx('wrapper')}>
            <Menu>
                <MenuItem
                    to='/'
                    icon={<HomeIcon />}
                    activeIcon={<HomeActiveIcon />}
                    title='For You'
                />
                <MenuItem
                    to='/following'
                    icon={<UsersGroupIcon />}
                    activeIcon={<UsersGroupActiveIcon />}
                    title='Following'
                />
                <MenuItem
                    to='/live'
                    icon={<LiveBigIcon width='32' height='32' />}
                    activeIcon={<LiveBigActiveIcon />}
                    title='LIVE'
                />
            </Menu>
            <SuggestedAccounts
                label='Suggested accounts'
                emptyLabel='Suggested accounts will appear here'
                show
                data={suggestedUsers}
                onViewChange={handleViewChangeSuggestedUsers}
                isSeeAll={isSeeAll.suggested}
            />
            <SuggestedAccounts
                label='Following accounts'
                emptyLabel='Accounts you follow will appear here'
                data={followingUsers}
                onViewChange={handleViewChangeFollowingUsers}
                isSeeAll={isSeeAll.following}
            />
        </aside>
    );
};

export default Sidebar;