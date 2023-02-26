import classNames from 'classnames/bind';
import React from 'react';
import { useSelector } from 'react-redux';
import { useAuthModalContext } from '~/contexts/AuthModalContext/constants';
import useModal from '~/hooks/useModal';

import PrimaryModal from '../PrimaryModal';
import styles from './AuthModal.module.scss';

const cx = classNames.bind(styles);

const AuthModal = () => {
    const { authModal } = useSelector((state) => state.modal);
    const [backBtn, setBackBtn] = React.useState(false);
    const { currentContent, setCurrentContent, initContent, SignUpContent, AUTH_TYPES } =
        useAuthModalContext();
    const { closeAuthModal } = useModal();

    React.useEffect(() => {
        if (currentContent.length < 2) {
            setBackBtn(false);
        } else {
            setBackBtn(true);
        }
    }, [currentContent]);

    const POLICY = `By continuing, you agree to TikTok’s
    <a target='_blank' href='policy'>Terms of Service</a>
    and confirm that you have read
TikTok’s
    <a href='policy' target='_blank' >Privacy Policy</a>
    `;
    const content = currentContent[currentContent.length - 1].content;
    const footerTexts = currentContent[currentContent.length - 1].footer_texts;
    const title = currentContent[currentContent.length - 1].title;
    const label = currentContent[currentContent.length - 1].label;
    const type = currentContent[currentContent.length - 1].type;

    const handleSetNewContent = (id) => {
        const newContent = content.find((item) => item.id === id);
        setCurrentContent([...currentContent, newContent]);
        setBackBtn(true);
    };

    const render = () => {
        if (Array.isArray(content) && content.length > 0) {
            return (
                <ul className={cx('content-list')}>
                    {content.map(({ id, icon, title }) => {
                        return (
                            <li
                                key={id}
                                className={cx('content-item')}
                                onClick={() => handleSetNewContent(id)}
                            >
                                <span className={cx('icon')}>{icon}</span>
                                <span className={cx('label')}>{title}</span>
                            </li>
                        );
                    })}
                </ul>
            );
        }
        const Component = content;
        return Component;
    };

    const handleBackBtnClick = () => {
        setCurrentContent((prev) => {
            return prev.slice(0, prev.length - 1);
        });
    };
    // console.log('currentContent');

    const handleCloseBtnClick = () => {
        closeAuthModal();
        setCurrentContent(initContent);
    };

    const switchAuthType = () => {
        if (type === AUTH_TYPES.login) {
            setCurrentContent(SignUpContent);
        } else {
            setCurrentContent(initContent);
        }
        // setBackBtn(false);
    };

    return (
        <PrimaryModal
            closeButtonBg={true}
            closeFunc={handleCloseBtnClick}
            footerTexts={footerTexts}
            footerItemFunc={switchAuthType}
            backBtn={[backBtn, handleBackBtnClick]}
            visible={authModal}
        >
            <div className={cx('modal-body')}>
                <h2 className={cx('title')}>{label || title}</h2>
                {render()}
                {type === AUTH_TYPES.signUp && (
                    <p className={cx('policy')} dangerouslySetInnerHTML={{ __html: POLICY }}></p>
                )}
            </div>
        </PrimaryModal>
    );
};

export default AuthModal;
