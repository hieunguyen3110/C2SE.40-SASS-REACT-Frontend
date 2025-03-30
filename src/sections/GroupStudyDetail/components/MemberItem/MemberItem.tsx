import React from 'react';
import { Typography, IconButton, Box } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import classNames from 'classnames/bind';
import styles from './MemberItem.module.scss';
import UserAvatar from '../UserAvatar/UserAvatar';

const cx = classNames.bind(styles);

interface MemberItemProps {
    avatar?: string;
    name: string;
    joinDate: string;
    role?: 'Admin' | 'Creator' | 'Member';
    showActions?: boolean;
}

const MemberItem: React.FC<MemberItemProps> = ({ avatar, name, joinDate, role = 'Member', showActions = true }) => {
    return (
        <div className={cx('member-item')}>
            <div className={cx('member-info')}>
                <UserAvatar src={avatar} name={name} className={cx('avatar')} />
                <div className={cx('details')}>
                    <Typography variant="body1" className={cx('name')}>
                        {name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className={cx('date')}>
                        {joinDate}
                    </Typography>
                </div>
            </div>
            <div className={cx('role-actions')}>
                <Box className={cx('role-badge', role.toLowerCase())}>
                    {role === 'Admin' && (
                        <Box className={cx('role-icon-wrapper')}>
                            <Typography variant="body2">{role}</Typography>
                        </Box>
                    )}
                    {role === 'Creator' && (
                        <Box className={cx('role-icon-wrapper')}>
                            <Typography variant="body2">{role}</Typography>
                        </Box>
                    )}
                    {role === 'Member' && (
                        <Box className={cx('role-icon-wrapper')}>
                            <Typography variant="body2">{role}</Typography>
                        </Box>
                    )}
                </Box>
                {showActions && (
                    <IconButton size="small" className={cx('more-actions')}>
                        <MoreHorizIcon />
                    </IconButton>
                )}
            </div>
        </div>
    );
};

export default MemberItem;
