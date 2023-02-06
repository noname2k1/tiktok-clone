import React from 'react';

const useScrollLock = () => {
    const lockScroll = React.useCallback(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = 'var(--scrollbar-compensation)';
        document.body.dataset.scrollLock = 'true';
    }, []);

    const unlockScroll = React.useCallback(() => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        delete document.body.dataset.scrollLock;
    }, []);

    return {
        lockScroll,
        unlockScroll,
    };
};

export default useScrollLock;
