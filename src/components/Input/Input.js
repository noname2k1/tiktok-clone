import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames/bind';
import styles from './Input.module.scss';
import { ClosedEyesIcon, OpenEyesIcon } from '../icons';
import { useController } from 'react-hook-form';

const cx = classNames.bind(styles);

const Input = ({
    type = 'text',
    placeholder = 'fill me...',
    autoComplete = false,
    name,
    rules = {},
    control,
}) => {
    const [hidePassword, setHidePassword] = React.useState(true);
    const [typeInput, setTypeInput] = React.useState(type);
    // console.log(required);
    const { field } = useController({
        name /**This is the unique identifier used by React Hook Form**/,
        rules,
        control,
    });

    // console.log(control);

    const handleToggleEyes = () => {
        setHidePassword(!hidePassword);
        setTypeInput(hidePassword ? 'text' : 'password');
    };

    return (
        <div className={cx('wrapper')}>
            <input
                {...field}
                type={typeInput}
                placeholder={placeholder}
                className={cx('input')}
                spellCheck={'false'}
                autoComplete={autoComplete ? 'on' : 'off'}
            />
            {type === 'password' && (
                <div className={cx('after-input')} onClick={handleToggleEyes}>
                    {hidePassword ? <ClosedEyesIcon /> : <OpenEyesIcon />}
                </div>
            )}
        </div>
    );
};

Input.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    autoComplete: PropTypes.bool,
    rules: PropTypes.object,
};

export default Input;
