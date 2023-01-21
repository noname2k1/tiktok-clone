import PropTypes from 'prop-types';
import React from 'react';
import styles from './InputRange.module.scss';
import classNames from 'classnames/bind';
import styled from 'styled-components';

const cx = classNames.bind(styles);

const Range = styled.input`
    -webkit-appearance: none;
    appearance: none;
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    background-image: linear-gradient(
        90deg,
        ${(props) => props.fillColor} ${(props) => (props.value / props.max) * 100 - 30}%,
        ${(props) => props.backgroundColor}
    );
    cursor: pointer;
    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        background-color: #fff;
    }
`;

const InputRange = ({
    min = 0,
    max = 10,
    valueState = [],
    width = '80%',
    height = '4px',
    step = 1,
    backgroundColor = '#000',
    fillColor = '#fff',
}) => {
    const [value, setValue] = valueState;

    return (
        <Range
            type='range'
            value={value}
            min={+min}
            max={+max}
            step={+step}
            onInput={setValue}
            // onChange={setValue}
            className={cx('input-range')}
            width={width}
            height={height}
            backgroundColor={backgroundColor}
            fillColor={fillColor}
        />
    );
};

InputRange.propTypes = {
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    valueState: PropTypes.array,
    width: PropTypes.string,
    height: PropTypes.string,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    backgroundColor: PropTypes.string,
    fillColor: PropTypes.string,
};

export default InputRange;
