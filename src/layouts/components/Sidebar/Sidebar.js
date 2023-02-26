import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import React from 'react';
import { useSelector } from 'react-redux';
import Button from '~/components/Button';
import {
    HomeActiveIcon,
    HomeIcon,
    LiveBigActiveIcon,
    LiveBigIcon,
    UsersGroupActiveIcon,
    UsersGroupIcon,
} from '~/components/icons';
import SuggestedAccounts from '~/components/SuggestedAccounts';
import config from '~/config';
import useAuthModal from '~/hooks/useModal';
import * as followService from '~/services/followService';
import * as userService from '~/services/userService';
import Menu, { MenuItem } from './Menu';
import styles from './Sidebar.module.scss';
import { useLocation } from 'react-router-dom';
import { chunkArray } from '~/helpers';

const cx = classNames.bind(styles);
const INITIAL_PAGE = 1;
const SEE_ALL_PAGE = 2;
const INITIAL_PER_PAGE = 5;
const SEE_ALL_COUNT = 20;

const Sidebar = ({
    large = true,
    medium = false,
    suggested = true,
    following = true,
    discover = true,
}) => {
    const { pathname } = useLocation();
    const { openAuthModal } = useAuthModal();
    const { token, user } = useSelector((state) => state.auth);
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
    const { followingUsers: followingUsersFromStore } = useSelector((state) => state.follow);
    const followingArrays = chunkArray(followingUsersFromStore, 5);
    const [followingUsers, setFollowingUsers] = React.useState([]);

    const SUGGESTED_LIST_LABEL = 'Suggested accounts';
    const SUGGESTED_LIST_EMPTY_NOTICE = 'Suggested accounts will appear here';
    const FOLLOWING_LIST_LABEL = 'Following accounts';
    const FOLLOWING_LIST_EMPTY_NOTICE = 'Accounts you follow will appear here';
    const SUGGESTED_HOST = 'Suggested hosts';
    const SUGGESTED_HOST_EMPTY_NOTICE = 'Suggested hosts will appear here';

    // Menu
    const FOR_YOU = 'For You';
    const LIVE = 'Live';
    // const DISCOVER = 'Discover';
    const FOLLWING = 'Following';

    React.useEffect(() => {
        const getSuggestedUsers = () => {
            userService
                .getSuggestedUsers(page.suggested, perPage.suggested)
                .then((sgUsers) => {
                    // console.log(users);
                    let suggestedUsers;
                    if (sgUsers) {
                        suggestedUsers = sgUsers.filter(
                            (sgUser) =>
                                !followingUsersFromStore.some(
                                    (followingUser) => followingUser.id === sgUser.id
                                )
                        );
                        if (suggestedUsers.length < INITIAL_PER_PAGE + 1) {
                            setPerPage((prevPerPage) => ({
                                ...prevPerPage,
                                suggested:
                                    perPage.suggested +
                                    (INITIAL_PER_PAGE + 1 - suggestedUsers.length - 1),
                            }));
                        }
                        if (page.suggested === INITIAL_PAGE) {
                            setSuggestedUsers(suggestedUsers);
                        } else {
                            setSuggestedUsers((prevUsers) => [...prevUsers, ...suggestedUsers]);
                        }
                    }
                })
                .catch((error) => console.log(error));
        };
        getSuggestedUsers();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page.suggested, perPage.suggested]);
    React.useEffect(() => {
        if (!token) return;
        if (followingArrays.length > 0) {
            if (page.following === INITIAL_PAGE) {
                setFollowingUsers(followingArrays[0]);
            } else {
                if (
                    followingArrays[page.following - 1] &&
                    followingArrays[page.following - 1].length > 0
                ) {
                    setFollowingUsers((prevUsers) => [
                        ...prevUsers,
                        ...followingArrays[page.following - 1],
                    ]);
                }
            }
        } else {
            const getFollowingUsers = () => {
                followService
                    .getFollowingUsers(page.following, perPage.following)
                    .then((users) => {
                        // console.log(users);
                        if (page.following === INITIAL_PAGE) {
                            setFollowingUsers(users);
                        } else {
                            setFollowingUsers((prevUsers) => [...prevUsers, ...users]);
                        }
                    })
                    .catch((error) => console.log(error));
            };
            getFollowingUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page.following, perPage.following]);

    React.useEffect(() => {
        if (followingArrays.length > 0) {
            if (page.following === INITIAL_PAGE) {
                setFollowingUsers(followingArrays[0]);
            } else {
                if (
                    followingArrays[page.following - 1] &&
                    followingArrays[page.following - 1].length > 0
                ) {
                    setFollowingUsers((prevUsers) => [
                        ...prevUsers,
                        ...followingArrays[page.following - 1],
                    ]);
                }
            }
        } else {
            setFollowingUsers([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [followingUsersFromStore]);

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

    const handleOpenAuthModal = () => {
        openAuthModal();
    };

    return (
        <aside
            className={cx('wrapper', {
                [styles.large]: large,
                [styles.medium]: medium,
            })}
        >
            <Menu>
                <MenuItem
                    to={config.routes.home}
                    icon={<HomeIcon />}
                    activeIcon={<HomeActiveIcon />}
                    title={FOR_YOU}
                />
                <MenuItem
                    to={config.routes.following}
                    icon={<UsersGroupIcon />}
                    activeIcon={<UsersGroupActiveIcon />}
                    title={FOLLWING}
                />
                <MenuItem
                    to={config.routes.live}
                    icon={<LiveBigIcon width='32' height='32' />}
                    activeIcon={<LiveBigActiveIcon />}
                    title={LIVE}
                />
            </Menu>
            {/* suggested to login */}
            {!token && !Object.keys(user).length > 0 && (
                <div className={cx('suggested-login')}>
                    <p>Log in to follow creators, like videos, and view comments.</p>
                    <Button outline large className={cx('login-btn')} onClick={handleOpenAuthModal}>
                        Login
                    </Button>
                </div>
            )}
            {pathname.indexOf('/live') === -1 && suggested && (
                <SuggestedAccounts
                    label={SUGGESTED_LIST_LABEL}
                    emptyLabel={SUGGESTED_LIST_EMPTY_NOTICE}
                    show
                    data={suggestedUsers}
                    onViewChange={handleViewChangeSuggestedUsers}
                    isSeeAll={isSeeAll.suggested}
                />
            )}
            {token &&
                Object.keys(user).length > 0 &&
                pathname.indexOf('/live') === -1 &&
                following && (
                    <SuggestedAccounts
                        label={FOLLOWING_LIST_LABEL}
                        emptyLabel={FOLLOWING_LIST_EMPTY_NOTICE}
                        data={followingUsers}
                        onViewChange={handleViewChangeFollowingUsers}
                        isSeeAll={isSeeAll.following}
                    />
                )}
            {pathname.indexOf('/live') !== -1 && (
                <SuggestedAccounts
                    label={SUGGESTED_HOST}
                    emptyLabel={SUGGESTED_HOST_EMPTY_NOTICE}
                    data={suggestedUsers}
                    onViewChange={handleViewChangeSuggestedUsers}
                    isSeeAll={isSeeAll.suggested}
                />
            )}
            {/* discover */}
        </aside>
    );
};

Sidebar.propTypes = {
    large: PropTypes.bool,
    medium: PropTypes.bool,
    suggested: PropTypes.bool,
    following: PropTypes.bool,
    discover: PropTypes.bool,
};

export default Sidebar;
