import React from 'react';
import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import TippyHeadLess from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { CloseIcon, SearchIcon, SpinnerIcon } from '~/components/icons';
import AccountItem from '~/components/AccountItem';
import { useDebounce } from '~/hooks';
import * as searchServices from '~/services/searchService';

const cx = classNames.bind(styles);

const Search = () => {
    const [searchResults, setSearchResults] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState('');
    const [showResults, setShowResults] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    const debouncedSearchValue = useDebounce(searchValue, 500);

    const handleChange = (e) => {
        const searchTerm = e.target.value;
        if (!searchTerm.startsWith(' ')) {
            setSearchValue(e.target.value);
        }
    };

    const handleClear = () => {
        setSearchValue('');
        setSearchResults([]);
    };

    const handleCloseSearch = () => {
        handleClear();
    };

    React.useEffect(() => {
        if (!debouncedSearchValue.trim() || !searchValue.trim()) {
            setSearchResults([]);
            return;
        }

        const fetchApi = async () => {
            setLoading(true);
            const res = await searchServices.search(debouncedSearchValue);
            setSearchResults(res);
            setLoading(false);
        };
        fetchApi();
    }, [debouncedSearchValue, searchValue]);
    // console.log(searchResults);
    return (
        <div>
            <TippyHeadLess
                render={(attrs) => (
                    <div className={cx('search-result')} tabIndex='-1' {...attrs}>
                        <PopperWrapper>
                            <h4 className={cx('search-title')}>Accounts</h4>
                            {searchResults.map((result) => (
                                <AccountItem
                                    key={result.id}
                                    data={result}
                                    onClick={handleCloseSearch}
                                />
                            ))}
                        </PopperWrapper>
                    </div>
                )}
                interactive={true}
                visible={showResults && searchResults.length > 0}
                onClickOutside={() => setShowResults(false)}
            >
                <div className={cx('search')}>
                    <input
                        type='text'
                        placeholder='Search accounts & videos'
                        spellCheck={false}
                        value={searchValue}
                        onChange={handleChange}
                        onFocus={() => setShowResults(true)}
                    />
                    <div className={cx('pending')}>
                        {searchValue && !loading && (
                            <button className={cx('clear')} onClick={handleClear}>
                                <CloseIcon />
                            </button>
                        )}
                        {loading && <SpinnerIcon />}
                    </div>

                    <button className={cx('search-btn')}>
                        <SearchIcon />
                    </button>
                </div>
            </TippyHeadLess>
        </div>
    );
};

export default Search;
