import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react/headless';
import React from 'react';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import MenuItem from './MenuItem';
import Header from './Header';

const cx = classNames.bind(styles);

const defaultFunction = () => {};

const Menu = ({
    items = [],
    hideOnClick = false,
    children,
    onChange = defaultFunction,
}) => {
    const [history, setHistory] = React.useState([{ data: items }]);
    const currentHistory = history[history.length - 1];

    const renderItems = () => {
        return currentHistory.data.map((item, index) => (
            <MenuItem
                key={index}
                data={item}
                onClick={() => {
                    if (item.children) {
                        setHistory([...history, item.children]);
                    }
                    // onChange(item);
                }}
                separateTop={item.separateTop}
            />
        ));
    };

    const handleBackToPreviousLevel = () => {
        setHistory(history.slice(0, history.length - 1));
    };

    const renderWrapper = (attrs) => (
        <div className={cx('menu-list')} tabIndex='-1' {...attrs}>
            <PopperWrapper className={cx('submenu')}>
                {currentHistory.title && (
                    <Header
                        title={currentHistory.title}
                        onBack={handleBackToPreviousLevel}
                    />
                )}
                <div className={cx('menu-body')}>{renderItems()}</div>
            </PopperWrapper>
        </div>
    );

    const handleReturnToFirstLevel = () => {
        setHistory((prev) => prev.slice(0, 1));
    };

    return (
        <Tippy
            // appendTo={() => document.body}
            interactive
            placement='bottom-end'
            // visible
            offset={[12, 8]}
            delay={[0, 700]}
            hideOnClick={hideOnClick}
            render={renderWrapper}
            onHide={handleReturnToFirstLevel}
        >
            {children}
        </Tippy>
    );
};

Menu.propTypes = {
    items: PropTypes.array,
    hideOnClick: PropTypes.bool,
    children: PropTypes.node.isRequired,
    onChange: PropTypes.func,
};

export default Menu;
