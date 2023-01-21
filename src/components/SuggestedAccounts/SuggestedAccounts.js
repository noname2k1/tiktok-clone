import PropTypes from 'prop-types';
import React from 'react';
import styles from './SuggestedAccounts.module.scss';
import classNames from 'classnames/bind';
import AccountItem from './AccountItem';

const cx = classNames.bind(styles);

const SuggestedAccounts = ({
    label,
    show,
    data = [],
    onViewChange,
    isSeeAll,
    emptyLabel,
}) => {
    return (
        <div className={cx('wrapper')}>
            <p className={cx('label')}>{label}</p>
            {data.length > 0 &&
                data.map((user) => (
                    <AccountItem key={user.id} show={show} user={user} />
                ))}
            {data.length === 0 && <p className={cx('empty')}>{emptyLabel}</p>}
            {data.length > 0 && (
                <p className={cx('see-label')} onClick={onViewChange}>
                    {isSeeAll ? 'See less' : 'See all'}
                </p>
            )}
        </div>
    );
};

SuggestedAccounts.propTypes = {
    label: PropTypes.string.isRequired,
    show: PropTypes.bool,
    data: PropTypes.array,
    onViewChange: PropTypes.func,
    isSeeAll: PropTypes.bool,
    emptyLabel: PropTypes.string,
};

export default SuggestedAccounts;
