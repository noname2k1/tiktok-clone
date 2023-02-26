import PropTypes from 'prop-types';

import React from 'react';
import Dialog from '../Dialog';
import styled from 'styled-components';

const ConTent = styled.div`
    padding: 20px;
    font-size: 1.8rem;
    line-height: 1.5;
    color: var(--light-color);
`;

const ReplaceVideoDialog = ({ visible, ok, cancel }) => {
    const TITLE = 'Replace this video?';
    const options = [
        {
            id: 0,
            label: 'Replace',
            onClick: () => {
                ok();
            },
            style: {
                color: 'var(--primary-color)',
            },
        },
        {
            id: 1,
            label: 'Continue editing',
            onClick: () => {
                cancel();
            },
            style: {
                color: 'var(--text-color)',
            },
        },
    ];

    return (
        <Dialog visible={visible} title={TITLE} options={options}>
            <ConTent>Caption and video settings will still be saved.</ConTent>
        </Dialog>
    );
};

ReplaceVideoDialog.propTypes = {
    visible: PropTypes.bool,
    ok: PropTypes.func,
    cancel: PropTypes.func,
};

export default ReplaceVideoDialog;
