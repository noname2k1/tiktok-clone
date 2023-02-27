import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingEffect } from '~/components/effects';
import config from '~/config';
import { logout } from '~/store/slices/authSlice';
import styled from 'styled-components';
import { setFollowingUsers } from '~/store/slices/followSlice';

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
`;
const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    // console.log('location', location);
    React.useEffect(() => {
        dispatch(logout());
        dispatch(setFollowingUsers([]));
        setTimeout(() => {
            localStorage.removeItem('persist:root');
            navigate(location.state || config.routes.home);
        }, 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Wrapper>
            <LoadingEffect />
        </Wrapper>
    );
};

export default Logout;
