import React from 'react';
import { Typography, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import classNames from 'classnames/bind';
import styles from './JoinRequestItem.module.scss';
import UserAvatar from '../UserAvatar/UserAvatar';

const cx = classNames.bind(styles);

interface JoinRequestItemProps {
    avatar?: string;
    name: string;
    requestDate: string;
    onAccept: () => void;
    onReject: () => void;
}

const JoinRequestItem: React.FC<JoinRequestItemProps> = ({ avatar, name, requestDate, onAccept, onReject }) => {
    return (
        <div className={cx('join-request-item')}>
            <div className={cx('user-info')}>
                <UserAvatar src={avatar} name={name} className={cx('avatar')} />
                <div className={cx('details')}>
                    <Typography variant="body1" className={cx('name')}>
                        {name}
                    </Typography>
                    <Typography variant="body2" className={cx('request-type')}>
                        Yêu cầu
                    </Typography>
                </div>
                <Typography variant="body2" className={cx('date')}>
                    {requestDate}
                </Typography>
            </div>
            <div className={cx('actions')}>
                <IconButton className={cx('accept-btn')} onClick={onAccept} size="small">
                    <CheckIcon />
                </IconButton>
                <IconButton className={cx('reject-btn')} onClick={onReject} size="small">
                    <CloseIcon />
                </IconButton>
            </div>
        </div>
    );
};

export default JoinRequestItem;
