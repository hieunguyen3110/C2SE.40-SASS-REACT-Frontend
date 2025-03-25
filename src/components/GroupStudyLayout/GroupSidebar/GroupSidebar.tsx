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
    Home as HomeIcon,
    Book as BookIcon,
    Notifications as NotificationsIcon,
    Description as DescriptionIcon,
    Help as HelpIcon,
    ExitToApp as ExitToAppIcon,
    PeopleOutline as GroupIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../redux/store';

const GroupSidebar = () => {
    const chatGroups = [
        { name: 'Web Development', unread: 3, selected: false },
        { name: 'Data Structures', unread: 0, selected: false },
        { name: 'Machine Learning', unread: 12, selected: true },
    ];

    const navigationItems = [
        { icon: <HomeIcon />, label: 'abc' },
        { icon: <BookIcon />, label: 'dcd' },
        { icon: <NotificationsIcon />, label: 'ede' },
        { icon: <DescriptionIcon />, label: 'fdf' },
        { icon: <HelpIcon />, label: 'gdg' },
        { icon: <ExitToAppIcon />, label: 'cvc' },
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
                <IconButton size="small">
                    <SearchIcon fontSize="small" />
                </IconButton>
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

                <List dense className={cx('navList')}>
                    {navigationItems.map((item, index) => (
                        <ListItem key={index} className={cx('navItem')}>
                            <ListItemIcon className={cx('navIcon')}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
};

export default GroupSidebar;
