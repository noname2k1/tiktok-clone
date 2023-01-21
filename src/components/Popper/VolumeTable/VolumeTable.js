import PropTypes from 'prop-types';
import React from 'react';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import styles from './VolumeTable.module.scss';
import classNames from 'classnames/bind';
import InputRange from '~/components/InputRange';

const cx = classNames.bind(styles);

const VolumeTable = ({ children, changeVolume, currentVolume, offset = [], medium = false }) => {
    const handleChangeVolume = (e) => {
        const volumeValue = e.target.value;
        changeVolume(+volumeValue);
    };

    const renderVolumeTable = () => {
        return (
            <div className={cx('wrapper', { medium })}>
                <InputRange min='0' max='1' step='0.1' valueState={[currentVolume, handleChangeVolume]} />
            </div>
        );
    };
    return (
        <div>
            <Tippy
                placement='top'
                interactive
                render={renderVolumeTable}
                // visible
                offset={offset}
            >
                {children}
            </Tippy>
        </div>
    );
};

VolumeTable.propTypes = {
    children: PropTypes.node,
    changeVolume: PropTypes.func,
    offset: PropTypes.array,
    medium: PropTypes.bool,
};

export default VolumeTable;
