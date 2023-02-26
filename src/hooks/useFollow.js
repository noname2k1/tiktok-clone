import { useDispatch, useSelector } from 'react-redux';
import * as followService from '~/services/followService';
import { follow, unfollow } from '~/store/slices/followSlice';
import useModal from './useModal';

const useFollow = () => {
    const { token, user } = useSelector((state) => state.auth);
    const { openAuthModal } = useModal();
    const dispatch = useDispatch();
    const followUser = (userID) => {
        // follow
        if (!token && !Object.keys(user).length > 0) {
            openAuthModal();
        } else {
            followService.follow(userID).then((thisUser) => {
                dispatch(follow(thisUser));
            });
        }
    };

    const unfollowUser = (userID) => {
        // unfollow
        if (!token && !Object.keys(user).length > 0) {
            openAuthModal();
        } else {
            followService.unfollow(userID).then((thisUser) => {
                dispatch(unfollow(thisUser));
            });
        }
    };

    return { followUser, unfollowUser };
};

export default useFollow;
