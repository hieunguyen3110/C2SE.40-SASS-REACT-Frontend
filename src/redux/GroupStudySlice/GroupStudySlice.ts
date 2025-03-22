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
} from '../../services/GroupStudyAPI/GroupStudyAPI';
import {
    StudyGroup,
    Message,
    ChatMessage,
    GroupResponse,
    CreateGroupRequest,
    ShareDocumentRequest
} from '../../types/groupStudy.types';

// Async Actions
export const createGroupAction = createAsyncThunk<StudyGroup, CreateGroupRequest>(
    'groupStudy/createGroup',
    async (data) => {
        try {
            const response = await createGroupApi(data);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.message);
            throw Error(error.message);
        }
    },
);

export const getGroupDetailsAction = createAsyncThunk<StudyGroup, number>(
    'groupStudy/getGroupDetails',
    async (groupId) => {
        try {
            const response = await getGroupDetailsApi(groupId);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.message);
            throw Error(error.message);
        }
    },
);

export const removeMemberAction = createAsyncThunk<void, { groupId: number; userId: number }>(
    'groupStudy/removeMember',
    async ({ groupId, userId }) => {
        try {
            await removeMemberApi(groupId, userId);
            toast.success('Đã xóa thành viên thành công');
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.message);
            throw Error(error.message);
        }
    },
);

export const listMembersAction = createAsyncThunk<GroupResponse[], { groupId: number; page: number; size: number }>(
    'groupStudy/listMembers',
    async ({ groupId, page, size }) => {
        try {
            const response = await listMembersApi(groupId, page, size);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.message);
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
        toast.error(error.message);
        throw Error(error.message);
    }
});

export const editGroupAction = createAsyncThunk<StudyGroup, { groupId: number; data: CreateGroupRequest }>(
    'groupStudy/editGroup',
    async ({ groupId, data }) => {
        try {
            const response = await editGroupApi(groupId, data);
            toast.success('Đã cập nhật nhóm thành công');
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.message);
            throw Error(error.message);
        }
    },
);

export const pinMessageAction = createAsyncThunk<Message[], { messageId: number }>(
    'groupStudy/pinMessage',
    async ({ messageId }) => {
        try {
            const response = await pinMessageApi(messageId);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.message);
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
            toast.error(error.message);
            throw Error(error.message);
        }
    },
);

export const getPinnedMessagesAction = createAsyncThunk<Message[], { groupId: number; page: number; size: number }>(
    'groupStudy/getPinnedMessages',
    async ({ groupId, page, size }) => {
        try {
            const response = await getPinnedMessagesApi(groupId, page, size);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.message);
            throw Error(error.message);
        }
    },
);

export const sendMessageAction = createAsyncThunk<Message, { data: ChatMessage }>(
    'groupStudy/sendMessage',
    async ({ data }) => {
        try {
            const response = await sendMessageApi(data);
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.message);
            throw Error(error.message);
        }
    },
);

// Initial State
interface GroupStudyState {
    loading: boolean;
    error: string;
    currentGroup: StudyGroup | null;
    memberList: GroupResponse[];
    pinnedMessages: Message[];
    totalMembers: number;
    totalPinnedMessages: number;
}

const initialState: GroupStudyState = {
    loading: false,
    error: '',
    currentGroup: null,
    memberList: [],
    pinnedMessages: [],
    totalMembers: 0,
    totalPinnedMessages: 0,
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
        },
        updateMemberList: (state, action: PayloadAction<GroupResponse[]>) => {
            state.memberList = action.payload;
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

            // Remove Member
            .addCase(removeMemberAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeMemberAction.fulfilled, (state) => {
                state.loading = false;
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
                state.currentGroup = action.payload;
            })
            .addCase(editGroupAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể chỉnh sửa nhóm';
            })

            // Pin Message
            .addCase(pinMessageAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(pinMessageAction.fulfilled, (state, action) => {
                state.loading = false;
                state.pinnedMessages = action.payload;
            })
            .addCase(pinMessageAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể ghim tin nhắn';
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
            });
    },
});

export const { resetGroupState, updateMemberList } = GroupStudySlice.actions;

export default GroupStudySlice.reducer;
