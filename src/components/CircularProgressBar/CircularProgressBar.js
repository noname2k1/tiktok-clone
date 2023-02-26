import PropTypes from 'prop-types';

import React from 'react';
import { CircularProgressbar as CP, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CircularProgressbar = ({
    percentage,
    textColor = 'var(--text-color)',
    pathColor = 'var(--primary-color)',
    trailColor = 'var(--bg-color-secondary)',
}) => {
    return (
        <div style={{ width: '100px' }}>
            <CP
                value={percentage}
                text={`${percentage}%`}
                styles={buildStyles({
                    textColor,
                    pathColor,
                    trailColor,
                })}
            />
        </div>
    );
};

CircularProgressbar.propTypes = {
    percentage: PropTypes.number,
    textColor: PropTypes.string,
    pathColor: PropTypes.string,
    trailColor: PropTypes.string,
};

export default CircularProgressbar;
