import React from 'react';
import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import RecommendItem from '~/components/RecommendItem';
import * as videoService from '~/services/videoService';
import { useDispatch, useSelector } from 'react-redux';
import { setVideos, setTotalPages } from '~/store/slices/videoSlice';
import { LoadingEffect } from '~/components/effects';

const cx = classNames.bind(styles);

const Home = () => {
    const dispatch = useDispatch();
    const videoSlice = useSelector((state) => state.video);
    // const [videos, setVideos] = React.useState([]);
    const [currentVideosPage, setCurrentVideosPage] = React.useState(1);
    const [loading, setLoading] = React.useState(true);
    const setVideosToVideoStore = (videos, totalPages) => {
        dispatch(setVideos(videos));
        dispatch(setTotalPages(totalPages));
    };

    React.useEffect(() => {
        window.scrollTo(0, 0);
        videoService
            .getVideos(1)
            .then((res) => {
                setLoading(false);
                const initVideos = res.data;
                const totalPages = res.meta?.pagination.total_pages;
                setVideosToVideoStore(initVideos, totalPages);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
        document.title = 'Tiktok - Make Your Day';
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // console.log('videoSlice', videoSlice);
    React.useEffect(() => {
        const handleScroll = () => {
            // console.log(window.scrollY, document.body.scrollHeight - 1000);
            if (window.scrollY >= document.body.scrollHeight - 1000) {
                // console.log('videoSlice', videoSlice);
                setLoading(true);
                videoService
                    .getVideos(currentVideosPage + 1)
                    .then((res) => {
                        setLoading(false);
                        const newVideos = res.data;
                        const totalPages = res.meta.pagination.total_pages;
                        const prevVideos = videoSlice.videos;
                        setVideosToVideoStore([...prevVideos, ...newVideos], totalPages);
                        if (currentVideosPage < videoSlice.totalPages)
                            setCurrentVideosPage(currentVideosPage + 1);
                    })
                    .catch((error) => {
                        console.log(error);
                        setLoading(false);
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
            {!loading &&
                videoSlice.videos.map((video) => <RecommendItem key={video.id} data={video} />)}
            {loading && <LoadingEffect />}
        </div>
    );
};

export default Home;
