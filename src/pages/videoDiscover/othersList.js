import { v4 as uuidv4 } from 'uuid';
import {
    EmbedIcon,
    FacebookIcon,
    PlaneIcon,
    ShareIcon,
    TwitterIcon,
    WhatsAppIcon,
} from '~/components/icons';
const othersList = [
    {
        id: uuidv4(),
        tooltip: 'Embed',
        icon: <EmbedIcon />,
    },
    {
        id: uuidv4(),
        tooltip: 'Send To Friends',
        icon: <PlaneIcon />,
    },
    {
        id: uuidv4(),
        tooltip: 'Share to Facebook',
        icon: <FacebookIcon />,
        link: '',
    },
    {
        id: uuidv4(),
        tooltip: 'Share to WhatsApp',
        icon: <WhatsAppIcon />,
        link: '',
    },
    {
        id: uuidv4(),
        tooltip: 'Share to Twitter',
        icon: <TwitterIcon />,
        link: '',
    },
    {
        id: uuidv4(),
        icon: <ShareIcon width={16} height={16} />,
    },
];

export default othersList;
