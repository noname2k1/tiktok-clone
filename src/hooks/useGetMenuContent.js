import { useSelector } from 'react-redux';
import {
    DarkModeIcon,
    HelpIcon,
    KeyBoardIcon,
    LanguagesIcon,
    LiveSmallIcon,
    LogoutIcon,
    PersonIcon,
    SettingsIcon,
    TiktokCoinIcon,
} from '~/components/icons';

function useGetMenuContent() {
    const { user } = useSelector((state) => state.auth);
    const myNickname = user.nickname;
    const DEFAULT_MENU_ITEMS = [
        {
            title: 'English',
            icon: <LanguagesIcon />,
            children: {
                data: [
                    {
                        type: 'language',
                        title: 'English',
                        code: 'en',
                    },
                    {
                        type: 'language',
                        title: 'Vietnamese',
                        code: 'vi',
                    },
                ],
                title: 'Language',
            },
        },
        {
            title: 'Feedback and help',
            icon: <HelpIcon />,
            to: '/feedback',
        },
        {
            title: 'Keyboard shortcuts',
            icon: <KeyBoardIcon />,
        },
        {
            title: 'Dark mode',
            icon: <DarkModeIcon />,
        },
    ];

    const USER_MENU_ITEMS = [
        {
            title: 'View profile',
            icon: <PersonIcon />,
            to: `/@${myNickname}`,
        },
        {
            title: 'Get Coins',
            icon: <TiktokCoinIcon />,
            to: '/my-profile',
        },
        {
            title: 'Live Studio',
            icon: <LiveSmallIcon />,
            to: '/my-profile',
        },
        {
            title: 'Settings',
            icon: <SettingsIcon />,
            to: '/my-profile',
        },
        ...DEFAULT_MENU_ITEMS,
        {
            title: 'Log out',
            icon: <LogoutIcon />,
            to: '/logout',
            pathName: true,
            separateTop: true,
        },
    ];

    return { DEFAULT_MENU_ITEMS, USER_MENU_ITEMS };
}

export default useGetMenuContent;
