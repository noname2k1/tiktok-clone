import React from 'react';
import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import RecommendItem from '~/components/RecommendItem';
import * as videoService from '~/services/videoService';
import { useDispatch, useSelector } from 'react-redux';
import { setVideos, setTotalPages } from '~/store/slices/videoSlice';

const cx = classNames.bind(styles);

const Home = () => {
    const dispatch = useDispatch();
    const videoSlice = useSelector((state) => state.video);
    // const [videos, setVideos] = React.useState([]);
    const [currentVideosPage, setCurrentVideosPage] = React.useState(1);
    const setVideosToVideoStore = (videos, totalPages) => {
        dispatch(setVideos(videos));
        dispatch(setTotalPages(totalPages));
    };

    React.useEffect(() => {
        videoService
            .getVideos(1)
            .then((res) => {
                const initVideos = res.data;
                const totalPages = res.meta.pagination.total_pages;
                setVideosToVideoStore(initVideos, totalPages);
            })
            .catch((error) => {
                console.log(error);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const handleScroll = () => {
            // console.log(window.scrollY, document.body.scrollHeight - 1000);
            if (window.scrollY >= document.body.scrollHeight - 1000) {
                videoService
                    .getVideos(currentVideosPage + 1)
                    .then((res) => {
                        const newVideos = res.data;
                        const totalPages = res.meta.pagination.total_pages;
                        const prevVideos = videoSlice.videos;
                        setVideosToVideoStore([...prevVideos, ...newVideos], totalPages);
                        if (currentVideosPage < videoSlice.totalPages)
                            setCurrentVideosPage(currentVideosPage + 1);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoSlice.videos, currentVideosPage]);

    return (
        <div className={cx('wrapper')}>
            {videoSlice.videos.map((video) => (
                <RecommendItem key={video.id} data={video} />
            ))}
        </div>
    );
};

export default Home;