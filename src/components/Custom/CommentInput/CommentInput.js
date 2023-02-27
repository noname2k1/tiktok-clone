import PropTypes from 'prop-types';

import React, { forwardRef } from 'react';
import styles from './CommentInput.module.scss';
import classNames from 'classnames/bind';
import { AtIcon, EmojiIcon } from '~/components/icons';
import Tooltip from '~/components/Tooltip';

const cx = classNames.bind(styles);

const CommentInput = forwardRef(
    (
        {
            placeHolder = 'Add comment...',
            btnLabel = 'Post',
            value,
            maxLength = 150,
            onChange,
            onClick,
            at = false,
            emoji = false,
        },
        ref
    ) => {
        const TAG_OTHERS = '"@" user to tag them in your comment';
        const ADD_EMOJIS = 'click to add emojis';

        const handleFocusInput = () => {
            ref.current.focus();
        };
        const handleChange = (e) => {
            onChange(e);
            if (
                value.length > maxLength &&
                e.key !== 'Backspace' &&
                e.key !== 'Delete' &&
                e.key !== 'Enter' &&
                e.key !== 'ArrowLeft' &&
                e.key !== 'ArrowRight' &&
                e.key !== 'ArrowUp' &&
                e.key !== 'ArrowDown' &&
                e.key !== ''
            ) {
                e.preventDefault();
            }
        };

        return (
            <div className={cx('comment-box')}>
                <div className={cx('comment-input')}>
                    {!value && (
                        <div className={cx('comment-placeholder')} onClick={handleFocusInput}>
                            {placeHolder}
                        </div>
                    )}
                    {/* input area */}
                    <div
                        className={cx('comment-input-area')}
                        contentEditable
                        onInput={handleChange}
                        onChange={handleChange}
                        onKeyDown={handleChange}
                        ref={ref}
                        spellCheck='false'
                    />
                    <div className={cx('comment-tools')}>
                        {at && (
                            <Tooltip content={TAG_OTHERS}>
                                <div className={cx('comment-tools-item')}>
                                    <AtIcon />
                                </div>
                            </Tooltip>
                        )}
                        {emoji && (
                            <Tooltip content={ADD_EMOJIS}>
                                <div className={cx('comment-tools-item')}>
                                    <EmojiIcon />
                                </div>
                            </Tooltip>
                        )}
                    </div>
                    {value.length > 44 && (
                        <div
                            className={cx('text-count', {
                                max: value.length >= maxLength,
                            })}
                        >
                            {value.length > maxLength ? maxLength : value.length}/{maxLength}
                        </div>
                    )}
                </div>
                <div className={cx('comment-btn', { active: value })} onClick={onClick}>
                    {btnLabel}
                </div>
            </div>
        );
    }
);

CommentInput.propTypes = {
    placeHolder: PropTypes.string,
    btnLabel: PropTypes.node,
    value: PropTypes.string,
    maxLength: PropTypes.number,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
};

export default CommentInput;
