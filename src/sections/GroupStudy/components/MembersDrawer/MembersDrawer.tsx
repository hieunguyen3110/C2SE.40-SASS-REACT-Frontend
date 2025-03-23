import classNames from 'classnames/bind';
import styles from './MembersDrawer.module.scss';
import { 
  Box, 
  Typography, 
  IconButton, 
  Badge, 
  Avatar, 
  TextField, 
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  SearchOutlined, 
  Close
} from '@mui/icons-material';

const cx = classNames.bind(styles);

interface Member {
    id: number;
    name: string;
    role: string;
    online: boolean;
}

interface MembersDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    members: Member[];
}

export default function MembersDrawer({ isOpen, onClose, members }: MembersDrawerProps) {
    if (!isOpen) return null;
    
    return (
        <div className={cx('membersDrawer')}>
            <Box className={cx('sidebarHeader')}>
                <Typography variant="h6">Members</Typography>
                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
            </Box>
            
            <Box className={cx('searchMembers')}>
                <TextField
                    placeholder="Search members"
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputProps={{
                        startAdornment: <SearchOutlined color="action" />
                    }}
                />
            </Box>

            <Box className={cx('membersCategories')}>
                <Typography variant="subtitle2" className={cx('categoryTitle')}>
                    ADMINISTRATORS
                </Typography>
                <List>
                    {members
                        .filter(member => member.role === "Administrator" || member.role === "Teaching Assistant")
                        .map(member => (
                            <ListItem key={member.id} className={cx('memberItem')}>
                                <ListItemAvatar>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                        color={member.online ? "success" : "default"}
                                    >
                                        <Avatar>{member.name.charAt(0)}</Avatar>
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={member.name}
                                    secondary={member.role}
                                />
                            </ListItem>
                        ))
                    }
                </List>
                
                <Divider />
                
                <Typography variant="subtitle2" className={cx('categoryTitle')}>
                    STUDENTS
                </Typography>
                <List>
                    {members
                        .filter(member => member.role === "Student")
                        .map(member => (
                            <ListItem key={member.id} className={cx('memberItem')}>
                                <ListItemAvatar>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                        color={member.online ? "success" : "default"}
                                    >
                                        <Avatar>{member.name.charAt(0)}</Avatar>
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={member.name}
                                    secondary={member.role}
                                />
                            </ListItem>
                        ))
                    }
                </List>
            </Box>
        </div>
    );
}
