import PropTypes from 'prop-types';
import React from 'react';
import styles from './CustomSelect.module.scss';
import classNames from 'classnames/bind';
import { SelectPostFixIcon } from '~/components/icons';

const cx = classNames.bind(styles);

const CustomSelect = ({
    items = [],
    value = {},
    onChange = () => {},
    short = false,
    medium = false,
    long = false,
    placement = 'bottom',
    bgColor,
}) => {
    const [expanded, setExpanded] = React.useState(false);
    const [termValue, setTermValue] = React.useState({});

    const handleSelectChange = (item) => {
        onChange(item);
        setTermValue(item);
    };

    const handleSelectClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div className={cx('container')}>
            <div
                className={cx('fake-select', {
                    short,
                    medium,
                    long,
                    [bgColor]: true,
                })}
                onClick={handleSelectClick}
            >
                <span className={cx('current-value')}>{value.label || termValue.label}</span>
                <div
                    className={cx('arrow', {
                        expanded,
                    })}
                >
                    <SelectPostFixIcon />
                </div>
                <ul
                    className={cx('select-list', {
                        expanded,
                        [placement]: true,
                    })}
                >
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className={cx('select-item', {
                                selected: item.id === value.id,
                            })}
                            onClick={() => handleSelectChange(item)}
                        >
                            {item.label}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

CustomSelect.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
    value: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    }),
    onChange: PropTypes.func,
    short: PropTypes.bool,
    medium: PropTypes.bool,
    long: PropTypes.bool,
    placement: PropTypes.oneOf(['top', 'bottom']),
    darkmode: PropTypes.oneOf(['white', 'gray', 'black']),
};

export default CustomSelect;
