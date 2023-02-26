import PropTypes from 'prop-types';
import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

const Tooltip = ({ children, content, placement = 'bottom', ...props }) => {
    return (
        <Tippy content={content} placement={placement} {...props}>
            {children}
        </Tippy>
    );
};

Tooltip.propTypes = {
    children: PropTypes.node.isRequired,
    content: PropTypes.string.isRequired,
};

export default Tooltip;
