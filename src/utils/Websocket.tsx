import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import JsCookie from 'js-cookie';
import { useAppDispatch, useAppSelector } from '../redux/store';
// import { updateNotification } from "../redux/Notication/NoticationSlice";
import { useEffect } from 'react';
import {
    updateNotification,
    updateNumberOfNotificationsAll,
    updateNumberOfNotificationsUnRead,
} from '../redux/Notication/NoticationSlice';
import {
    updateChatMessage,
    WebSocketChatMessage,
    updateUnreadMessages,
} from '../redux/GroupStudySlice/GroupStudySlice';
import store from '../redux/store';
import { toast } from 'react-toastify';
import { AutoLoginAction } from '../redux/AuthenticationSlice/AuthenticationSlice';
import { getGroupDetailsAction } from '../redux/GroupStudySlice/GroupStudySlice';
import { DocumentAttached } from '../components/SharingModal/SharingModal';
type NotificationResponse = {
    notificationId: number;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
};

type JoinRequestNotification = {
    notificationId: number;
    accountId: number;
    message: string;
    type: string;
    isRead: boolean;
    isSaved: boolean;
    deletedFlag: boolean;
    createdAt: string;
};

let stompClient: Client;
const websocketUrl = import.meta.env.VITE_APP_WEBSOCKET_URL;
export const WebsocketConnection: React.FC = () => {
    const dispatch = useAppDispatch();
    const { accountId, isLogined } = useAppSelector((state) => state.authentication);
    const { currentGroup, userGroups } = useAppSelector((state) => state.groupStudy);
    const { numberOfNotificationsUnRead, numberOfNotifications } = useAppSelector((state) => state.notication);
    // const token = JsCookie.get('accessToken');
    useEffect(() => {
        const token = JsCookie.get('accessToken');
        if (!token || accountId === null || !isLogined) {
            console.error('No access token found');
            dispatch(AutoLoginAction());
            return;
        }

        stompClient = new Client({
            webSocketFactory: () => new SockJS(websocketUrl, null, { transports: ['websocket'] }),
            connectHeaders: {
                token: token,
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        stompClient.onConnect = () => {
            console.log('WebSocket Connected!');
            stompClient?.subscribe(`/user/${accountId}/queue/notifications-with-follow`, (message) => {
                const data: NotificationResponse = JSON.parse(message.body);
                dispatch(updateNotification(data));
                dispatch(updateNumberOfNotificationsUnRead(numberOfNotificationsUnRead + 1));
                dispatch(updateNumberOfNotificationsAll(numberOfNotifications + 1));
            });
            stompClient?.subscribe(`/user/${accountId}/queue/notifications-with-upload`, (message) => {
                const data: NotificationResponse = JSON.parse(message.body);
                dispatch(updateNotification(data));
                dispatch(updateNumberOfNotificationsUnRead(numberOfNotificationsUnRead + 1));
                dispatch(updateNumberOfNotificationsAll(numberOfNotifications + 1));
            });

            stompClient?.subscribe(`/user/${accountId}/queue/notifications-with-e-learning`, (message) => {
                const data: NotificationResponse = JSON.parse(message.body);
                dispatch(updateNotification(data));
                dispatch(updateNumberOfNotificationsUnRead(numberOfNotificationsUnRead + 1));
                dispatch(updateNumberOfNotificationsAll(numberOfNotifications + 1));
            });

            // Kiểm tra và đăng ký lắng nghe tin nhắn nhóm nếu currentGroup có giá trị
            if (currentGroup?.groupId) {
                stompClient?.subscribe(`/user/${currentGroup.groupId}/queue/messages`, (message) => {
                    try {
                        // Parse the message data
                        const data = JSON.parse(message.body);
                        console.log('data', data);
                        // Create a message in the format expected by Redux
                        const chatMessage: WebSocketChatMessage = {
                            messageId: data.messageId,
                            senderId: data.senderId || 0,
                            groupId: data.groupId,
                            content: data.content,
                            timestamp: data.timestamp || new Date().toISOString(),
                            username: data.username,
                            profilePicture: data.profilePicture,
                            documentId: data.documentId,
                            documentName: data.documentName,
                            docFilePath: data.docFilePath,
                            messageType: data.messageType,
                        };

                        // Dispatch to Redux store
                        dispatch(updateChatMessage(chatMessage));
                    } catch (error) {
                        console.error('Error processing WebSocket message:', error);
                    }
                });
            }

            if (userGroups.length > 0) {
                userGroups.forEach((group) => {
                    if (group.groupId && group.groupId !== currentGroup?.groupId) {
                        stompClient?.subscribe(`/user/${group.groupId}/queue/messages`, () => {
                            dispatch(updateUnreadMessages({ groupId: group.groupId, count: 1 }));
                        });
                    }
                });
            }
            stompClient?.subscribe(`/user/${accountId}/queue/notifications-with-group`, (message) => {
                const data: JoinRequestNotification = JSON.parse(message.body);
                if (currentGroup) {
                    dispatch(getGroupDetailsAction(currentGroup.groupId));
                }
                dispatch(updateNotification(data));
                dispatch(updateNumberOfNotificationsUnRead(numberOfNotificationsUnRead + 1));
                dispatch(updateNumberOfNotificationsAll(numberOfNotifications + 1));
            });
        };

        stompClient.onStompError = (frame) => {
            console.error('Broker reported error:', frame.headers['message']);
            console.error('Additional details:', frame.body);
        };

        stompClient.activate();

        return () => {
            stompClient?.deactivate();
        };
    }, [dispatch, accountId, numberOfNotificationsUnRead, numberOfNotifications]);
    return null;
};

// Export stompClient to be used elsewhere (like in the group chat component)
export const getStompClient = (): Client | undefined => {
    return stompClient;
};

// Function to send a message to group chat
export const sendGroupChatMessage = (
    groupId: number,
    content: string,
    type: string,
    documentAttached: DocumentAttached | null,
): void => {
    if (!stompClient || !stompClient.connected) {
        console.error('WebSocket connection not established');
        toast.error('Không thể gửi tin nhắn. Kết nối WebSocket chưa được thiết lập.');
        return;
    }

    const state = store.getState();
    const accountId = state.authentication.accountId;
    // Get username and profilePicture from Redux store
    const username = state.authentication.username || `Student ${accountId}`;
    const profilePicture = state.authentication.profilePicture || '';

    if (!accountId) {
        console.error('User not authenticated');
        toast.error('Vui lòng đăng nhập để gửi tin nhắn.');
        return;
    }
    try {
        // Get current date with correct local time
        const now = new Date();

        // Format timestamp with local timezone consideration
        // Format: YYYY-MM-DDTHH:MM:SS
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const formattedTimestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        let messageRequest = {};
        if (documentAttached !== null) {
            messageRequest = {
                groupId,
                content,
                timestamp: formattedTimestamp,
                username,
                profilePicture,
                documentId: documentAttached.documentId,
                documentName: documentAttached.documentName,
                docFilePath: documentAttached.docFilePath,
                messageType: type,
            };
        } else {
            messageRequest = {
                groupId,
                content,
                timestamp: formattedTimestamp,
                username,
                profilePicture,
                documentId: null,
                documentName: null,
                docFilePath: null,
                messageType: type,
            };
        }

        stompClient.publish({
            destination: `/app/chat.private`,
            body: JSON.stringify(messageRequest),
        });
    } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.');
    }
};
