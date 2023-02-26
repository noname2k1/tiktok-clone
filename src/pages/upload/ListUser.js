import PropTypes from 'prop-types';

import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { LoadingEffect } from '~/components/effects';
import Image from '~/components/Image';
import { useDebounce } from '~/hooks';
import * as searchService from '~/services/searchService';

const Wrapper = styled.div`
    box-shadow: rgb(34 90 89 / 20%) 2px 0px 20px -20px, rgb(34 90 89 / 20%) 0px 8px 20px -2px,
        rgb(34 90 89 / 20%) 0px 0px 20px -20px;
    .title {
        font-size: 1.5rem;
        color: var(--suggested-label-color);
        margin-bottom: 1rem;
        padding: 2rem;
        padding-bottom: 1rem;
    }
    .list-user {
        max-height: 300px;
        overflow-y: auto;
    }
    .user {
        display: flex;
        align-items: center;
        padding: 1rem 2rem;
        cursor: pointer;
        &:hover {
            background-color: var(--hover-bg-secondary);
        }
        .avatar {
            display: flex;
            align-items: center;
        }
        .info {
            margin-left: 1rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
        }
        .name {
            font-size: 2rem;
            font-weight: 600;
            margin-top: 0.5rem;
            line-height: 1.2;
        }
        .nickname {
            color: var(--suggested-label-color);
        }
    }
    .empty-result,
    .loading {
        padding: 4rem 2rem;
        text-align: center;
        color: var(--text-color);
        font-size: 1.5rem;
        font-weight: 600;
    }
`;

const ListUser = ({ searchValue = '', clickItem = () => {} }) => {
    const TEXT_VARIABLES = {
        ALL_USERS: 'All users',
        FOLLOWING: 'Following',
        EMPTY: 'Empty',
    };
    const { followingUsers } = useSelector((state) => state.follow);
    const [results, setResults] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);

    const debounceSearchValue = useDebounce(searchValue, 500);

    React.useEffect(() => {
        if (debounceSearchValue) {
            setLoading(true);
            setPage(1);
            searchService
                .search(debounceSearchValue, 'more', 1)
                .then((res) => {
                    setResults(res);
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                    console.log(err);
                });
        } else {
            setResults([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceSearchValue]);

    React.useEffect(() => {
        if (page > 1) {
            searchService
                .search(debounceSearchValue, 'more', page)
                .then((res) => {
                    setResults((prev) => [...prev, ...res]);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const LIST_USERS = searchValue || results.length > 0 ? results : followingUsers;

    const handleClickItem = (user) => {
        const nickname = `@${user}`;
        clickItem(nickname);
    };

    const handleLoadMore = (e) => {
        const clientHeight = e.target.clientHeight;
        const scrollTop = e.target.scrollTop;
        const scrollHeight = e.target.scrollHeight;
        if (clientHeight + scrollTop >= scrollHeight - 1) {
            setPage((prev) => prev + 1);
        }
    };

    return (
        <Wrapper>
            <header className='title'>
                {searchValue || results.length > 0
                    ? TEXT_VARIABLES.ALL_USERS
                    : TEXT_VARIABLES.FOLLOWING}
            </header>

            <div className='list-user' onScroll={handleLoadMore}>
                {LIST_USERS.length > 0 &&
                    LIST_USERS.map((user) => (
                        <div
                            className='user'
                            key={user.id}
                            onClick={() => handleClickItem(user.nickname)}
                        >
                            <div className='avatar'>
                                <Image
                                    large
                                    rounded
                                    src={user.avatar}
                                    alt={'tiktok-clone-by-ninhname'}
                                />
                            </div>
                            <div className='info'>
                                <div className='name'>
                                    {user.first_name || user.last_name
                                        ? `${user.first_name} ${user.last_name}`
                                        : ''}
                                </div>
                                <div className='nickname'>@{user.nickname}</div>
                            </div>
                        </div>
                    ))}
                {LIST_USERS.length === 0 && !loading && (
                    <div className='empty-result'>{TEXT_VARIABLES.EMPTY}</div>
                )}
                {loading && (
                    <div className='loading'>
                        <LoadingEffect />
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

ListUser.propTypes = {
    searchValue: PropTypes.string,
    clickItem: PropTypes.func,
};

export default ListUser;
