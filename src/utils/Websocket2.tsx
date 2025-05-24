import React, { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import JsCookie from 'js-cookie';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { jwtDecode } from "jwt-decode";
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
import { AutoLoginAction } from '../redux/AuthenticationSlice/AuthenticationSlice';
import store from '../redux/store';
import { axiosInstance } from './AxiosInterceptor';
import { ApiResponse } from '../types/response.type';

interface QueuedMessage {
    groupId: number;
    content: string;
    timestamp: string;
    username: string;
    profilePicture: string;
    retryCount: number;
}

interface TokenInfo {
    token: string;
    expiresAt: number; // timestamp
}

class WebSocketManager {
    private stompClient: Client | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000; // Start with 1 second
    private maxReconnectDelay = 30000; // Max 30 seconds
    private tokenRefreshTimer: NodeJS.Timeout | null = null;
    private messageQueue: QueuedMessage[] = [];
    private isConnecting = false;
    private websocketUrl: string;
    private dispatch: any;

    constructor(websocketUrl: string, dispatch: any) {
        this.websocketUrl = websocketUrl;
        this.dispatch = dispatch;
    }

    // Parse JWT token to get expiration time
    private parseTokenExpiration(token: string): number {
        try {
            const payload = jwtDecode(token);
        if (payload.exp) {
            return payload.exp * 1000; // Convert to milliseconds
        } else {
            console.warn('Token does not have an expiration time');
            return Date.now() + 15 * 60 * 1000; // Default to 15 minutes
        }
        } catch (error) {
            console.error('Error parsing token:', error);
            return Date.now() + 15 * 60 * 1000; // Default 15 minutes
        }
    }

    // Get token info from cookie
    private getTokenInfo(): TokenInfo | null {
        const token = JsCookie.get('accessToken');
        if (!token) return null;

        const expiresAt = this.parseTokenExpiration(token);
        return { token, expiresAt };
    }

    // Refresh token using refresh token from cookie
    private async refreshToken(): Promise<void | null> {
        try {
            const response : ApiResponse<string> = await axiosInstance.get<void, ApiResponse<string>>('/identity/auth/refresh-token');
            if (response.data && response.code===200) {
                console.log('Token refreshed successfully');
                return;
            } else {
                console.error('Token refresh failed');
                return;
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            return null;
        }
    }

    // Schedule token refresh before expiration
    private scheduleTokenRefresh(expiresAt: number): void {
        if (this.tokenRefreshTimer) {
            clearTimeout(this.tokenRefreshTimer);
        }

        // Refresh 5 minutes before expiration or at 70% of token lifetime
        const now = Date.now();
        const lifetime = expiresAt - now;
        const refreshTime = Math.max(lifetime * 0.7, now + 5 * 60 * 1000);

        const delay = Math.max(refreshTime - now, 60000); // At least 1 minute delay

        this.tokenRefreshTimer = setTimeout(async () => {
            console.log('Refreshing token before expiration...');
            await this.refreshToken();

            if (this.stompClient?.connected) {
                // Gracefully reconnect with new token
                this.reconnectWithNewToken();
            }
        }, delay);

        console.log(`Token refresh scheduled in ${Math.round(delay / 1000)} seconds`);
    }

    // Reconnect with new token
    private async reconnectWithNewToken(): Promise<void> {
        if (this.stompClient) {
            console.log('Reconnecting with new token...');

            // Disconnect current connection
            this.stompClient.deactivate();

            // Wait a bit before reconnecting
            setTimeout(() => {
                this.connect();
            }, 1000);
        }
    }

    // Connect to WebSocket
    public async connect(): Promise<void> {
        if (this.isConnecting || (this.stompClient && this.stompClient.connected)) {
            return;
        }

        const tokenInfo = this.getTokenInfo();
        if (!tokenInfo) {
            console.error('No valid token found');
            this.refreshToken();
            this.reconnectWithNewToken();
            return;
        }

        const state = store.getState();
        const { accountId, isLogined } = state.authentication;

        if (!accountId || !isLogined) {
            console.error('User not authenticated');
            this.refreshToken();
            this.reconnectWithNewToken();
            return;
        }

        this.isConnecting = true;

        try {
            this.stompClient = new Client({
                webSocketFactory: () =>
                    new SockJS(this.websocketUrl, null, {
                        transports: ['websocket', 'xhr-polling'],
                    }),
                connectHeaders: {
                    token: tokenInfo.token,
                    'X-Account-Id': accountId.toString(),
                },
                reconnectDelay: 0, // We handle reconnection manually
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                debug: (str) => {
                    console.log('STOMP Debug:', str);
                },
            });

            this.stompClient.onConnect = () => {
                console.log('WebSocket Connected successfully!');
                this.isConnecting = false;
                this.reconnectAttempts = 0;
                this.reconnectDelay = 1000;

                // Schedule token refresh
                this.scheduleTokenRefresh(tokenInfo.expiresAt);

                // Subscribe to channels
                this.subscribeToChannels();

                // Process queued messages
                this.processMessageQueue();
            };

            this.stompClient.onStompError = (frame) => {
                console.error('STOMP Error:', frame.headers['message']);
                console.error('Error details:', frame.body);
                this.isConnecting = false;

                // Handle authentication errors
                if (frame.headers['message']?.includes('Unauthorized') || frame.headers['message']?.includes('Token')) {
                    this.handleTokenExpiration();
                } else {
                    this.handleReconnect();
                }
            };

            this.stompClient.onWebSocketClose = () => {
                console.log('WebSocket connection closed');
                this.isConnecting = false;
                this.handleReconnect();
            };

            this.stompClient.onWebSocketError = (error) => {
                console.error('WebSocket error:', error);
                this.isConnecting = false;
                this.handleReconnect();
            };

            this.stompClient.activate();
        } catch (error) {
            console.error('Error creating STOMP client:', error);
            this.isConnecting = false;
            this.handleReconnect();
        }
    }

    // Handle token expiration
    private async handleTokenExpiration(): Promise<void> {
        console.log('Token expired, attempting to refresh...');
        const newToken = await this.refreshToken();

        if (newToken) {
            setTimeout(() => {
                this.connect();
            }, 1000);
        } else {
            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
    }

    // Handle reconnection with exponential backoff
    private handleReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            toast.error('Không thể kết nối đến server. Vui lòng tải lại trang.');
            return;
        }

        this.reconnectAttempts++;
        const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), this.maxReconnectDelay);

        console.log(
            `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
        );

        setTimeout(() => {
            this.connect();
        }, delay);
    }

    // Subscribe to all channels
    private subscribeToChannels(): void {
        if (!this.stompClient || !this.stompClient.connected) return;

        const state = store.getState();
        const { accountId } = state.authentication;
        const { currentGroup, userGroups } = state.groupStudy;
        const { numberOfNotificationsUnRead, numberOfNotifications } = state.notication;

        // Subscribe to notification channels
        this.stompClient.subscribe(`/user/${accountId}/queue/notifications-with-follow`, (message) => {
            const data = JSON.parse(message.body);
            this.dispatch(updateNotification(data));
            this.dispatch(updateNumberOfNotificationsUnRead(numberOfNotificationsUnRead + 1));
            this.dispatch(updateNumberOfNotificationsAll(numberOfNotifications + 1));
        });

        this.stompClient.subscribe(`/user/${accountId}/queue/notifications-with-upload`, (message) => {
            const data = JSON.parse(message.body);
            this.dispatch(updateNotification(data));
            this.dispatch(updateNumberOfNotificationsUnRead(numberOfNotificationsUnRead + 1));
            this.dispatch(updateNumberOfNotificationsAll(numberOfNotifications + 1));
        });

        this.stompClient.subscribe(`/user/${accountId}/queue/notifications-with-e-learning`, (message) => {
            const data = JSON.parse(message.body);
            this.dispatch(updateNotification(data));
            this.dispatch(updateNumberOfNotificationsUnRead(numberOfNotificationsUnRead + 1));
            this.dispatch(updateNumberOfNotificationsAll(numberOfNotifications + 1));
        });

        this.stompClient.subscribe(`/user/${accountId}/queue/notifications-with-join-request`, (message) => {
            const data = JSON.parse(message.body);
            this.dispatch(updateNotification(data));
            this.dispatch(updateNumberOfNotificationsUnRead(numberOfNotificationsUnRead + 1));
            this.dispatch(updateNumberOfNotificationsAll(numberOfNotifications + 1));
        });

        // Subscribe to current group messages
        if (currentGroup?.groupId) {
            this.stompClient?.subscribe(`/user/${currentGroup.groupId}/queue/messages`, (message) => {
                try {
                    // Parse the message data
                    const data = JSON.parse(message.body);

                    // Create a message in the format expected by Redux
                    const chatMessage: WebSocketChatMessage = {
                        messageId: Date.now(),
                        senderId: data.senderId || 0,
                        groupId: data.groupId,
                        content: data.content,
                        timestamp: data.timestamp || new Date().toISOString(),
                        username: data.username,
                        profilePicture: data.profilePicture,
                    };

                    // Dispatch to Redux store
                    this.dispatch(updateChatMessage(chatMessage));
                } catch (error) {
                    console.error('Error processing WebSocket message:', error);
                }
            });
        }

        // Subscribe to other groups for unread message counts
        if (userGroups.length > 0) {
            userGroups.forEach((group) => {
                if (group.groupId && group.groupId !== currentGroup?.groupId) {
                    this.stompClient?.subscribe(`/user/${group.groupId}/queue/messages`, () => {
                        this.dispatch(updateUnreadMessages({ groupId: group.groupId, count: 1 }));
                    });
                }
            });
        }
    }

    // Send message with queue management
    public sendMessage(groupId: number, content: string): void {
        const state = store.getState();
        const accountId = state.authentication.accountId;
        const username = state.authentication.username || `Student ${accountId}`;
        const profilePicture = state.authentication.profilePicture || '';

        if (!accountId) {
            console.error('User not authenticated');
            toast.error('Vui lòng đăng nhập để gửi tin nhắn.');
            return;
        }

        const now = new Date();
        const formattedTimestamp = now.toISOString().slice(0, 19); // YYYY-MM-DDTHH:MM:SS

        const messageRequest = {
            groupId,
            content,
            timestamp: formattedTimestamp,
            username,
            profilePicture,
            retryCount: 0,
        };

        if (!this.stompClient || !this.stompClient.connected) {
            // Queue message if not connected
            this.messageQueue.push(messageRequest);
            toast.info('Tin nhắn sẽ được gửi khi kết nối được khôi phục.');

            // Try to reconnect
            if (!this.isConnecting) {
                this.connect();
            }
            return;
        }

        try {
            this.stompClient.publish({
                destination: `/app/chat.private`,
                body: JSON.stringify(messageRequest),
            });
            console.log('Message sent successfully');
        } catch (error) {
            console.error('Error sending message:', error);
            // Add to queue for retry
            this.messageQueue.push(messageRequest);
            toast.error('Có lỗi xảy ra khi gửi tin nhắn. Sẽ thử gửi lại...');
        }
    }

    // Process queued messages
    private processMessageQueue(): void {
        if (this.messageQueue.length === 0) return;

        console.log(`Processing ${this.messageQueue.length} queued messages`);

        const messagesToProcess = [...this.messageQueue];
        this.messageQueue = [];

        messagesToProcess.forEach((message) => {
            if (message.retryCount < 3) {
                try {
                    this.stompClient?.publish({
                        destination: `/app/chat.private`,
                        body: JSON.stringify(message),
                    });
                    console.log('Queued message sent successfully');
                } catch (error) {
                    console.error('Error sending queued message:', error);
                    message.retryCount++;
                    this.messageQueue.push(message);
                }
            } else {
                console.error('Message failed after 3 retries, discarding');
            }
        });
    }

    // Disconnect
    public disconnect(): void {
        if (this.tokenRefreshTimer) {
            clearTimeout(this.tokenRefreshTimer);
            this.tokenRefreshTimer = null;
        }

        if (this.stompClient) {
            this.stompClient.deactivate();
            this.stompClient = null;
        }

        this.isConnecting = false;
        this.reconnectAttempts = 0;
    }

    public isConnected(): boolean {
        return this.stompClient?.connected || false;
    }

    public getClient(): Client | null {
        return this.stompClient;
    }
}

// Global WebSocket manager instance
let wsManager: WebSocketManager | null = null;

const websocketUrl = import.meta.env.VITE_APP_WEBSOCKET_URL;

export const WebsocketConnection2: React.FC = () => {
    const dispatch = useAppDispatch();
    const { accountId, isLogined } = useAppSelector((state) => state.authentication);
    const { currentGroup, userGroups } = useAppSelector((state) => state.groupStudy);
    const managerRef = useRef<WebSocketManager | null>(null);

    useEffect(() => {
        if (!accountId || !isLogined) {
            if (managerRef.current) {
                managerRef.current.disconnect();
                managerRef.current = null;
            }
            return;
        }

        // Create new WebSocket manager if not exists
        if (!managerRef.current) {
            managerRef.current = new WebSocketManager(websocketUrl, dispatch);
            wsManager = managerRef.current;
        }

        // Connect
        managerRef.current.connect();

        return () => {
            if (managerRef.current) {
                managerRef.current.disconnect();
                managerRef.current = null;
                wsManager = null;
            }
        };
    }, [dispatch, accountId, isLogined]);

    // Reconnect when group changes
    useEffect(() => {
        if (managerRef.current && managerRef.current.isConnected() && currentGroup) {
            // Resubscribe to new group
            setTimeout(() => {
                managerRef.current?.connect();
            }, 100);
        }
    }, [currentGroup, userGroups]);

    return null;
};

// Export functions for external use
export const getStompClient = (): Client | null => {
    return wsManager?.getClient() || null;
};

export const sendGroupChatMessage = (groupId: number, content: string): void => {
    if (!wsManager) {
        console.error('WebSocket manager not initialized');
        toast.error('Kết nối WebSocket chưa được khởi tạo.');
        return;
    }

    wsManager.sendMessage(groupId, content);
};

export const isWebSocketConnected = (): boolean => {
    return wsManager?.isConnected() || false;
};

export const reconnectWebSocket = (): void => {
    if (wsManager) {
        wsManager.connect();
    }
};
