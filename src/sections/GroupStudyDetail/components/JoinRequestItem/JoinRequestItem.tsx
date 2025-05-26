import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import classNames from 'classnames/bind';
import styles from './JoinRequestItem.module.scss';
import UserAvatar from '../UserAvatar/UserAvatar';

const cx = classNames.bind(styles);

interface JoinRequestItemProps {
    avatar: string | null;
    name: string;
    requestDate: string;
    onAccept: () => void;
    onReject: () => void;
    isOwner: boolean;
}

const JoinRequestItem: React.FC<JoinRequestItemProps> = ({
    avatar,
    name,
    requestDate,
    onAccept,
    onReject,
    isOwner,
}) => {
    return (
        <motion.div
            className={cx('join-request-item')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
        >
            <div className={cx('user-info')}>
                <UserAvatar src={avatar || undefined} name={name} className={cx('avatar')} />
                <div className={cx('details')}>
                    <h4 className={cx('name')}>{name}</h4>
                    <span className={cx('request-type')}>Yêu cầu</span>
                </div>
                <span className={cx('date')}>{requestDate}</span>
            </div>
            {isOwner && (
                <div className={cx('actions')}>
                    <motion.button
                        className={cx('accept-btn')}
                        onClick={onAccept}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <CheckIcon />
                    </motion.button>
                    <motion.button
                        className={cx('reject-btn')}
                        onClick={onReject}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <CloseIcon />
                    </motion.button>
                </div>
            )}
        </motion.div>
    );
};

export default JoinRequestItem;
