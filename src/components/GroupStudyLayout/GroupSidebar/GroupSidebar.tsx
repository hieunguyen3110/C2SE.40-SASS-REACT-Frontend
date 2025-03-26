import classNames from 'classnames/bind';
import styles from './GroupSidebar.module.scss';
const cx = classNames.bind(styles);

import {
    Box,
    Typography,
    Avatar,
    Badge,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    Help as HelpIcon,
    PeopleOutline as GroupIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../redux/store';
import React from 'react';

const GroupSidebar = () => {
    const location = useLocation();

    const chatGroups = [
        { name: 'Web Development', unread: 3, selected: false },
        { name: 'Data Structures', unread: 0, selected: false },
        { name: 'Machine Learning', unread: 12, selected: true },
    ];

    const navigationItems = [
        { 
            icon: <AddIcon />, 
            label: 'Tạo nhóm học tập',
            path: '/document/group-study/create'
        },
        { 
            icon: <GroupIcon />, 
            label: 'Quản lý nhóm học tập',
            path: '/document/group-study/manage'
        },
        { 
            icon: <SearchIcon />, 
            label: 'Tìm kiếm nhóm học tập',
            path: '/document/group-study/search'
        },
        { 
            icon: <HelpIcon />, 
            label: 'Hỗ trợ',
            path: '/document/group-study/support'
        },
    ];

    const { username, profilePicture, listRoles } = useAppSelector((state) => state.authentication);

    return (
        <Box className={cx('sidebar')}>
            {/* Header */}
            <Box className={cx('header')}>
                <Typography variant="h6" component="div">
                    <span className={cx('groupText')}>GROUP</span>
                    <span className={cx('studyText')}>STUDY</span>
                </Typography>
                <Link to={'/document/group-study/search'}>
                    <IconButton size="small">
                        <SearchIcon fontSize="small" />
                    </IconButton>
                </Link>
            </Box>

            {/* User Profile */}
            <Box className={cx('userProfile')}>
                <Avatar className={cx('avatar')} src={profilePicture || ''}></Avatar>
                <Box>
                    <Typography variant="subtitle2">{username}</Typography>
                    <Typography variant="caption" color="textSecondary">
                        {listRoles.map((role) => role).join(', ')}
                    </Typography>
                </Box>
            </Box>

            <Divider />

            {/* Group Chats */}
            <Box className={cx('section')}>
                <Box className={cx('sectionHeader')}>
                    <Typography variant="subtitle2" color="textSecondary">
                        GROUP CHATS
                    </Typography>
                    <Link to={'/document/group-study/create'}>
                        <IconButton size="small">
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </Link>
                </Box>

                <List dense className={cx('chatList')}>
                    {chatGroups.map((group, index) => (
                        <ListItem key={index} className={cx('chatItem', { selected: group.selected })}>
                            <ListItemIcon className={cx('chatIcon')}>
                                <GroupIcon 
                                    sx={{ 
                                        color: group.selected ? 'red' : 'inherit'
                                    }} 
                                />
                            </ListItemIcon>
                            <ListItemText primary={group.name} className={cx({ selectedText: group.selected })} />
                            {group.unread > 0 && (
                                <Badge badgeContent={group.unread} color="error" className={cx('badge')} />
                            )}
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Divider />

            {/* Navigation */}
            <Box className={cx('section')}>
                <Typography variant="subtitle2" color="textSecondary" className={cx('sectionTitle')}>
                    NAVIGATION
                </Typography>

                <List dense className={cx('chatList')}>
                    {navigationItems.map((item, index) => (
                        <Link to={item.path} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <ListItem className={cx('chatItem', { selected: location.pathname === item.path })}>
                                <ListItemIcon className={cx('chatIcon')}>
                                    {React.cloneElement(item.icon, { 
                                        sx: { color: location.pathname === item.path ? 'red' : 'inherit' }
                                    })}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.label} 
                                    className={cx({ selectedText: location.pathname === item.path })}
                                />
                            </ListItem>
                        </Link>
                    ))}
                </List>
            </Box>
        </Box>
    );
};

export default GroupSidebar;
