import React from 'react';
import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import images from '~/assets/images';
import footerItems from './footerItems';
import CustomSelect from '~/components/Custom/CustomSelect';

const cx = classNames.bind(styles);

const Footer = () => {
    return (
        <footer className={cx('container')}>
            <div className={cx('above-part')}>
                <div className={cx('logo')}>
                    <img src={images.musicNote} alt='music-note' />
                    <img src={images.logoText} alt='logo-text' />
                </div>
                {footerItems.map((item) => (
                    <div className={cx('footer-content-column')} key={item.id}>
                        <h4 className={cx('item-title')}>{item.title}</h4>
                        {item.items.map((subItem) => (
                            <span key={subItem.id}>
                                <a className={cx('item-sub-column')} href={subItem.link}>
                                    <h5 className={cx('sub-item-title')}>{subItem.title}</h5>
                                </a>
                            </span>
                        ))}
                    </div>
                ))}
            </div>
            <div className={cx('below-part')}>
                <div className={cx('language-box')}>
                    <CustomSelect
                        items={[
                            { id: 1, value: 'en', label: 'English' },
                            { id: 2, value: 'vi', label: 'Vietnamese' },
                        ]}
                        placement='top'
                        short
                        bgColor='black'
                    />
                </div>
                <div className={cx('copyright')}>© 2023 TikTok-clone</div>
            </div>
        </footer>
    );
};

export default Footer;
