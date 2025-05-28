import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import {
    createGroupApi,
    deleteGroupApi,
    editGroupApi,
    getGroupDetailsApi,
    getPinnedMessagesApi,
    listMembersApi,
    pinMessageApi,
    removeMemberApi,
    shareDocumentApi,
    sendMessageApi,
    searchSubjectsApi,
    addMemberApi,
    joinGroupApi,
    unpinMessageApi,
    updatePrivacySettingApi,
    getGroupMessagesApi,
    findUserGroupsApi,
    transferOwnershipApi,
    deleteMessageApi,
    searchGroupApi,
    getGroupOfUserApi,
    approveJoinRequestApi,
    rejectJoinRequestApi,
    leaveGroupApi,
    setRoleApi,
} from '../../services/GroupStudyAPI/GroupStudyAPI';
import {
    IGroup,
    Message,
    ChatMessage,
    CreateGroupRequest,
    ShareDocumentRequest,
    SubjectDto,
    SearchGroupResult,
    MemberResponse,
} from '../../types/groupStudy.types';

// Add this type if not already defined
export interface WebSocketChatMessage {
    senderId: number;
    groupId: number;
    content: string;
    timestamp: string;
    username: string;
    profilePicture: string;
    messageId: number;
    documentId: string | null;
    documentName: string | null;
    docFilePath: string | null;
    messageType: string;
}

// Async Actions
export const createGroupAction = createAsyncThunk<IGroup, CreateGroupRequest>(
    'groupStudy/createGroup',
    async (data) => {
        try {
            const response = await createGroupApi(data);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error('Không thể tạo nhóm. Vui lòng thử lại sau.');
            throw Error(error.message);
        }
    },
);

export const searchSubjectsAction = createAsyncThunk<SubjectDto[], string>(
    'groupStudy/searchSubjects',
    async (subjectName) => {
        try {
            const response = await searchSubjectsApi(subjectName);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error('Không thể tìm kiếm môn học. Vui lòng thử lại sau.');
            throw Error(error.message);
        }
    },
);

export const getGroupDetailsAction = createAsyncThunk<IGroup, number>('groupStudy/getGroupDetails', async (groupId) => {
    try {
        const response = await getGroupDetailsApi(groupId);
        return response.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        toast.error('Không thể lấy thông tin nhóm. Vui lòng thử lại sau.');
        throw Error(error.message);
    }
});

export const removeMemberAction = createAsyncThunk<number, { groupId: number; userId: number }>(
    'groupStudy/removeMember',
    async ({ groupId, userId }) => {
        try {
            await removeMemberApi(groupId, userId);
            toast.success('Đã xóa thành viên thành công');
            return userId;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error('Không thể xóa thành viên. Vui lòng thử lại sau.');
            throw Error(error.message);
        }
    },
);

export const addMemberAction = createAsyncThunk<void, { groupId: number; userId: number }>(
    'groupStudy/addMember',
    async ({ groupId, userId }) => {
        try {
            await addMemberApi(groupId, userId);
            toast.success('Đã thêm thành viên thành công');
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error('Không thể thêm thành viên. Vui lòng thử lại sau.');
            throw Error(error.message);
        }
    },
);

export const joinGroupAction = createAsyncThunk<void, number>('groupStudy/joinGroup', async (groupId) => {
    try {
        await joinGroupApi(groupId);
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;

        // If status code is 400, show a different toast message
        if (error.response?.status === 400) {
            return; // Don't throw error since this is expected behavior
        }

        throw Error(error.message);
    }
});

export const listMembersAction = createAsyncThunk<MemberResponse[], { groupId: number; page: number; size: number }>(
    'groupStudy/listMembers',
    async ({ groupId, page, size }) => {
        try {
            const response = await listMembersApi(groupId, page, size);
            return response.data.content;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error('Không thể lấy danh sách thành viên. Vui lòng thử lại sau.');
            throw Error(error.message);
        }
    },
);

export const deleteGroupAction = createAsyncThunk<void, number>('groupStudy/deleteGroup', async (groupId) => {
    try {
        await deleteGroupApi(groupId);
        toast.success('Đã xóa nhóm thành công');
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        toast.error('Không thể xóa nhóm. Vui lòng thử lại sau.');
        throw Error(error.message);
    }
});

export const editGroupAction = createAsyncThunk<IGroup, { groupId: number; data: CreateGroupRequest }>(
    'groupStudy/editGroup',
    async ({ groupId, data }) => {
        try {
            const response = await editGroupApi(groupId, data);
            toast.success('Đã cập nhật nhóm thành công');
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error('Không thể cập nhật thông tin nhóm. Vui lòng thử lại sau.');
            throw Error(error.message);
        }
    },
);

export const pinMessageAction = createAsyncThunk<void, { messageId: number }>(
    'groupStudy/pinMessage',
    async ({ messageId }) => {
        try {
            await pinMessageApi(messageId);
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error('Không thể ghim tin nhắn. Vui lòng thử lại sau.');
            throw Error(error.message);
        }
    },
);

export const unpinMessageAction = createAsyncThunk<number, { messageId: number }>(
    'groupStudy/unpinMessage',
    async ({ messageId }) => {
        try {
            await unpinMessageApi(messageId);
            return messageId;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error('Không thể bỏ ghim tin nhắn. Vui lòng thử lại sau.');
            throw Error(error.message);
        }
    },
);

export const shareDocumentAction = createAsyncThunk<Message, { groupId: number; data: ShareDocumentRequest }>(
    'groupStudy/shareDocument',
    async ({ groupId, data }) => {
        try {
            const response = await shareDocumentApi(groupId, data);
            toast.success('Đã chia sẻ tài liệu thành công');
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error('Không thể chia sẻ tài liệu. Vui lòng thử lại sau.');
            throw Error(error.message);
        }
    },
);

export const updatePrivacySettingAction = createAsyncThunk<IGroup, { groupId: number; isPrivate: boolean }>(
    'groupStudy/updatePrivacySetting',
    async ({ groupId, isPrivate }) => {
        try {
            const response = await updatePrivacySettingApi(groupId, isPrivate);
            toast.success('Đã cập nhật quyền riêng tư thành công');
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error('Không thể cập nhật quyền riêng tư. Vui lòng thử lại sau.');
            throw Error(error.message);
        }
    },
);

export const getPinnedMessagesAction = createAsyncThunk<Message[], { groupId: number; page: number; size: number }>(
    'groupStudy/getPinnedMessages',
    async ({ groupId, page, size }) => {
        try {
            const response = await getPinnedMessagesApi(groupId, page, size);
            // Sắp xếp tin nhắn đã ghim theo thời gian trước khi trả về
            if (Array.isArray(response.data.content)) {
                return [...response.data.content].sort((a, b) => {
                    const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
                    const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
                    return timeA - timeB; // Oldest first
                });
            }
            return response.data.content;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string; code?: number }>;

            // Check if it's a 404 "No pinned messages found" error
            if (
                error.response?.status === 404 ||
                (error.response?.data.code === 404 &&
                    error.response?.data.message?.includes('No pinned messages found'))
            ) {
                // Return empty array instead of throwing error
                return [];
            }
            throw Error(error.message);
        }
    },
);

export const getGroupMessagesAction = createAsyncThunk<
    { messages: Message[]; page: number; isLoadMore?: boolean },
    { groupId: number; page: number; size: number; isLoadMore?: boolean }
>('groupStudy/getGroupMessages', async ({ groupId, page, size, isLoadMore = false }) => {
    try {
        const response = await getGroupMessagesApi(groupId, page, size);
        return {
            messages: response.data.content,
            page,
            isLoadMore,
        };
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        toast.error('Không thể lấy tin nhắn nhóm. Vui lòng thử lại sau.');
        throw Error(error.message);
    }
});

export const sendMessageAction = createAsyncThunk<Message, { data: ChatMessage }>(
    'groupStudy/sendMessage',
    async ({ data }) => {
        try {
            const response = await sendMessageApi(data);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error('Không thể gửi tin nhắn. Vui lòng thử lại sau.');
            throw Error(error.message);
        }
    },
);

export const findUserGroupsAction = createAsyncThunk<IGroup[], number>('groupStudy/findUserGroups', async (userId) => {
    try {
        const response = await findUserGroupsApi(userId);
        return response.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        toast.error('Không thể lấy danh sách nhóm. Vui lòng thử lại sau.');
        throw Error(error.message);
    }
});

export const transferOwnershipAction = createAsyncThunk<void, { groupId: number; newOwnerId: number }>(
    'groupStudy/transferOwnership',
    async ({ groupId, newOwnerId }) => {
        try {
            await transferOwnershipApi(groupId, newOwnerId);
            toast.success('Đã chuyển quyền sở hữu thành công');
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error('Không thể chuyển quyền sở hữu. Vui lòng thử lại sau.');
            throw Error(error.message);
        }
    },
);

export const deleteMessageAction = createAsyncThunk<void, number>('groupStudy/deleteMessage', async (messageId) => {
    try {
        await deleteMessageApi(messageId);
        toast.success('Đã xóa tin nhắn thành công');
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        toast.error('Không thể xóa tin nhắn. Vui lòng thử lại sau.');
        throw Error(error.message);
    }
});

export const searchGroupAction = createAsyncThunk<SearchGroupResult[], string>(
    'groupStudy/searchGroup',
    async (keyword) => {
        try {
            const response = await searchGroupApi(keyword);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error('Không thể tìm kiếm nhóm. Vui lòng thử lại sau.');
            throw Error(error.message);
        }
    },
);

export const getGroupOfUserAction = createAsyncThunk<IGroup[], void>('groupStudy/getGroupOfUser', async () => {
    try {
        const response = await getGroupOfUserApi();
        return response.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        toast.error('Không thể lấy danh sách nhóm. Vui lòng thử lại sau.');
        throw Error(error.message);
    }
});

export const approveJoinRequestAction = createAsyncThunk<void, number>(
    'groupStudy/approveJoinRequest',
    async (joinRequestId) => {
        try {
            await approveJoinRequestApi(joinRequestId);
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error('Không thể phê duyệt yêu cầu tham gia nhóm. Vui lòng thử lại sau.');
            throw Error(error.message);
        }
    },
);

export const rejectJoinRequestAction = createAsyncThunk<void, number>(
    'groupStudy/rejectJoinRequest',
    async (joinRequestId) => {
        try {
            await rejectJoinRequestApi(joinRequestId);
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error('Không thể từ chối yêu cầu tham gia nhóm. Vui lòng thử lại sau.');
            throw Error(error.message);
        }
    },
);

export const leaveGroupAction = createAsyncThunk<void, number>('groupStudy/leaveGroup', async (groupId) => {
    try {
        await leaveGroupApi(groupId);
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        toast.error('Không thể rời nhóm. Vui lòng thử lại sau.');
        throw Error(error.message);
    }
});

export const setRoleAction = createAsyncThunk<
    { userId: number; role: string },
    { groupId: number; userId: number; role: string }
>('groupStudy/setRole', async ({ groupId, userId, role }) => {
    try {
        await setRoleApi(groupId, userId, role);
        return { userId, role };
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw Error(error.message);
    }
});

// Initial State
interface GroupStudyState {
    loading: boolean;
    error: string;
    currentGroup: IGroup | null;
    memberList: MemberResponse[];
    pinnedMessages: Message[];
    messages: Message[];
    totalMembers: number;
    totalPinnedMessages: number;
    totalMessages: number;
    subjects: SubjectDto[];
    userGroups: IGroup[];
    searchResults: SearchGroupResult[];
    pendingJoinRequests: {
        requestId: number;
        groupId: number;
        userId: number;
        username: string;
        profilePicture?: string;
    }[];
    unreadMessages: Array<{ groupId: number; count: number }>; // Mảng những cặp groupId và số lượng tin nhắn chưa đọc
}

const initialState: GroupStudyState = {
    loading: false,
    error: '',
    currentGroup: null,
    memberList: [],
    pinnedMessages: [],
    messages: [],
    totalMembers: 0,
    totalPinnedMessages: 0,
    totalMessages: 0,
    subjects: [],
    userGroups: [],
    searchResults: [],
    pendingJoinRequests: [],
    unreadMessages: [],
};

// Slice
const GroupStudySlice = createSlice({
    name: 'groupStudy',
    initialState,
    reducers: {
        resetGroupState: (state) => {
            state.currentGroup = null;
            state.memberList = [];
            state.pinnedMessages = [];
            state.messages = [];
            state.pendingJoinRequests = [];
        },

        updateUserGroups: (state, action: PayloadAction<any | undefined>) => {
            if (!action.payload) return;
            const newGroups: IGroup = {
                groupId: action.payload.groupId,
                userId: action.payload.userId || null,
                message: null,
                isPrivate: action.payload.private,
                groupName: action.payload.groupName,
                description: action.payload.description,
                subjectId: action.payload.subjectId,
                subjectName: action.payload.subjectName,
                picture: action.payload.picture,
                memberLimited: action.payload.memberLimited,
                ownerId: null,
                createdAt: null,
                joinRequests: null,
                memberCount: action.payload.memberCount,
                role: action.payload.role || 'MEMBER',
            };
            state.userGroups = [...state.userGroups, newGroups];
        },

        updateMemberList: (state, action: PayloadAction<MemberResponse[]>) => {
            state.memberList = action.payload;
        },
        updateChatMessage: (state, action: PayloadAction<WebSocketChatMessage>) => {
            if (state.currentGroup) {
                // Check if this message is for the current group
                const groupId = state.currentGroup.groupId;

                if (groupId === action.payload.groupId) {
                    // Convert WebSocketChatMessage to Message format
                    const newMessage: Message = {
                        messageId: action.payload.messageId,
                        senderId: action.payload.senderId,
                        content: action.payload.content,
                        timestamp: action.payload.timestamp,
                        username: action.payload.username,
                        profilePicture: action.payload.profilePicture,
                        groupId: action.payload.groupId,
                        createdAt: action.payload.timestamp,
                        documentId: action.payload.documentId,
                        documentName: action.payload.documentName,
                        docFilePath: action.payload.docFilePath,
                        messageType: action.payload.messageType,
                        // Add other required fields with default values as needed
                    };

                    // Make sure state.messages is an array before using spread operator
                    if (!Array.isArray(state.messages)) {
                        state.messages = [];
                    }

                    // Add the new message to the messages array (append at the end for newest last)
                    state.messages = [...state.messages, newMessage];

                    // Sort messages by timestamp, oldest first (cũ lên trên, mới xuống dưới)
                    state.messages.sort((a, b) => {
                        const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
                        const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
                        return timeA - timeB; // Oldest first
                    });

                    state.totalMessages += 1;
                }
            }
        },

        updateUnreadMessages: (state, action: PayloadAction<{ groupId: number; count: number }>) => {
            const existingMessage = state.unreadMessages.find((message) => message.groupId === action.payload.groupId);
            if (existingMessage) {
                existingMessage.count += action.payload.count;
            } else {
                state.unreadMessages.push(action.payload);
            }
        },

        clearUnreadMessages: (state, action: PayloadAction<number>) => {
            const groupId = action.payload;
            state.unreadMessages = state.unreadMessages.filter((message) => message.groupId !== groupId);
        },

        resetSearchGroup: (state) => {
            state.searchResults = [];
        },

        updateJoinRequest: (
            state,
            action: PayloadAction<{
                joinRequestId: number;
                status: string;
                userId?: number;
                email?: string;
                name?: string;
                profilePicture?: string;
            }>,
        ) => {
            if (state.currentGroup) {
                if (action.payload.status === 'APPROVED' && action.payload.email && action.payload.name) {
                    state.currentGroup.joinRequests =
                        state.currentGroup.joinRequests?.filter(
                            (request) => request.id !== action.payload.joinRequestId,
                        ) || null;
                    const newMember = {
                        memberId: action.payload.userId,
                        email: action.payload.email,
                        name: action.payload.name,
                        profilePicture: action.payload.profilePicture,
                    };
                    state.memberList = [...state.memberList, newMember as MemberResponse];
                } else if (action.payload.status === 'REJECTED') {
                    state.currentGroup.joinRequests =
                        state.currentGroup.joinRequests?.filter(
                            (request) => request.id !== action.payload.joinRequestId,
                        ) || null;
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Group
            .addCase(createGroupAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(createGroupAction.fulfilled, (state, action) => {
                state.loading = false;
                state.currentGroup = action.payload;
                toast.success('Đã tạo nhóm thành công');
            })
            .addCase(createGroupAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể tạo nhóm';
            })

            // Search Subjects
            .addCase(searchSubjectsAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(searchSubjectsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.subjects = action.payload;
            })
            .addCase(searchSubjectsAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể tìm kiếm môn học';
            })

            // Get Group Details
            .addCase(getGroupDetailsAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGroupDetailsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.currentGroup = action.payload;
            })
            .addCase(getGroupDetailsAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể lấy thông tin nhóm';
            })

            // Add Member
            .addCase(addMemberAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(addMemberAction.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addMemberAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể thêm thành viên';
            })

            .addCase(joinGroupAction.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(joinGroupAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể tham gia nhóm';
            })

            // List Members
            .addCase(listMembersAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(listMembersAction.fulfilled, (state, action) => {
                state.loading = false;
                state.memberList = action.payload;
            })
            .addCase(listMembersAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể lấy danh sách thành viên';
            })

            .addCase(removeMemberAction.fulfilled, (state, action) => {
                state.loading = false;
                state.memberList = state.memberList.filter((member) => member.memberId !== action.payload);
            })
            .addCase(removeMemberAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể xóa thành viên';
            })

            // Delete Group
            .addCase(deleteGroupAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteGroupAction.fulfilled, (state) => {
                state.loading = false;
                state.currentGroup = null;
            })
            .addCase(deleteGroupAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể xóa nhóm';
            })

            // Edit Group
            .addCase(editGroupAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(editGroupAction.fulfilled, (state, action) => {
                state.loading = false;
                // Only update specific fields instead of replacing the entire currentGroup
                if (state.currentGroup) {
                    state.currentGroup = {
                        ...state.currentGroup,
                        groupName: action.payload.groupName,
                        description: action.payload.description,
                        subjectName: action.payload.subjectName,
                        isPrivate: action.payload.isPrivate,
                        picture: action.payload.picture,
                        memberLimited: action.payload.memberLimited,
                    };
                }
            })
            .addCase(editGroupAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể chỉnh sửa nhóm';
            })

            // Pin Message
            .addCase(pinMessageAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể ghim tin nhắn';
            })

            .addCase(unpinMessageAction.fulfilled, (state, action) => {
                state.loading = false;
                state.pinnedMessages = state.pinnedMessages.filter((message) => message.messageId !== action.payload);
            })
            .addCase(unpinMessageAction.rejected, (state, action) => {
                state.loading = false;
                toast.error(action.error.message || 'Không thể bỏ ghim tin nhắn');
            })

            // Update Privacy Setting
            .addCase(updatePrivacySettingAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePrivacySettingAction.fulfilled, (state, action) => {
                state.loading = false;
                state.currentGroup = action.payload;
            })
            .addCase(updatePrivacySettingAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể cập nhật quyền riêng tư';
            })

            // Share Document
            .addCase(shareDocumentAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(shareDocumentAction.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(shareDocumentAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể chia sẻ tài liệu';
            })

            // Get Pinned Messages
            .addCase(getPinnedMessagesAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPinnedMessagesAction.fulfilled, (state, action) => {
                state.loading = false;
                state.pinnedMessages = action.payload;
            })
            .addCase(getPinnedMessagesAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể lấy tin nhắn đã ghim';
            })

            // Get Group Messages
            .addCase(getGroupMessagesAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGroupMessagesAction.fulfilled, (state, action) => {
                state.loading = false;

                // Sort messages by timestamp
                const sortedMessages = [...action.payload.messages].sort((a, b) => {
                    const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
                    const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
                    return timeA - timeB; // Oldest first
                });

                // If loading more messages (older ones), prepend them to existing messages
                if (action.payload.isLoadMore) {
                    state.messages = [...sortedMessages, ...state.messages];
                } else {
                    // Otherwise it's the initial load, just set the messages
                    state.messages = sortedMessages;
                }
            })
            .addCase(getGroupMessagesAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể lấy tin nhắn nhóm';
            })

            // Send Message
            .addCase(sendMessageAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendMessageAction.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(sendMessageAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể gửi tin nhắn';
            })

            // Find User Groups
            .addCase(findUserGroupsAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(findUserGroupsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.userGroups = action.payload;
            })
            .addCase(findUserGroupsAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể lấy danh sách nhóm';
            })

            // Transfer Ownership
            .addCase(transferOwnershipAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(transferOwnershipAction.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(transferOwnershipAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể chuyển quyền sở hữu';
            })

            // Delete Message
            .addCase(deleteMessageAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteMessageAction.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteMessageAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể xóa tin nhắn';
            })

            // Search Group
            .addCase(searchGroupAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(searchGroupAction.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload;
            })
            .addCase(searchGroupAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể tìm kiếm nhóm';
            })

            // Get Group Of User
            .addCase(getGroupOfUserAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGroupOfUserAction.fulfilled, (state, action) => {
                state.loading = false;
                state.userGroups = action.payload;
            })
            .addCase(getGroupOfUserAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể lấy danh sách nhóm';
            })

            // Approve Join Request
            .addCase(approveJoinRequestAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(approveJoinRequestAction.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(approveJoinRequestAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể phê duyệt yêu cầu tham gia nhóm';
            })

            // Reject Join Request
            .addCase(rejectJoinRequestAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(rejectJoinRequestAction.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(rejectJoinRequestAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể từ chối yêu cầu tham gia nhóm';
            })
            .addCase(leaveGroupAction.fulfilled, (state) => {
                state.loading = false;
                resetGroupState();
            })
            .addCase(setRoleAction.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.role === 'OWNER' && state.currentGroup) {
                    state.currentGroup = {
                        ...state.currentGroup,
                        role: 'MEMBER',
                    };
                }
                state.memberList = state.memberList.map((member) => {
                    if (member.role === 'OWNER' && member.memberId !== action.payload.userId) {
                        return { ...member, role: 'MEMBER' };
                    }
                    if (member.memberId === action.payload.userId) {
                        return { ...member, role: action.payload.role as 'OWNER' | 'ADMIN' | 'MEMBER' };
                    }
                    return member;
                });
                toast.success('Đã thiết lập vai trò thành công');
            })
            .addCase(setRoleAction.rejected, (state, action) => {
                state.loading = false;
                toast.error(action.error.message || 'Không thể thiết lập vai trò');
            });
    },
});

export const {
    resetGroupState,
    updateMemberList,
    updateChatMessage,
    updateUnreadMessages,
    clearUnreadMessages,
    resetSearchGroup,
    updateUserGroups,
    updateJoinRequest,
} = GroupStudySlice.actions;

export default GroupStudySlice.reducer;
