import PropTypes from 'prop-types';

import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import React from 'react';
import { MoreIcon, TrashIcon, FlagIcon, EditIcon } from '~/components/icons';
import { Wrapper } from '~/components/Popper';

import styles from './Comments.module.scss';
import useModal from '~/hooks/useModal';

const cx = classNames.bind(styles);

const MoreOptions = ({ commentid, isCreater = false, isMe = false }) => {
    const [visible, setVisible] = React.useState(false);
    const { openEditModal, openReportModal, openDeleteModal } = useModal();
    const EDIT_MODAL_TITLE = 'Edit comment';
    const DELETE_MODAL_TITLE = 'Are you sure you want to delete this comment?';
    const TYPE = 'comment';
    const optionsItem = [
        {
            id: 1,
            icon: <FlagIcon />,
            label: 'Report',
            enabled: !isMe || isCreater,
            onClick: openReportModal,
        },
        {
            id: 3,
            icon: <EditIcon />,
            label: 'Edit',
            enabled: isMe,
            onClick: () => openEditModal(EDIT_MODAL_TITLE, commentid, TYPE),
        },
        {
            id: 2,
            icon: <TrashIcon />,
            label: 'Delete',
            enabled: isMe || isCreater,
            onClick: () => openDeleteModal(DELETE_MODAL_TITLE, commentid, TYPE),
        },
    ];

    const handleVisible = () => {
        setVisible(true);
    };

    const handleInvisible = () => {
        setVisible(false);
    };

    return (
        <div>
            <Tippy
                placement='bottom'
                interactive
                offset={[0, -5]}
                visible={visible}
                render={(attrs) => (
                    <div onMouseLeave={handleInvisible}>
                        <Wrapper className={cx('wrapper')}>
                            <div className={cx('options')}>
                                {optionsItem.map((item) => {
                                    const { id, icon, label, enabled, onClick } = item;
                                    if (!enabled) return null;
                                    return (
                                        <div
                                            key={id}
                                            className={cx('option')}
                                            onClick={() => {
                                                onClick();
                                                handleInvisible();
                                            }}
                                        >
                                            {icon}
                                            <span className={cx('label')}>{label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </Wrapper>
                    </div>
                )}
            >
                <div className={cx('more')} onMouseEnter={handleVisible}>
                    <MoreIcon />
                </div>
            </Tippy>
        </div>
    );
};

MoreOptions.propTypes = {
    isCreater: PropTypes.bool,
    isMe: PropTypes.bool,
    commentid: PropTypes.number,
};

export default MoreOptions;
