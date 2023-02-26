import classNames from 'classnames/bind';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '~/components/Button';
import Image from '~/components/Image';
import * as authService from '~/services/authService';
import * as userService from '~/services/userService';
import { setCurrentUser } from '~/store/slices/authSlice';
import { setToast } from '~/store/slices/globalComponentSlice';
import styles from './EditProfileModal.module.scss';
import TextField from '~/components/TextField';
import {
    // CloseIcon,
    CloseLargeIcon,
    EditAvatarIcon,
    SmallCheckIcon,
    SpinnerIcon,
} from '~/components/icons';
import { setTermAvatarEnabled, setTermAvatarURL } from '~/store/slices/termSlice';
import { useDebounce } from '~/hooks';

const cx = classNames.bind(styles);

const BodyModal = ({ formManager, cancel, defaultValues, avatar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const inputFileRef = React.useRef(null);
    const { termAvatarURL } = useSelector((state) => state.term);
    const [termNickname, setTermNickname] = React.useState(defaultValues.nickname);
    const [loadingNickname, setLoadingNickname] = React.useState(false);
    const [termBioLength, setTermBioLength] = React.useState(defaultValues.bio?.length || 0);
    const { editProfileModal } = useSelector((state) => state.modal);

    const CANCEL_BTN_TEXT = 'Cancel';
    const SAVE_BTN_TEXT = 'Save';
    // label constants
    const PROFILE_PHOTO_LABEL = 'Profile Photo';
    const NICK_NAME = 'Nickname';
    const FIRST_NAME = 'First name';
    const LAST_NAME = 'Last name';
    const BIO_LABEL = 'Bio';
    const UPDATED_PROFILE = 'Profile updated successfully';
    const HOST_URL = process.env.REACT_APP_HOST_URL;
    const MIN_LENGTH = 3;
    const MIN_NICKNAME_LENGTH = 6;
    const PRIMARY_RULES = {
        required: {
            value: true,
            message: 'This field is required',
        },
        minLength: {
            value: MIN_LENGTH,
            message: 'First name must be at least ' + MIN_LENGTH + ' characters',
        },
        maxLength: {
            value: 20,
            message: 'First name must be at most 20 characters',
        },
        // pattern: {
        //     value: /^[a-zA-Z]{3,20}$/,
        //     message: 'First name can only contain letters',
        // },
    };

    const NICKNAME_RULES = {
        ...PRIMARY_RULES,
        minLength: {
            value: MIN_NICKNAME_LENGTH,
            message: 'Nickname must be at least ' + MIN_NICKNAME_LENGTH + ' characters',
        },
    };

    const BIO_RULES = {
        maxLength: {
            value: 80,
            message: 'Bio must be at most 80 characters',
        },
    };

    React.useEffect(() => {
        if (location) {
            formManager.reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    React.useEffect(() => {
        if (!editProfileModal.enabled || !termAvatarURL.enabled) {
            URL.revokeObjectURL(termAvatarURL);
            dispatch(setTermAvatarEnabled(false));
            setTermNickname(defaultValues.nickname);
            setTermBioLength(defaultValues.bio?.length || 0);
            inputFileRef.current.value = '';
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editProfileModal.enabled, termAvatarURL.enabled]);

    const {
        control,
        trigger,
        handleSubmit,
        formState: { errors, isValid, isDirty },
    } = formManager;

    // React.useEffect(() => {
    //     console.log(!isValid, !isDirty);
    // }, [isDirty, isValid]);

    const handleCloseModal = () => {
        cancel();
        URL.revokeObjectURL(termAvatarURL.url);
        dispatch(setTermAvatarURL(''));
        setTermNickname(defaultValues.nickname);
        setTermBioLength(defaultValues.bio?.length || 0);
    };

    const handleStartChoosePhoto = () => {
        inputFileRef.current.click();
    };

    const handleChoosePhoto = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (termAvatarURL.url) URL.revokeObjectURL(termAvatarURL.url);
            dispatch(setTermAvatarURL(URL.createObjectURL(file)));
            dispatch(setTermAvatarEnabled(true));
        } else {
            URL.revokeObjectURL(termAvatarURL.url);
            dispatch(setTermAvatarURL(''));
            dispatch(setTermAvatarEnabled(false));
        }
    };

    const debouncedTermNickname = useDebounce(termNickname, 500);
    const checkNickname = async () => {
        userService
            .getAnUser(debouncedTermNickname)
            .then((res) => {
                if (res.nickname === defaultValues.nickname) {
                    formManager.clearErrors('nickname');
                    setLoadingNickname(false);
                } else {
                    formManager.setError('nickname', {
                        type: 'manual',
                        message: 'Nickname already exists',
                    });
                    setLoadingNickname(false);
                }
            })
            .catch((err) => {
                console.log(err);
                formManager.clearErrors('nickname');
                setLoadingNickname(false);
            });
    };

    React.useEffect(() => {
        if (debouncedTermNickname && debouncedTermNickname.length >= MIN_LENGTH) {
            setLoadingNickname(true);
            checkNickname();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedTermNickname]);

    const handleNicknameInput = async (e) => {
        await trigger('nickname');
        setTermNickname(e.target.value);
    };

    const handleBioInput = async (e) => {
        setTermBioLength(e.target.value.length);
        await trigger('bio');
    };

    const profileChange = (data) => {
        dispatch(setCurrentUser(data));
        dispatch(setToast({ enabled: true, content: UPDATED_PROFILE }));
        setTimeout(() => {
            navigate(`/@${data.nickname}`, { replace: true });
        }, 700);
    };

    const handleClearNickname = () => {
        setTermNickname(defaultValues.nickname);
        formManager.setValue('nickname', defaultValues.nickname);
    };

    const handleSave = () => {
        handleSubmit(async (data) => {
            const formData = new FormData();
            if (termAvatarURL.url) {
                const blob = await fetch(termAvatarURL.url).then((res) => res.blob());
                const avatar = new File(
                    [blob],
                    `avatar-${defaultValues.nickname}-${new Date()}.png`,
                    {
                        type: 'image/png',
                    }
                );
                formData.append('avatar', avatar);
            }
            // console.log(data);
            if (data.nickname !== defaultValues.nickname) {
                formData.append('nickname', data.nickname);
            }
            if (data.first_name !== defaultValues.first_name) {
                formData.append('first_name', data.first_name);
            }
            if (data.last_name !== defaultValues.last_name) {
                formData.append('last_name', data.last_name);
            }
            if (data.bio !== defaultValues.bio) {
                formData.append('bio', data.bio);
            }

            authService
                .updateMyProfile(formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((res) => profileChange(res))
                .catch((err) => console.log(err));
        })();
        handleCloseModal();
    };

    const handleValidateInput = async (name, value) => {
        await trigger(name);
        if (name === 'nickname' && value.length >= MIN_LENGTH) {
            checkNickname();
        }
    };

    const editProfileItems = [
        {
            id: 0,
            label: NICK_NAME,
            content: (
                <>
                    <TextField
                        name={'nickname'}
                        placeholder={NICK_NAME}
                        rules={NICKNAME_RULES}
                        control={control}
                        className={cx('textfield')}
                        onBlurInput={async (e) => {
                            await handleValidateInput('nickname', e.target.value);
                        }}
                        border={errors.nickname ? 'var(--error-color)' : ''}
                        onInput={handleNicknameInput}
                        afterInput={
                            loadingNickname ? (
                                <SpinnerIcon />
                            ) : errors.nickname && !loadingNickname ? (
                                <CloseLargeIcon
                                    width='12'
                                    height='12'
                                    fill={'#ff0000'}
                                    onClick={handleClearNickname}
                                />
                            ) : (
                                <SmallCheckIcon fill={'#00c853'} />
                            )
                        }
                    />
                    {errors.nickname ? (
                        <div className={cx('error-message')}>{errors.nickname.message}</div>
                    ) : (
                        <div className={cx('description')}>{HOST_URL + termNickname}</div>
                    )}
                </>
            ),
        },
        {
            id: 1,
            label: FIRST_NAME,
            content: (
                <>
                    <TextField
                        name={'first_name'}
                        placeholder={FIRST_NAME}
                        rules={PRIMARY_RULES}
                        control={control}
                        border={errors.first_name ? 'var(--error-color)' : ''}
                        className={cx('textfield')}
                        onBlurInput={async (e) => {
                            await handleValidateInput('first_name');
                        }}
                        onInput={async (e) => {
                            await handleValidateInput('first_name');
                        }}
                    />
                    {errors.first_name && (
                        <div className={cx('error-message')}>{errors.first_name.message}</div>
                    )}
                </>
            ),
        },
        {
            id: 2,
            label: LAST_NAME,
            content: (
                <>
                    <TextField
                        name={'last_name'}
                        placeholder={LAST_NAME}
                        rules={PRIMARY_RULES}
                        control={control}
                        border={errors.last_name ? 'var(--error-color)' : ''}
                        className={cx('textfield')}
                        onBlurInput={async (e) => {
                            await handleValidateInput('last_name');
                        }}
                        onInput={async (e) => {
                            await handleValidateInput('last_name');
                        }}
                    />
                    {errors.last_name && (
                        <div className={cx('error-message')}>{errors.last_name.message}</div>
                    )}
                </>
            ),
        },
        {
            id: 3,
            label: BIO_LABEL,
            content: (
                <>
                    <TextField
                        tag='textarea'
                        name='bio'
                        placeholder='Bio'
                        rules={BIO_RULES}
                        control={control}
                        className={cx('textfield')}
                        border={errors.bio ? 'var(--error-color)' : ''}
                        onBlurInput={async (e) => {
                            await handleValidateInput('bio');
                        }}
                        onInput={handleBioInput}
                    />
                    {errors.bio && <div className={cx('error-message')}>{errors.bio.message}</div>}
                    {termBioLength <= BIO_RULES.maxLength.value ? (
                        <div className={cx('description')}>
                            {termBioLength}/{BIO_RULES.maxLength.value}
                        </div>
                    ) : (
                        <div className={cx('error-message')}>
                            {termBioLength}/{BIO_RULES.maxLength.value}
                        </div>
                    )}
                </>
            ),
        },
    ];

    return (
        <>
            <div className={cx('modal-body')}>
                <div className={cx('item')}>
                    <div className={cx('label')}>{PROFILE_PHOTO_LABEL}</div>
                    <div className={cx('content')}>
                        <div className={cx('profile-photo')}>
                            <div className={cx('photo')} onClick={handleStartChoosePhoto}>
                                <Image
                                    src={termAvatarURL.url || avatar}
                                    alt={defaultValues.nickname}
                                />
                                <div className={cx('edit-avatar')}>
                                    <EditAvatarIcon />
                                </div>
                            </div>
                            <input
                                type='file'
                                name={'avatar'}
                                style={{ display: 'none' }}
                                ref={inputFileRef}
                                onInput={handleChoosePhoto}
                                accept='image/*'
                            />
                        </div>
                    </div>
                </div>
                {editProfileItems.map((item) => (
                    <div className={cx('item')} key={item.id}>
                        <div className={cx('label')}>{item.label}</div>
                        <div className={cx('content')}>{item.content}</div>
                    </div>
                ))}
            </div>
            <div className={cx('modal-footer')}>
                <Button onClick={handleCloseModal}>{CANCEL_BTN_TEXT}</Button>
                <Button
                    disabled={(!isValid || !isDirty) && !termAvatarURL.url}
                    primary
                    onClick={handleSave}
                >
                    {SAVE_BTN_TEXT}
                </Button>
            </div>
        </>
    );
};

export default BodyModal;
