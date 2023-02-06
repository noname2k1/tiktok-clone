import React from 'react';
import { QrCodeIcon, UserIcon } from '~/components/icons';
import { BasicAccountLogin, BasicAccountSignUp } from '~/components/modals/AuthModal/BasicAccount';
import { v4 as uuidv4 } from 'uuid';
import { authModalContext } from './constants';

const AuthModalProvider = ({ children }) => {
    const AuthModalContext = authModalContext;
    const AUTH_TYPES = {
        login: 'login',
        signUp: 'signUp',
    };
    const initContent = [
        {
            id: uuidv4(),
            title: 'Log in to TikTok',
            type: AUTH_TYPES.login,
            content: [
                {
                    id: uuidv4(),
                    label: 'Log in with QR code',
                    title: 'Use QR code',
                    type: AUTH_TYPES.login,
                    icon: <QrCodeIcon />,
                    content: 'Use QR code',
                    footer_texts: [`Don't have an account?`, 'btnSign up'],
                },
                {
                    id: uuidv4(),
                    title: 'Use phone / email',
                    type: AUTH_TYPES.login,
                    label: 'Log in',
                    icon: <UserIcon />,
                    content: <BasicAccountLogin />,
                    footer_texts: [`Don't have an account?`, 'btnSign up'],
                },
            ],
            footer_texts: [`Don't have an account?`, 'btnSign up'],
        },
    ];

    const SignUpContent = [
        {
            id: uuidv4(),
            title: 'Sign up for TikTok',
            type: AUTH_TYPES.signUp,
            content: [
                {
                    id: uuidv4(),
                    label: 'Sign up',
                    title: 'Use phone or email',
                    type: AUTH_TYPES.signUp,
                    icon: <UserIcon />,
                    content: <BasicAccountSignUp />,
                    footer_texts: [`Already have an account?`, 'btnLog in'],
                },
            ],
            footer_texts: [`Already have an account?`, 'btnLog in'],
        },
    ];
    const [currentContent, setCurrentContent] = React.useState(initContent);

    return (
        <AuthModalContext.Provider
            value={{ currentContent, setCurrentContent, initContent, SignUpContent, AUTH_TYPES }}
        >
            {children}
        </AuthModalContext.Provider>
    );
};

export default AuthModalProvider;
