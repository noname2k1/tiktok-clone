import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames/bind';
import styles from './PrimaryModal.module.scss';
import { ChevronLeftIcon, CloseLargeIcon } from '~/components/icons';

const cx = classNames.bind(styles);

const PrimaryModal = ({
    children,
    headerTitle,
    closeButtonBg = false,
    footerTexts = [],
    backBtn = [],
    closeFunc = () => {},
    visible = false,
    footerItemFunc = () => {},
}) => {
    // display back btn if backBtn array length > 1
    const [value, backFunc] = backBtn;

    return (
        <div className={cx('overlay', { visible })}>
            <div className={cx('wrapper')}>
                {/* header begin */}
                <header className={cx('modal-header')}>
                    {value && (
                        <button className={cx('back-btn')} onClick={backFunc}>
                            <ChevronLeftIcon height='24' width='24' />
                        </button>
                    )}
                    {headerTitle && <h3>{headerTitle}</h3>}
                    <span
                        className={cx('close-btn', { 'have-bg': closeButtonBg })}
                        onClick={closeFunc}
                    >
                        <CloseLargeIcon />
                    </span>
                </header>
                {/* header end */}
                <div className={cx('modal-body')}>{children}</div>
                {/* footer begin */}
                {footerTexts.length > 0 && (
                    <footer className={cx('modal-footer')}>
                        {footerTexts.map((text, index) => (
                            <span key={index} className={cx('footer-item')}>
                                {text.startsWith('btn') ? (
                                    <button className={cx('btn')} onClick={footerItemFunc}>
                                        {text.slice(3)}
                                    </button>
                                ) : (
                                    text
                                )}
                            </span>
                        ))}
                    </footer>
                )}
                {/* footer end */}
            </div>
        </div>
    );
};

PrimaryModal.propTypes = {
    children: PropTypes.node.isRequired,
    headerTitle: PropTypes.string,
    closeButtonBg: PropTypes.bool,
    footerTexts: PropTypes.arrayOf(PropTypes.string),
    backBtn: PropTypes.array,
    closeFunc: PropTypes.func,
    visible: PropTypes.bool,
    footerItemFunc: PropTypes.func,
};

export default PrimaryModal;
