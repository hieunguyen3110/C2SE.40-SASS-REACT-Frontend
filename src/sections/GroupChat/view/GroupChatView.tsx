import { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from './GroupChatView.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton } from '@mui/material';
import {
    PeopleOutline,
    SearchOutlined,
    InfoOutlined,
    MoreHoriz,
    Close,
    AttachFile,
    KeyboardArrowDown,
    SentimentSatisfiedAlt,
} from '@mui/icons-material';
import MembersDrawer from '../components/MembersDrawer/MembersDrawer';
import PinIcon from '@/assets/images/icons/pin.red.svg';
import PinIconDefault from '@/assets/images/icons/pin.default.svg';
import EmojiPicker from 'emoji-picker-react';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import {
    listMembersAction,
    getGroupDetailsAction,
    getGroupMessagesAction,
    getPinnedMessagesAction,
    pinMessageAction,
    unpinMessageAction,
    clearUnreadMessages,
} from '../../../redux/GroupStudySlice/GroupStudySlice';
import { useLocation } from 'react-router-dom';
import { Message } from '../../../types/groupStudy.types';
import { sendGroupChatMessage } from '../../../utils/Websocket';
import SendIcon from '../../../assets/images/icons/send-alt-1-svgrepo-com.svg';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

export default function GroupChatView() {
    const [isMembersSidebarOpen, setIsMembersSidebarOpen] = useState(false);
    const [isPinnedMessagesOpen, setIsPinnedMessagesOpen] = useState(true);
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [pinnedMessageIds, setPinnedMessageIds] = useState<number[]>([]);
    const [pinningMessage, setPinningMessage] = useState<number | null>(null);
    const [showLoadMoreButton, setShowLoadMoreButton] = useState(false);
    const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const MAX_CHAR_LIMIT = 300;
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();

    // Extract groupId from URL path /document/group-study/:groupId/chat
    const location = useLocation();
    const getGroupIdFromPath = () => {
        const pathSegments = location.pathname.split('/');
        const groupStudyIndex = pathSegments.findIndex((segment) => segment === 'group-study');
        if (groupStudyIndex !== -1 && pathSegments.length > groupStudyIndex + 1) {
            return pathSegments[groupStudyIndex + 1];
        }
        return null;
    };

    const groupId = getGroupIdFromPath();

    // Get group details and messages from Redux store
    const { currentGroup, memberList, messages, pinnedMessages } = useAppSelector((state) => state.groupStudy);
    const { accountId } = useAppSelector((state) => state.authentication);

    // Create a ref for the latest message to add animation
    const latestMessageRef = useRef<HTMLDivElement>(null);

    // Add a state to track the most recent message ID for animation
    const [mostRecentMessageId, setMostRecentMessageId] = useState<number | null>(null);

    // Add a ref to track if we're loading older messages
    const isLoadingOlderMessages = useRef(false);

    const [unpinningMessage, setUnpinningMessage] = useState<number | null>(null);

    const toggleMembersSidebar = () => {
        setIsMembersSidebarOpen(!isMembersSidebarOpen);
    };

    const togglePinnedMessages = () => {
        setIsPinnedMessagesOpen(!isPinnedMessagesOpen);
    };

    const onEmojiClick = (emojiObject: any) => {
        if (message.length + emojiObject.emoji.length <= MAX_CHAR_LIMIT) {
            setMessage((prevMessage) => prevMessage + emojiObject.emoji);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    useEffect(() => {
        // Only scroll to bottom if we're not loading older messages
        if (!isLoadingOlderMessages.current) {
            scrollToBottom();
        }
    }, [messages]);

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

    // Get messages
    const fetchMessages = async (groupId: number, page: number = 0, size: number = 10, isLoadMore: boolean = false) => {
        try {
            const response = await dispatch(getGroupMessagesAction({ groupId, page, size, isLoadMore })).unwrap();
            // Check if there are more messages available
            if (response && response.messages) {
                // If we received fewer messages than requested or empty array, there are no more messages
                setHasMoreMessages(response.messages.length === size && response.messages.length > 0);
            } else {
                setHasMoreMessages(false);
            }
            return response;
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            setHasMoreMessages(false);
            return null;
        }
    };

    // Get pinned messages
    const fetchPinnedMessages = async (groupId: number, page: number = 0, size: number = 10) => {
        try {
            await dispatch(getPinnedMessagesAction({ groupId, page, size })).unwrap();
        } catch (error) {
            console.error('Failed to fetch pinned messages:', error);
        }
    };

    // Handle sending a message
    const handleSendMessage = async () => {
        if (!message.trim() || !groupId || !accountId || message.length > MAX_CHAR_LIMIT) return;

        try {
            // Thêm tin nhắn tạm thời vào state local
            setMessage('');
            // Gửi tin nhắn qua WebSocket
            sendGroupChatMessage(Number(groupId), message);
        } catch (error) {
            console.error('Failed to send message:', error);

            // Khôi phục tin nhắn trong input field nếu gửi thất bại
            setMessage(message);
        }
    };

    // Fetch group details, members, messages, and pinned messages when component mounts
    useEffect(() => {
        if (groupId) {
            fetchGroupDetails(Number(groupId));
            fetchMembers(Number(groupId));
            fetchMessages(Number(groupId), 0, 10); // Initial load with page 0
            fetchPinnedMessages(Number(groupId));
        }
    }, [groupId]);

    // Format time for display from timestamp
    const formatTime = (timestamp: string | undefined) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Get messages array safely from the API response
    const getMessagesArray = useCallback(() => {
        if (!messages) return [];

        // Convert messages to a consistent format
        let messageArray = [];

        // Check if messages is a paginated response with content property
        if ('content' in messages && Array.isArray(messages.content)) {
            messageArray = messages.content;
        }
        // If it's already an array, use it directly
        else if (Array.isArray(messages)) {
            messageArray = messages;
        }

        // Không sắp xếp lại vì đã được sắp xếp trong Redux
        return messageArray;
    }, [messages]);

    // Get pinned messages array safely
    const getPinnedMessagesArray = useCallback(() => {
        if (!pinnedMessages) return [];
        // Check if pinnedMessages is a paginated response with content property
        if ('content' in pinnedMessages && Array.isArray(pinnedMessages.content)) {
            return pinnedMessages.content;
        }
        // If it's already an array, use it directly
        if (Array.isArray(pinnedMessages)) {
            return pinnedMessages;
        }
        return [];
    }, [pinnedMessages]);

    // Get the messages array
    const messagesArray = getMessagesArray();
    const pinnedMessagesArray = getPinnedMessagesArray();

    // Effect to update the latest message ID when new messages arrive
    useEffect(() => {
        const currentMessages = getMessagesArray();
        if (currentMessages.length > 0) {
            // Lấy tin nhắn mới nhất (ở cuối mảng)
            const latestMessage = currentMessages[currentMessages.length - 1];
            setMostRecentMessageId(latestMessage.messageId);
            scrollToBottom();
        }
    }, [getMessagesArray, messages]); // Track changes to the messages array

    // Extract pinned message IDs from pinnedMessages when it changes
    useEffect(() => {
        const pinnedMsgs = getPinnedMessagesArray();
        if (pinnedMsgs.length > 0) {
            const ids = pinnedMsgs.map((msg: Message) => msg.messageId);
            setPinnedMessageIds(ids);
        }
    }, [getPinnedMessagesArray, pinnedMessages]);

    // Handler for pinning a message
    const handlePinMessage = async (messageId: number) => {
        try {
            if (accountId === currentGroup?.userId) {
                setPinningMessage(messageId);
                await dispatch(pinMessageAction({ messageId })).unwrap();
                // After successful pin, update local state
                setPinnedMessageIds((prev) => [...prev, messageId]);
                // Refresh pinned messages list
                if (groupId) {
                    fetchPinnedMessages(Number(groupId));
                }
            } else {
                toast.error('Bạn không có quyền ghim tin nhắn');
            }
        } catch (error) {
            console.error('Failed to pin message:', error);
        } finally {
            setPinningMessage(null);
        }
    };

    // Handler for unpinning a message
    const handleUnpinMessage = async (messageId: number) => {
        try {
            if (accountId === currentGroup?.userId) {
                setUnpinningMessage(messageId);
                await dispatch(unpinMessageAction({ messageId })).unwrap();
                // After successful unpin, update local state
                setPinnedMessageIds((prev) => prev.filter((id) => id !== messageId));
                // Refresh pinned messages list
                if (groupId) {
                    fetchPinnedMessages(Number(groupId));
                }
            } else {
                toast.error('Bạn không có quyền bỏ ghim tin nhắn');
            }
        } catch (error) {
            console.error('Failed to unpin message:', error);
        } finally {
            setUnpinningMessage(null);
        }
    };

    // Xử lý sự kiện scroll để hiển thị nút "Load more" khi người dùng cuộn đến đầu
    const handleScroll = useCallback(() => {
        const container = messagesContainerRef.current;
        if (container) {
            // Hiển thị nút "Load more" khi cuộn gần đến đầu container (30px)
            if (container.scrollTop <= 30 && hasMoreMessages) {
                setShowLoadMoreButton(true);
            } else {
                setShowLoadMoreButton(false);
            }

            // Kiểm tra nếu người dùng đã cuộn đến cuối container
            const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 20;

            // Nếu đã cuộn đến cuối, đánh dấu đã đọc tất cả tin nhắn
            if (isAtBottom) {
                setUnreadMessagesCount(0);
            }
        }
    }, [hasMoreMessages]);

    // Thêm sự kiện lắng nghe scroll trên container tin nhắn
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => {
                container.removeEventListener('scroll', handleScroll);
            };
        }
    }, [handleScroll]);

    // Thêm hiệu ứng cho nội dung tin nhắn mới
    useEffect(() => {
        // Khi có tin nhắn mới, kiểm tra xem người dùng có đang cuộn ở cuối không
        const container = messagesContainerRef.current;
        if (container) {
            const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 20;

            // Nếu không ở cuối, tăng số lượng tin nhắn chưa đọc
            if (!isAtBottom && messagesArray.length > 0) {
                setUnreadMessagesCount((prev) => prev + 1);
            }
        }
    }, [messagesArray.length]);

    // Xử lý khi click nút "Load more"
    const handleLoadMoreMessages = async () => {
        if (isLoadingMoreMessages || !hasMoreMessages || !groupId) return;

        setIsLoadingMoreMessages(true);
        // Set flag to prevent auto-scrolling
        isLoadingOlderMessages.current = true;

        // Save current scroll height and position before loading
        const container = messagesContainerRef.current;
        if (!container) {
            setIsLoadingMoreMessages(false);
            isLoadingOlderMessages.current = false;
            return;
        }

        const previousScrollHeight = container.scrollHeight;
        const previousScrollTop = container.scrollTop;

        // Increment page number and fetch older messages
        const nextPage = currentPage + 1;
        await fetchMessages(Number(groupId), nextPage, 10, true);

        // Update current page after successful fetch
        setCurrentPage(nextPage);
        setIsLoadingMoreMessages(false);

        // Maintain exact scroll position
        setTimeout(() => {
            if (container) {
                // Calculate new scroll position that keeps the same content visible
                const newScrollTop = previousScrollTop + (container.scrollHeight - previousScrollHeight);
                container.scrollTop = newScrollTop;
            }
            // Reset the flag after adjusting scroll position
            isLoadingOlderMessages.current = false;
        }, 100); // Ensure DOM has updated
    };

    // Xử lý khi click nút cuộn xuống cuối
    const scrollToNewestMessages = () => {
        scrollToBottom();
        setUnreadMessagesCount(0);
    };

    // Clear unread messages for this group when entering the chat view
    useEffect(() => {
        if (groupId) {
            dispatch(clearUnreadMessages(Number(groupId)));
        }
    }, [groupId, dispatch]);

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMessage = e.target.value;
        if (newMessage.length <= MAX_CHAR_LIMIT) {
            setMessage(newMessage);
        }
    };

    // Close emoji picker when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        }

        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker]);

    return (
        <div className={cx('groupStudyView', { 'with-drawer': isMembersSidebarOpen })}>
            {/* Main Chat Area */}
            <div className={cx('chatContainer')}>
                {/* Header */}
                <header className={cx('header')}>
                    <div className={cx('titleArea')}>
                        <h2 className={cx('title')}>{currentGroup?.groupName || 'Loading...'}</h2>
                        <span className={cx('subtitle')}>{currentGroup?.memberCount} members</span>
                    </div>
                    <div className={cx('actions')}>
                        <IconButton className={cx('iconButton')}>
                            <SearchOutlined />
                        </IconButton>
                        <IconButton className={cx('iconButton')} onClick={toggleMembersSidebar}>
                            <PeopleOutline />
                        </IconButton>
                        <IconButton className={cx('iconButton')}>
                            <InfoOutlined />
                        </IconButton>
                        <IconButton className={cx('iconButton')}>
                            <MoreHoriz />
                        </IconButton>
                    </div>
                </header>

                {/* Pinned Messages */}
                <div className={cx('pinnedMessages')}>
                    <div className={cx('pinnedHeader')}>
                        <div className={cx('pinnedHeaderLeft')}>
                            <img src={PinIcon} alt="Pin" className={cx('pinIcon')} />
                            <h3 className={cx('pinnedTitle')}>
                                Pinned Messages {!isPinnedMessagesOpen && `(${pinnedMessagesArray.length})`}
                            </h3>
                        </div>
                        <IconButton className={cx('toggleButton')} size="small" onClick={togglePinnedMessages}>
                            {isPinnedMessagesOpen ? <Close fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                        </IconButton>
                    </div>

                    <AnimatePresence>
                        {isPinnedMessagesOpen && (
                            <motion.div
                                className={cx('pinnedMessagesContent')}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {pinnedMessagesArray.map((message: Message, index: number) => (
                                    <motion.div
                                        key={message.messageId || `temp-${index}`}
                                        className={cx('pinnedMessage')}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className={cx('pinnedMessageHeader')}>
                                            <span className={cx('authorName')}>{message.username}</span>
                                            <span className={cx('messageTime')}>
                                                {formatTime(message.timestamp || message.createdAt)}
                                            </span>
                                            <IconButton
                                                className={cx('unpinButton')}
                                                size="small"
                                                onClick={() => handleUnpinMessage(message.messageId)}
                                                disabled={unpinningMessage === message.messageId}
                                                sx={{
                                                    padding: '2px',
                                                    marginLeft: '4px',
                                                    animation:
                                                        unpinningMessage === message.messageId
                                                            ? 'spin 1s linear infinite'
                                                            : 'none',
                                                    '@keyframes spin': {
                                                        '0%': { transform: 'rotate(0deg)' },
                                                        '100%': { transform: 'rotate(360deg)' },
                                                    },
                                                }}
                                            >
                                                <img
                                                    src={PinIcon}
                                                    alt="Unpin"
                                                    width={14}
                                                    height={14}
                                                    className={cx({
                                                        'unpinning-icon': unpinningMessage === message.messageId,
                                                    })}
                                                />
                                            </IconButton>
                                        </div>
                                        <p
                                            className={cx('messageText')}
                                            style={{
                                                wordBreak: 'break-word',
                                                overflowWrap: 'break-word',
                                                maxWidth: '100%',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {message.content}
                                        </p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Chat Messages */}
                <div className={cx('messagesContainer')} ref={messagesContainerRef} onScroll={handleScroll}>
                    {/* Load More Button */}
                    <AnimatePresence>
                        {showLoadMoreButton && (
                            <motion.div
                                className={cx('loadMoreContainer')}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <motion.button
                                    className={cx('loadMoreButton')}
                                    onClick={handleLoadMoreMessages}
                                    disabled={isLoadingMoreMessages || !hasMoreMessages}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isLoadingMoreMessages ? (
                                        <>
                                            <div className={cx('loadingSpinner')}>
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                            </div>
                                            <span className={cx('loadingText')}>Đang tải tin nhắn...</span>
                                        </>
                                    ) : !hasMoreMessages ? (
                                        'Không còn tin nhắn cũ hơn'
                                    ) : (
                                        'Tải thêm tin nhắn cũ hơn'
                                    )}
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className={cx('dateMarker')}>
                        <span>Today</span>
                    </div>

                    {messagesArray.map((message: Message, index) =>
                        message.senderId === 0 ? (
                            // Notification message (system message)
                            <motion.div
                                key={`notification-${index}`}
                                className={cx('notificationMessage')}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className={cx('notificationContent')}>
                                    <p>{message.content}</p>
                                </div>
                            </motion.div>
                        ) : (
                            // Regular message
                            <motion.div
                                key={message.messageId || `temp-${index}`}
                                className={cx('messageItem', {
                                    'self-message': message.senderId === accountId,
                                    'new-message': message.messageId === mostRecentMessageId,
                                })}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                ref={message.messageId === mostRecentMessageId ? latestMessageRef : null}
                            >
                                <div className={cx('avatarContainer')}>
                                    {message.profilePicture ? (
                                        <div className={cx('avatar')}>
                                            <img src={message.profilePicture} alt={message.username} />
                                        </div>
                                    ) : (
                                        <div className={cx('avatar')}>
                                            {message.username === 'Unknown'
                                                ? message.username.charAt(0)
                                                : message.username.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className={cx('messageContent')}>
                                    <div className={cx('messageHeader')}>
                                        <span className={cx('authorName')}>
                                            {message.username === 'Unknown' ? message.username : message.username}
                                        </span>
                                        {message.senderId === currentGroup?.ownerId && (
                                            <span className={cx('roleTag')}>Admin</span>
                                        )}
                                        <span className={cx('messageTime')}>
                                            {formatTime(message.timestamp || message.createdAt)}
                                        </span>
                                    </div>
                                    <p className={cx('messageText')}>{message.content}</p>
                                </div>
                                <div className={cx('messageActions')}>
                                    <IconButton
                                        className={cx('actionButton')}
                                        size="small"
                                        onClick={() => handlePinMessage(message.messageId)}
                                        disabled={
                                            pinningMessage === message.messageId ||
                                            pinnedMessageIds.includes(message.messageId)
                                        }
                                        sx={{
                                            color: pinnedMessageIds.includes(message.messageId) ? '#ff3c3c' : 'inherit',
                                            animation:
                                                pinningMessage === message.messageId
                                                    ? 'spin 1s linear infinite'
                                                    : 'none',
                                            '@keyframes spin': {
                                                '0%': { transform: 'rotate(0deg)' },
                                                '100%': { transform: 'rotate(360deg)' },
                                            },
                                        }}
                                    >
                                        <img
                                            src={
                                                pinnedMessageIds.includes(message.messageId) ? PinIcon : PinIconDefault
                                            }
                                            alt="Pin"
                                            width={20}
                                            height={20}
                                            className={cx({
                                                'pinned-icon': pinnedMessageIds.includes(message.messageId),
                                                'pinning-icon': pinningMessage === message.messageId,
                                            })}
                                        />
                                    </IconButton>
                                </div>
                            </motion.div>
                        ),
                    )}
                    <div ref={messagesEndRef} />

                    {/* Unread Messages Indicator */}
                    <AnimatePresence>
                        {unreadMessagesCount > 0 && (
                            <motion.div
                                className={cx('newMessagesIndicator')}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                onClick={scrollToNewestMessages}
                            >
                                <div className={cx('newMessagesCount')}>{unreadMessagesCount}</div>
                                <span>Tin nhắn mới</span>
                                <KeyboardArrowDown />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Message Input */}
                <div className={cx('inputContainer')}>
                    <input
                        type="text"
                        className={cx('messageInput')}
                        placeholder="Type a message..."
                        value={message}
                        onChange={handleMessageChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <div className={cx('inputActions')}>
                        <div className={cx('emojiPickerContainer')} ref={emojiPickerRef}>
                            <IconButton
                                className={cx('actionButton')}
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                <SentimentSatisfiedAlt />
                            </IconButton>
                            {showEmojiPicker && (
                                <div className={cx('emojiPicker')}>
                                    <EmojiPicker onEmojiClick={onEmojiClick} />
                                </div>
                            )}
                        </div>
                        <IconButton className={cx('actionButton')}>
                            <AttachFile />
                        </IconButton>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <IconButton
                                className={cx('sendButton')}
                                disabled={!message.trim() || message.length > MAX_CHAR_LIMIT}
                                onClick={handleSendMessage}
                            >
                                <img src={SendIcon} alt="Send" className={cx('sendIcon')} />
                            </IconButton>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Members Sidebar */}
            <MembersDrawer
                isOpen={isMembersSidebarOpen}
                onClose={toggleMembersSidebar}
                members={memberList}
                ownerId={currentGroup?.ownerId || undefined}
            />
        </div>
    );
}
