import { useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './PinnedMessages.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';
import { getPinnedMessagesAction, unpinMessageAction } from '../../../../redux/GroupStudySlice/GroupStudySlice';
import { useLocation } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { Message } from '../../../../types/groupStudy.types';
import { Delete } from '@mui/icons-material';

const cx = classNames.bind(styles);

export default function PinnedMessages() {
    const dispatch = useAppDispatch();
    const { pinnedMessages, currentGroup } = useAppSelector((state: any) => state.groupStudy);
    const { accountId } = useAppSelector((state: any) => state.authentication);

    // Get group ID from URL path
    const location = useLocation();
    const getGroupIdFromPath = () => {
        const pathSegments = location.pathname.split('/');
        const groupStudyIndex = pathSegments.findIndex((segment) => segment === 'group-study');
        if (groupStudyIndex !== -1 && pathSegments.length > groupStudyIndex + 1) {
            return Number(pathSegments[groupStudyIndex + 1]);
        }
        return null;
    };

    const groupId = getGroupIdFromPath();

    // Fetch pinned messages when component mounts
    useEffect(() => {
        if (groupId) {
            dispatch(getPinnedMessagesAction({ groupId, page: 0, size: 10 }));
        }
    }, [dispatch, groupId]);

    // Check if current user is group owner
    const isGroupOwner = currentGroup?.ownerId === accountId;

    // Handle unpinning a message
    const handleUnpin = (messageId: number) => {
        dispatch(unpinMessageAction({ messageId }));

        // Refetch pinned messages after unpinning
        if (groupId) {
            setTimeout(() => {
                dispatch(getPinnedMessagesAction({ groupId, page: 0, size: 10 }));
            }, 300);
        }
    };

    // Format time for display
    const formatTime = (timestamp: string | undefined) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return (
            date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
            ', ' +
            date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
        );
    };

    return (
        <div className={cx('pinned-messages')}>
            <h3 className={cx('title')}>Tin nhắn đã ghim</h3>

            {pinnedMessages && pinnedMessages.length > 0 ? (
                <div className={cx('message-list')}>
                    {pinnedMessages.map((message: Message) => (
                        <div key={message.messageId} className={cx('message-item')}>
                            <div className={cx('message-header')}>
                                <span className={cx('sender-id')}>{message.username}</span>
                                <button
                                    className={cx('unpin-icon')}
                                    onClick={() => handleUnpin(message.messageId)}
                                    title="Bỏ ghim tin nhắn"
                                >
                                    <Delete fontSize="small" />
                                </button>
                                <span className={cx('timestamp')}>{formatTime(message.createdAt)}</span>
                            </div>

                            <div className={cx('message-content')}>{message.content}</div>

                            {(isGroupOwner || accountId === message.senderId) && (
                                <button
                                    className={cx('unpin-button')}
                                    onClick={() => handleUnpin(message.messageId)}
                                    title="Bỏ ghim tin nhắn"
                                >
                                    <DeleteIcon />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className={cx('no-messages')}>Không có tin nhắn nào được ghim</div>
            )}
        </div>
    );
}
