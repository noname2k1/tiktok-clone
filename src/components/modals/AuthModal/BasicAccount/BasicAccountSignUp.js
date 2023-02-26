import classNames from 'classnames/bind';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '~/components/Button';
import { LoadingEffect } from '~/components/effects';
import { SmallCheckIcon } from '~/components/icons';
import TextField from '~/components/TextField';
import config from '~/config';
import { useAuthModalContext } from '~/contexts/AuthModalContext/constants';
import useModal from '~/hooks/useModal';
import * as authService from '~/services/authService';
import { login } from '~/store/slices/authSlice';
import { setToast } from '~/store/slices/globalComponentSlice';

import styles from './BasicAccount.module.scss';

const cx = classNames.bind(styles);

const BasicAccountSignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { closeAuthModal } = useModal();

    const VALIDATE_LABEL = 'Your password must have:';
    const VALIDATION_PASSWORD_LENGTH = 'At least 6 characters';
    const EMAIL_LABEL_TEXT = 'Email';
    const SIGNUP_WITH_PHONE_TEXT = 'sign up with phone';
    const SIGNUP_BTN_TEXT = 'Sign up';
    const SIGNUP_SUCCESS_MESSAGE = 'sign up successfully';
    const SIGNUP_FAILED_MESSAGE = 'sign up failed, please try again';

    const { setCurrentContent, initContent } = useAuthModalContext();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [passwordFocus, setPasswordFocus] = React.useState(false);
    const [validationEmail, setValidationEmail] = React.useState([
        {
            id: 1,
            title: 'Please enter a valid email address',
            isValid: false,
            type: 'pattern',
        },
    ]);
    const emailErrorMessage = validationEmail.find((item) => !item.isValid)?.title;
    const [validationPassword, setValidationPassword] = React.useState([
        {
            id: 1,
            title: VALIDATION_PASSWORD_LENGTH,
            isValid: false,
            type: 'length',
        },
    ]);
    const [checkEmail, setCheckEmail] = React.useState(false);
    const [checkPassword, setCheckPassword] = React.useState(false);
    const [btnDisabled, setBtnDisabled] = React.useState(true);

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

    // console.log(getFieldState('password'));

    React.useEffect(() => {
        if (
            isDirty &&
            email &&
            password &&
            validationPassword.every((item) => item.isValid) &&
            validationEmail.every((item) => item.isValid)
        ) {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
    }, [email, password, isDirty, validationPassword, validationEmail]);

    const validatePassword = (value) => {
        const validationRuleIndex = validationPassword.findIndex((item) => item.type === 'length');
        if (value.length >= 6) {
            setValidationPassword((prevState) => {
                const newState = [...prevState];
                newState[validationRuleIndex].isValid = true;
                return newState;
            });
        } else {
            setValidationPassword((prevState) => {
                const newState = [...prevState];
                newState[validationRuleIndex].isValid = false;
                return newState;
            });
        }
    };

    const validateEmail = (value) => {
        const validationRuleIndex = validationEmail.findIndex((item) => item.type === 'pattern');
        const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (pattern.test(value)) {
            setValidationEmail((prevState) => {
                const newState = [...prevState];
                newState[validationRuleIndex].isValid = true;
                return newState;
            });
        } else {
            setValidationEmail((prevState) => {
                const newState = [...prevState];
                newState[validationRuleIndex].isValid = false;
                return newState;
            });
        }
    };

    const handleFocus = (e) => {
        const input = e.target;
        const value = input.value;
        if (input.type === 'password' && input.name === 'password' && !passwordFocus) {
            validatePassword(value);
            setPasswordFocus(true);
            if (value.length > 0) {
                setCheckPassword(true);
            } else {
                setCheckPassword(false);
            }
        } else {
            if (!checkPassword) {
                setPasswordFocus(false);
            }
        }
        // if (value === 'email') {
        //     validateEmail(value);
        // }
    };

    const handleBlur = (e) => {
        const value = e.target.value;
        if (!checkPassword || value.length >= 6) {
            setPasswordFocus(false);
        }
        if (!emailErrorMessage) {
            setCheckEmail(false);
        }
    };

    const handleInput = (e) => {
        const input = e.target;
        const value = input.value;
        if (input.type === 'email' && input.name === 'email') {
            if (value.length > 0) {
                setCheckEmail(true);
            } else {
                setCheckEmail(false);
            }
            validateEmail(value);
        }
        if (input.type === 'password' && input.name === 'password') {
            if (value.length > 0) {
                setCheckPassword(true);
            } else {
                setCheckPassword(false);
            }
            validatePassword(value);
        }
    };

    const handleLogin = (token, user) => {
        const payload = {
            token,
            user,
        };
        dispatch(login(payload));
    };

    const onSubmit = ({ email, password }) => {
        authService
            .signup(email, password)
            .then((data) => {
                const { token } = data.meta;
                const user = data.data;
                handleLogin(token, user);
                dispatch(setToast({ enabled: true, content: SIGNUP_SUCCESS_MESSAGE }));
                closeAuthModal();
                setCurrentContent(initContent);
                navigate(config.routes.login, {
                    state: { from: location.pathname },
                });
                setBtnDisabled(false);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                if (err.status_code === 401 || err.status_code === 409) {
                    setError(SIGNUP_FAILED_MESSAGE);
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
            autoComplete: false,
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
                <span className={cx('label')}>{EMAIL_LABEL_TEXT}</span>
                <span className={cx('switch')}>{SIGNUP_WITH_PHONE_TEXT}</span>
            </div>
            {inputList.map((input, index) => (
                <div key={index} className={cx('input-wrapper')} onClick={handleRemoveError}>
                    <TextField
                        type={input.type}
                        name={input.name}
                        placeholder={input.placeHolder}
                        autoComplete={input.autoComplete}
                        rules={input.rules}
                        control={control}
                        onInput={handleInput}
                        onBlurInput={handleBlur}
                        onFocusInput={handleFocus}
                    />
                    {/* validate password box */}
                    {input.type === 'password' && input.name === 'password' && passwordFocus && (
                        <div className={cx('validation-password')}>
                            <header>{VALIDATE_LABEL}</header>
                            {validationPassword.map((item, index) => (
                                <div
                                    key={index}
                                    className={cx('validation-item', {
                                        'is-valid': item.isValid && checkPassword,
                                        'is-invalid': !item.isValid && checkPassword,
                                    })}
                                >
                                    <span className={cx('validation-icon')}>
                                        <SmallCheckIcon />
                                    </span>
                                    <span className={cx('validation-text')}>{item.title}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {checkEmail &&
                        input.type === 'email' &&
                        input.name === 'email' &&
                        emailErrorMessage && (
                            <span className={cx('error')}>{emailErrorMessage}</span>
                        )}
                    {errors[input.name] && (
                        <span className={cx('error')}>{errors[input.name].message}</span>
                    )}
                </div>
            ))}
            {error && <p className={cx('error-after-submit')}>{error}</p>}
            <Button
                primary
                disabled={btnDisabled}
                className={cx('button')}
                onClick={handleClickSubmitBtn}
            >
                {SIGNUP_BTN_TEXT}
            </Button>

            {loading && <LoadingEffect />}
        </form>
    );
};

export default BasicAccountSignUp;
