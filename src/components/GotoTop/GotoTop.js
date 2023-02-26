import React from 'react';
import styled from 'styled-components';
import { GoToTopIcon } from '../icons';

const GotoTopWrapper = styled.div`
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    visibility: ${({ showGotoTop }) => (showGotoTop ? 'visible' : 'hidden')};
    opacity: ${({ showGotoTop }) => (showGotoTop ? 1 : 0)};
    transition: all 0.3s ease-in-out;
    transform: ${({ showGotoTop }) => (showGotoTop ? 'translateY(0)' : 'translateY(100px)')};
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background-color: var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
`;

const handleGotoTop = () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
    });
};

const GotoTop = () => {
    const [showGotoTop, setShowGotoTop] = React.useState(false);
    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowGotoTop(true);
            } else {
                setShowGotoTop(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <GotoTopWrapper showGotoTop={showGotoTop} onClick={handleGotoTop}>
            <GoToTopIcon />
        </GotoTopWrapper>
    );
};

export default GotoTop;
