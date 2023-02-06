import React from 'react';
import classNames from 'classnames/bind';
import styles from './BasicAccount.module.scss';
import Input from '~/components/Input';
import Button from '~/components/Button';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as authService from '~/services/authService';
import { login } from '~/store/slices/authSlice';
import { LoadingEffect } from '~/components/effects';
import { setToast } from '~/store/slices/globalComponentSlice';
import { useAuthModalContext } from '~/contexts/AuthModalContext/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '~/config';
import useAuthModal from '~/hooks/useModal';

const cx = classNames.bind(styles);

const BasicAccountLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { closeAuthModal } = useAuthModal();
    const { setCurrentContent, initContent } = useAuthModalContext();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [btnDisabled, setBtnDisabled] = React.useState(true);

    const LOGIN_SUCCESS_MESSAGE = 'Login successfully';
    const LOGIN_FAILED_MESSAGE = 'Login failed, please try again';

    const {
        handleSubmit,
        formState: { errors, isDirty, dirtyFields },
        control,
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const { email, password } = dirtyFields;

    React.useEffect(() => {
        if (isDirty && email && password) {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
    }, [email, password, isDirty]);

    const handleLogin = (token, user) => {
        const payload = {
            token,
            user,
        };
        dispatch(login(payload));
    };

    const onSubmit = ({ email, password }) => {
        authService
            .login(email, password)
            .then((data) => {
                const { token } = data.meta;
                const user = data.data;
                handleLogin(token, user);
                dispatch(setToast({ enabled: true, content: LOGIN_SUCCESS_MESSAGE }));
                closeAuthModal();
                setCurrentContent(initContent);
                navigate(config.routes.login, {
                    state: { from: location.pathname },
                });
                setBtnDisabled(false);
                setLoading(false);
            })
            .catch((err) => {
                if (err.status_code === 401) {
                    setError(LOGIN_FAILED_MESSAGE);
                    setLoading(false);
                    setBtnDisabled(false);
                    return;
                }
            });
    };

    const handleRemoveError = () => {
        setError('');
    };

    const handleClickSubmitBtn = (e) => {
        e.preventDefault();
        setBtnDisabled(true);
        setLoading(true);
        setError('');
        handleSubmit(onSubmit)();
    };

    const inputList = [
        {
            type: 'email',
            name: 'email',
            placeHolder: 'Email',
            autoComplete: true,
            rules: {
                required: {
                    value: true,
                    message: 'Email is required',
                },
                pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                },
            },
        },
        {
            type: 'password',
            name: 'password',
            placeHolder: 'Password',
            autoComplete: false,
            rules: {
                required: {
                    value: true,
                    message: 'Password is required',
                },
                // pattern: {
                //     value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                //     message:
                //         'Password must be at least 8 characters long and contain at least one letter and one number',
                // },
                minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters long',
                },
            },
        },
    ];

    return (
        <form className={cx('wrapper')}>
            <div className={cx('description')}>
                <span className={cx('label')}>Email</span>
                <span className={cx('switch')}>Log in with phone</span>
            </div>
            {inputList.map((input, index) => (
                <div key={index} className={cx('input-wrapper')} onClick={handleRemoveError}>
                    <Input
                        type={input.type}
                        name={input.name}
                        placeholder={input.placeHolder}
                        autoComplete={input.autoComplete}
                        rules={input.rules}
                        control={control}
                    />
                    {errors[input.name] && (
                        <span className={cx('error')}>{errors[input.name].message}</span>
                    )}
                </div>
            ))}
            <div className={cx('forgot-password')}>Forgot password?</div>
            {error && <p className={cx('error-after-submit')}>{error}</p>}
            <Button
                primary
                disabled={btnDisabled}
                className={cx('button')}
                onClick={handleClickSubmitBtn}
            >
                Log in
            </Button>
            {loading && <LoadingEffect />}
        </form>
    );
};

export default BasicAccountLogin;
