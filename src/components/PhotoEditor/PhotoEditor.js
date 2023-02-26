import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useDispatch } from 'react-redux';
import { setTermAvatarEnabled, setTermAvatarURL } from '~/store/slices/termSlice';

import Button from '../Button';
import styles from './PhotoEditor.module.scss';
import Range from './Range';

const cx = classNames.bind(styles);

const PhotoEditor = ({ img, cancel }) => {
    const dispatch = useDispatch();
    const [editor, setEditor] = useState(null);
    const [scale, setScale] = useState(1);

    const handleScale = (e) => {
        let scale = parseFloat(e.target.value);
        if (scale < 1) scale = 1;
        setScale(scale);
    };

    const handleZoom = (e) => {
        // tính toán giá trị delta tương ứng với việc lăn chuột lên hoặc xuống
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        // giới hạn tỷ lệ zoom trong khoảng từ 0.2 đến 5
        let newScale = Math.max(1, Math.min(10, scale + delta));
        if (newScale < 1) newScale = 1;
        setScale(newScale);
    };

    // React.useEffect(() => {
    //     console.log(scale);
    // }, [scale]);
    function handleSave() {
        const canvas = editor.getImageScaledToCanvas().toDataURL();
        dispatch(setTermAvatarURL(canvas));
        setTimeout(() => {
            dispatch(setTermAvatarEnabled(false));
        }, 500);
        // canvas.toBlob((blob) => {
        //     const avatarURL = URL.createObjectURL(blob);
        // dispatch(setTermAvatarURL(avatarURL));
        //     // download canvas image as a png file
        //     // const url = URL.createObjectURL(blob);
        //     // const link = document.createElement('a');
        //     // link.download = 'edited-image.png';
        //     // link.href = url;
        //     // link.click();
        //     // URL.revokeObjectURL(url);
        // }, type);
    }

    const handleCancel = () => {
        cancel();
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('body')}>
                <AvatarEditor
                    ref={(ref) => setEditor(ref)}
                    image={img}
                    width={400}
                    height={400}
                    border={50}
                    borderRadius={200} // half of the width
                    color={[0, 0, 0, 0.8]} // RGBA
                    scale={scale}
                    rotate={0}
                    onWheel={handleZoom}
                    className={cx('editor')}
                />
                <div className={cx('slider')}>
                    <span>Zoom</span>
                    <Range
                        type='range'
                        min={1}
                        max={10}
                        step={0.1}
                        onInput={handleScale}
                        value={scale}
                        className={cx('slider-range')}
                    />
                </div>
            </div>
            <footer className={cx('footer')}>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSave} primary>
                    Save
                </Button>
            </footer>
        </div>
    );
};

PhotoEditor.propTypes = {
    img: PropTypes.string,
    cancel: PropTypes.func,
};

export default PhotoEditor;
