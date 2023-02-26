import React from 'react';
import Header from '~/layouts/components/Header';
import Footer from '~/layouts/components/Footer';
import classNames from 'classnames/bind';
import styles from './Upload.module.scss';
import UploadBody from './UploadBody';

const cx = classNames.bind(styles);

const Upload = () => {
    const UPLOAD_TITLE = 'Upload';
    React.useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `${UPLOAD_TITLE} | TikTok clone`;
    }, []);

    return (
        <div className={cx('upload-container')}>
            <Header />
            <UploadBody />
            <Footer />
        </div>
    );
};

export default Upload;
