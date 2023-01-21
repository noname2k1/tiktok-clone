import PropTypes from 'prop-types';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import styles from './RecommendItem.module.scss';
import classNames from 'classnames/bind';
import Image from '../Image';
import Button from '../Button';
import Video from '~/components/Video';
import { CommentIcon, HeartIcon, MusicNoteIcon, ShareIcon } from '../icons';
import AccountPreview from '../SuggestedAccounts/AccountPreview';
import { descriptionFormater, numberFormater } from '~/helpers';

const cx = classNames.bind(styles);

const RecommendItem = ({ data }) => {
    const [ref, inView] = useInView({
        threshold: 0.5,
    });

    const videoRef = React.useRef();

    React.useEffect(() => {
        if (inView) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    }, [inView]);

    return (
        <div className={cx('wrapper')} ref={ref}>
            <AccountPreview user={data.user} to={`@${data.user.nickname}`} placement='bottom-start'>
                <div className={cx('avatar-wrapper')}>
                    <Image src={data.user.avatar} alt={data.user.nickname} rounded large />
                </div>
            </AccountPreview>

            <div className={cx('post-container')}>
                <header className={cx('header')}>
                    <AccountPreview user={data.user} to={`@${data.user.nickname}`}>
                        <div className={cx('user-info')}>
                            <p className={cx('nickname')}>{data.user.nickname}</p>
                            <p
                                className={cx('name')}
                            >{`${data.user.first_name} ${data.user.last_name}`}</p>
                        </div>
                    </AccountPreview>
                    <p className={cx('caption')}>{descriptionFormater(data.description)}</p>
                    {data.music && (
                        <p className={cx('music')}>
                            <MusicNoteIcon />
                            {data.music}
                        </p>
                    )}
                </header>
                <div className={cx('video-container')}>
                    <Video
                        src={data.file_url}
                        ref={videoRef}
                        poster={data.thumb_url}
                        to={`@${data.user.nickname}/video/${data.uuid}`}
                    />

                    <div className={cx('video-features')}>
                        <ul className={cx('features-list')}>
                            <li className={cx('feature-item')}>
                                <div className={cx('icon')}>
                                    <HeartIcon />
                                </div>
                                <strong className={cx('value')}>
                                    {numberFormater(data.likes_count)}
                                </strong>
                            </li>
                            <li className={cx('feature-item')}>
                                <div className={cx('icon')}>
                                    <CommentIcon />
                                </div>
                                <strong className={cx('value')}>
                                    {numberFormater(data.comments_count)}
                                </strong>
                            </li>
                            <li className={cx('feature-item')}>
                                <div className={cx('icon')}>
                                    <ShareIcon />
                                </div>
                                <strong className={cx('value')}>
                                    {numberFormater(data.shares_count)}
                                </strong>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <Button outline small className={cx('follow-btn')}>
                Follow
            </Button>
        </div>
    );
};

RecommendItem.propTypes = {
    data: PropTypes.object,
};

export default RecommendItem;
