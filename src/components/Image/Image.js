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
            rounded = false,
            fallback: customFallback = images.noImage,
            ...props
        },
        ref
    ) => {
        const [fallback, setFallback] = React.useState('');
        const handleError = () => {
            setFallback(customFallback);
        };
        // console.log('fallback', images.noImage);
        return (
            <img
                src={fallback || src}
                alt={alt}
                ref={ref}
                className={classNames(styles.wrapper, className, {
                    [styles.small]: small,
                    [styles.medium]: medium,
                    [styles.large]: large,
                    [styles.rounded]: rounded,
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
    rounded: PropTypes.bool,
};

export default Image;
