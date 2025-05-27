import { useMemo } from 'react';
import classNames from 'classnames/bind';
import styles from './PinnedMessages.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';
import { unpinMessageAction } from '../../../../redux/GroupStudySlice/GroupStudySlice';
import DeleteIcon from '@mui/icons-material/Delete';
import { Message } from '../../../../types/groupStudy.types';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

interface PinnedMessagesProps {
    pinnedMessages: Message[];
}

export default function PinnedMessages({ pinnedMessages }: PinnedMessagesProps) {
    const dispatch = useAppDispatch();
    const { currentGroup } = useAppSelector((state) => state.groupStudy);

    // Check if current user is group owner
    const hasPermission = useMemo(() => {
        return currentGroup?.role === 'OWNER' || currentGroup?.role === 'ADMIN';
    }, [currentGroup?.role]);

    // Handle unpinning a message
    const handleUnpin = (messageId: number) => {
        if (hasPermission) {
            dispatch(unpinMessageAction({ messageId }));
        } else {
            toast.error('Bạn không có quyền bỏ ghim tin nhắn');
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
                                <span className={cx('timestamp')}>{formatTime(message.createdAt)}</span>
                            </div>

                            <div className={cx('message-content')}>{message.content}</div>

                            {hasPermission && (
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
