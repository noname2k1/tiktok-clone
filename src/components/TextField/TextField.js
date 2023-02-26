import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames/bind';
import styles from './TextField.module.scss';
import { ClosedEyesIcon, OpenEyesIcon } from '../icons';
import { useController } from 'react-hook-form';

const cx = classNames.bind(styles);

const TextField = React.forwardRef(
    (
        {
            type = 'text',
            placeholder = 'fill me...',
            autoComplete = false,
            name,
            rules = {},
            control,
            onFocusInput,
            onBlurInput,
            onInput,
            className,
            tag = 'input',
            afterInput,
            border,
            ...props
        },
        ref
    ) => {
        const [hidePassword, setHidePassword] = React.useState(true);
        const [typeInput, setTypeInput] = React.useState(type);
        // console.log(required);
        const { field } = useController({
            name /**This is the unique identifier used by React Hook Form**/,
            rules,
            control,
        });

        let InputField;

        if (tag === 'textarea') {
            InputField = 'textarea';
        } else if (tag === 'input') {
            InputField = 'input';
        }

        const handleToggleEyes = () => {
            setHidePassword(!hidePassword);
            setTypeInput(hidePassword ? 'text' : 'password');
        };

        return (
            <div
                className={cx('wrapper', {
                    [className]: className,
                })}
                style={{
                    border: `1px solid ${border ? border : 'transparent'}`,
                }}
            >
                <InputField
                    {...field}
                    type={typeInput}
                    placeholder={placeholder}
                    className={cx('input', {
                        [className]: className,
                    })}
                    spellCheck={'false'}
                    autoComplete={autoComplete ? 'on' : 'off'}
                    onFocus={onFocusInput}
                    onBlur={onBlurInput}
                    onInput={onInput}
                    ref={ref}
                    {...props}
                />
                {type === 'password' && (
                    <div className={cx('after-input')} onClick={handleToggleEyes}>
                        {hidePassword ? <ClosedEyesIcon /> : <OpenEyesIcon />}
                    </div>
                )}
                {afterInput && <div className={cx('after-input')}>{afterInput}</div>}
            </div>
        );
    }
);

TextField.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    autoComplete: PropTypes.bool,
    rules: PropTypes.object,
    control: PropTypes.object,
    onFocusInput: PropTypes.func,
    onBlurInput: PropTypes.func,
    onInput: PropTypes.func,
    tag: PropTypes.string,
    afterInput: PropTypes.node,
    border: PropTypes.string,
};

export default TextField;
