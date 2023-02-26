import React from 'react';
import PropTypes from 'prop-types';
import images from '~/assets/images';
import classNames from 'classnames';
import styles from './Image.module.scss';
const Image = React.forwardRef(
    (
        {
            src,
            alt,
            className,
            small = false,
            medium = false,
            large = false,
            extraLarge = false,
            rounded = false,
            fallback: customFallback = images.noImage,
            ...props
        },
        ref
    ) => {
        const [srcImage, setSrcImage] = React.useState(src);
        // console.log('srcImage', srcImage);
        const handleError = () => {
            setSrcImage(customFallback);
        };

        React.useEffect(() => {
            setSrcImage(src);
        }, [src]);

        return (
            <img
                src={srcImage}
                alt={alt}
                ref={ref}
                className={classNames(styles.wrapper, {
                    [styles.small]: small,
                    [styles.medium]: medium,
                    [styles.large]: large,
                    [styles['extra-large']]: extraLarge,
                    [styles.rounded]: rounded,
                    [className]: className,
                })}
                {...props}
                onError={handleError}
            />
        );
    }
);

Image.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    className: PropTypes.string,
    fallback: PropTypes.string,
    small: PropTypes.bool,
    medium: PropTypes.bool,
    large: PropTypes.bool,
    extraLarge: PropTypes.bool,
    rounded: PropTypes.bool,
};

export default Image;
