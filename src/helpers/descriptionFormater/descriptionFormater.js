import classNames from 'classnames/bind';
import styles from './descriptionFormater.module.scss';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

const descriptionFormater = (description) => {
    const regex = /([@#][a-zA-Z0-9_]+)/g;
    const result = description.split(regex);
    // console.log(result);
    return result.map((item, index) => {
        if (item.match(regex)) {
            return (
                <Link
                    to={`/tag/${item.slice(1)}`}
                    key={index}
                    className={cx('mention')}
                >
                    {item}
                </Link>
            );
        }
        return item;
    });
};

export default descriptionFormater;
