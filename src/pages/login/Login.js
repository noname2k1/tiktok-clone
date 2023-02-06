import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingEffect } from '~/components/effects';
import config from '~/config';
import { useScrollLock } from '~/hooks';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
`;

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: config.routes.home } };
    const { unlockScroll } = useScrollLock();
    React.useEffect(() => {
        unlockScroll();
        setTimeout(() => {
            navigate(from);
        }, 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Wrapper>
            <LoadingEffect />
        </Wrapper>
    );
};

export default Login;
