import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './GroupStudy.module.scss';
import { Box, Typography, IconButton, Avatar, TextField } from '@mui/material';
import {
    PeopleOutline,
    SearchOutlined,
    InfoOutlined,
    MoreHoriz,
    Close,
    AttachFile,
    Send,
    ThumbUpOutlined,
    KeyboardArrowDown,
    SentimentSatisfiedAlt,
} from '@mui/icons-material';
import MembersDrawer from '../components/MembersDrawer/MembersDrawer';
import PinIcon from '@/assets/images/icons/pin.red.svg';
import PinIconDefault from '@/assets/images/icons/pin.default.svg';
import EmojiPicker from 'emoji-picker-react';
import { useAppDispatch } from '../../../redux/store';
import { listMembersAction, getGroupDetailsAction } from '../../../redux/GroupStudySlice/GroupStudySlice';
import { useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

// Mock data for the group chat
const groupInfo = {
    name: 'Web Development',
    members: 8,
    pinnedMessages: [
        {
            id: 1,
            author: 'Prof. Williams',
            time: '2 days ago',
            content:
                'Final project submission deadline extended to May 15th. Please make sure to upload both your code and documentation.',
        },
        {
            id: 2,
            author: 'Prof. Williams',
            time: '3 days ago',
            content: 'Quiz on Chapter 5 will be held next Monday. Study materials are in the Resources section.',
        },
    ],
    messages: [
        {
            id: 1,
            author: 'Prof. Williams',
            role: 'Admin',
            time: '10:30 AM',
            content: "I've uploaded the lecture slides for today's session. You can find them in the Resources tab.",
        },
        {
            id: 2,
            author: 'Emma Johnson',
            time: '10:32 AM',
            content: 'Thanks professor! The explanation on recursive functions was really helpful.',
        },
        {
            id: 3,
            author: 'Michael Chen',
            time: '10:35 AM',
            content:
                "I'm still having trouble with the exercise on page 42. Could someone help me understand the approach?",
        },
    ],
};

// Mock data for members
const members = [
    { id: 1, name: 'Prof. Williams', role: 'Administrator', online: true },
    { id: 2, name: 'Alex Turner', role: 'Teaching Assistant', online: true },
    { id: 3, name: 'Emma Johnson', role: 'Student', online: true },
    { id: 4, name: 'Michael Chen', role: 'Student', online: true },
    { id: 5, name: 'Sarah Williams', role: 'Student', online: false },
    { id: 6, name: 'Daniel Lee', role: 'Student', online: true },
    { id: 7, name: 'Jessica Miller', role: 'Student', online: false },
    { id: 8, name: 'Ryan Wilson', role: 'Student', online: false },
];

export default function GroupStudyView() {
    const [isMembersSidebarOpen, setIsMembersSidebarOpen] = useState(false);
    const [isPinnedMessagesOpen, setIsPinnedMessagesOpen] = useState(true);
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const dispatch = useAppDispatch();
    const { groupId } = useParams();    
    const toggleMembersSidebar = () => {
        setIsMembersSidebarOpen(!isMembersSidebarOpen);
    };

    const togglePinnedMessages = () => {
        setIsPinnedMessagesOpen(!isPinnedMessagesOpen);
    };

    const onEmojiClick = (emojiObject: any) => {
        setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    };

    // Get group details
    const fetchGroupDetails = async (groupId: number) => {
        try {
            await dispatch(getGroupDetailsAction(groupId)).unwrap();
        } catch (error) {
            console.error('Failed to fetch group details:', error);
        }
    };

    // Get members list
    const fetchMembers = async (groupId: number, page: number = 1, size: number = 10) => {
        try {
            await dispatch(listMembersAction({ groupId, page, size })).unwrap();
        } catch (error) {
            console.error('Failed to fetch members:', error);
        }
    };

    // Example usage in useEffect or event handler
    // useEffect(() => {
    //     if (groupId) {
    //         fetchGroupDetails(Number(groupId));
    //         fetchMembers(Number(groupId));
    //     }
    // }, [groupId]);

    return (
        <div className={cx('groupStudyView', { 'with-drawer': isMembersSidebarOpen })}>
            {/* Main Chat Area */}
            <Box className={cx('chatContainer')}>
                {/* Header */}
                <Box className={cx('header')}>
                    <Box className={cx('titleArea')}>
                        <Typography variant="h6">{groupInfo.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {groupInfo.members} members
                        </Typography>
                    </Box>
                    <Box className={cx('actions')}>
                        <IconButton>
                            <SearchOutlined />
                        </IconButton>
                        <IconButton onClick={toggleMembersSidebar}>
                            <PeopleOutline />
                        </IconButton>
                        <IconButton>
                            <InfoOutlined />
                        </IconButton>
                        <IconButton>
                            <MoreHoriz />
                        </IconButton>
                    </Box>
                </Box>

                {/* Pinned Messages */}
                <Box className={cx('pinnedMessages')}>
                    <Box className={cx('pinnedHeader')}>
                        <Box className={cx('pinnedHeaderLeft')}>
                            <img src={PinIcon} alt="Pin" />
                            <Typography variant="subtitle1">
                                Pinned Messages {!isPinnedMessagesOpen && `(${groupInfo.pinnedMessages.length})`}
                            </Typography>
                        </Box>
                        <IconButton size="small" onClick={togglePinnedMessages}>
                            {isPinnedMessagesOpen ? (
                                <Close color="error" fontSize="small" />
                            ) : (
                                <KeyboardArrowDown color="error" fontSize="small" />
                            )}
                        </IconButton>
                    </Box>
                    {isPinnedMessagesOpen &&
                        groupInfo.pinnedMessages.map((message) => (
                            <Box key={message.id} className={cx('pinnedMessage')}>
                                <Box className={cx('pinnedMessageHeader')}>
                                    <Typography variant="subtitle2">{message.author}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {message.time}
                                    </Typography>
                                </Box>
                                <Typography variant="body2">{message.content}</Typography>
                            </Box>
                        ))}
                </Box>

                {/* Chat Messages */}
                <Box className={cx('messagesContainer')}>
                    <Typography variant="caption" className={cx('dateMarker')}>
                        Today
                    </Typography>

                    {groupInfo.messages.map((message) => (
                        <Box key={message.id} className={cx('messageItem')}>
                            <Box className={cx('avatarContainer')}>
                                <Avatar className={cx('avatar')}>{message.author.charAt(0)}</Avatar>
                            </Box>
                            <Box className={cx('messageContent')}>
                                <Box className={cx('messageHeader')}>
                                    <Typography variant="subtitle2" className={cx('authorName')}>
                                        {message.author}
                                    </Typography>
                                    {message.role && (
                                        <Typography variant="caption" className={cx('roleTag')}>
                                            {message.role}
                                        </Typography>
                                    )}
                                    <Typography variant="caption" color="text.secondary">
                                        {message.time}
                                    </Typography>
                                </Box>
                                <Typography variant="body2">{message.content}</Typography>
                            </Box>
                            <Box className={cx('messageActions')}>
                                <IconButton size="small">
                                    <ThumbUpOutlined fontSize="small" />
                                </IconButton>
                                <IconButton size="small">
                                    <img src={PinIconDefault} alt="Pin" width={20} height={20} />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* Message Input */}
                <Box className={cx('inputContainer')}>
                    <TextField
                        placeholder="Type a message..."
                        fullWidth
                        variant="standard"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        InputProps={{
                            disableUnderline: true,
                        }}
                    />
                    <Box sx={{ position: 'relative' }}>
                        <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                            <SentimentSatisfiedAlt />
                        </IconButton>
                        {showEmojiPicker && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: '100%',
                                    right: 0,
                                    zIndex: 1,
                                }}
                            >
                                <EmojiPicker onEmojiClick={onEmojiClick} />
                            </Box>
                        )}
                    </Box>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <Send />
                    </IconButton>
                </Box>
            </Box>

            {/* Members Sidebar */}
            <MembersDrawer isOpen={isMembersSidebarOpen} onClose={toggleMembersSidebar} members={members} />
        </div>
    );
}
