import React, { useState } from 'react';
import styles from './PhotoEditor.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Range({
    width = 280,
    height = 16,
    trackHeight = 6,
    min = 0,
    max = 100,
    step = 1,
    className,
    value: ousideValue,
    background = 'var(--primary-color)',
    trackBackground = '#ccc',
    thumbBackground = 'var(--primary-color)',
    ...props
}) {
    const [value, setValue] = useState(min); // set initial value

    const handleChange = (event) => {
        setValue(event.target.value); // update the state with new value
    };

    React.useEffect(() => {
        if (ousideValue !== undefined) {
            setValue(ousideValue);
        }
    }, [ousideValue]);

    // React.useEffect(() => {
    //     console.log(value);
    //     console.log(ousideValue);
    // }, [value, ousideValue]);

    return (
        <div
            className={cx('range-container', {
                [className]: className,
            })}
            style={{
                width,
                height,
            }}
        >
            <div
                className={cx('range-track')}
                style={{
                    height: trackHeight,
                    background: trackBackground,
                }}
            ></div>
            <div
                className={cx('line')}
                style={{
                    width: `${((value === 1 ? 0 : value) / max) * (width - height)}px`,
                    height: trackHeight,
                    background: thumbBackground,
                }}
            ></div>
            <div
                className={cx('range-thumb')}
                style={{
                    left: `${((value === 1 ? 0 : value) / max) * (width - height)}px`,
                    width: height,
                    height: height,
                    background: thumbBackground,
                }}
            ></div>
            <input
                type='range'
                step={step}
                min={min}
                max={max}
                value={value}
                onChange={handleChange}
                className={cx('range-input')}
                {...props}
            />
        </div>
    );
}

export default Range;
