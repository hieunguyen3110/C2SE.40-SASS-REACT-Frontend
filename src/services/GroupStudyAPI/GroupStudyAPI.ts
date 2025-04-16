import { ApiResponse, PagedResponse } from '../../types/response.type';
import { axiosInstance } from '../../utils/AxiosInterceptor';
import { AxiosError } from 'axios';
import {
    Message,
    ChatMessage,
    CreateGroupRequest,
    ShareDocumentRequest,
    SubjectDto,
    SearchGroupResult,
    IGroup,
    MemberResponse,
} from '../../types/groupStudy.types';

// API Functions
export const createGroupApi = async (data: CreateGroupRequest) => {
    try {
        const res = await axiosInstance.post('/study-group/create', data);
        return res as unknown as ApiResponse<IGroup>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const searchSubjectsApi = async (subjectName: string) => {
    try {
        const res = await axiosInstance.get('/study-group/subjects', {
            params: { subjectName }
        });
        return res as unknown as ApiResponse<SubjectDto[]>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const getGroupDetailsApi = async (groupId: number) => {
    try {
        const res = await axiosInstance.get(`/study-group/detail-group/${groupId}`);
        return res as unknown as ApiResponse<IGroup>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const sendMessageApi = async (data: ChatMessage) => {
    try {
        const res = await axiosInstance.post(`/study-group/${data.groupId}/messages`, {
            content: data.content,
            senderId: data.senderId,
        });
        return res as unknown as ApiResponse<Message>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const addMemberApi = async (groupId: number, userId: number) => {
    try {
        const res = await axiosInstance.post(`/study-group/${groupId}/members`, null, {
            params: { userId }
        });
        return res as unknown as ApiResponse<void>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const joinGroupApi = async (groupId: number) => {
    try {
        const res = await axiosInstance.post(`/study-group/${groupId}/join`);
        return res as unknown as ApiResponse<void>;
    } catch (err: unknown) {
        console.log(err)
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const removeMemberApi = async (groupId: number, userId: number) => {
    try {
        const res = await axiosInstance.delete(`/study-group/${groupId}/members/${userId}`);
        return res as unknown as ApiResponse<void>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const pinMessageApi = async (messageId: number) => {
    try {
        const res = await axiosInstance.post(`/study-group/messages/${messageId}/pin`);
        return res as unknown as ApiResponse<void>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const unpinMessageApi = async (messageId: number) => {
    try {
        const res = await axiosInstance.post(`/study-group/messages/${messageId}/unpin`);
        return res as unknown as ApiResponse<void>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const deleteGroupApi = async (groupId: number) => {
    try {
        const res = await axiosInstance.delete(`/study-group/${groupId}`);
        return res as unknown as ApiResponse<void>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const listMembersApi = async (groupId: number, page: number = 0, size: number = 10) => {
    try {
        const res = await axiosInstance.get(`/study-group/${groupId}/members`, {
            params: { page, size },
        });
        return res as unknown as ApiResponse<PagedResponse<MemberResponse>>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const editGroupApi = async (groupId: number, data: CreateGroupRequest) => {
    try {
        const res = await axiosInstance.put(`/study-group/${groupId}`, data);
        // Transform the response to match IGroup interface
        const transformedData = {
            groupId: res.data.id,
            userId: res.data.ownerId, // Assuming userId is the same as ownerId
            message: null,
            isPrivate: res.data.isPrivate,
            groupName: res.data.name,
            description: res.data.description,
            subjectName: '', // This needs to be fetched separately if required
            picture: res.data.picture,
            memberLimited: res.data.memberLimited,
            ownerId: res.data.ownerId,
            createdAt: res.data.createdAt,
            joinRequests: [] // Assuming join requests need to be fetched separately
        };
        return { ...res, data: transformedData } as unknown as ApiResponse<IGroup>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const updatePrivacySettingApi = async (groupId: number, isPrivate: boolean) => {
    try {
        const res = await axiosInstance.put(`/study-group/${groupId}/privacy`, null, {
            params: { isPrivate }
        });
        return res as unknown as ApiResponse<IGroup>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const getPinnedMessagesApi = async (groupId: number, page: number = 0, size: number = 10) => {
    try {
        const res = await axiosInstance.get(`/study-group/${groupId}/pinned-messages`, {
            params: { page, size },
        });
        return res as unknown as ApiResponse<PagedResponse<Message>>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const getGroupMessagesApi = async (groupId: number, page: number = 0, size: number = 10) => {
    try {
        const res = await axiosInstance.get(`/study-group/${groupId}/messages`, {
            params: { page, size },
        });
        return res as unknown as ApiResponse<PagedResponse<Message>>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const shareDocumentApi = async (groupId: number, data: ShareDocumentRequest) => {
    try {
        const res = await axiosInstance.post(`/study-group/${groupId}/documents`, data);
        return res as unknown as ApiResponse<Message>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const findUserGroupsApi = async (userId: number) => {
    try {
        const res = await axiosInstance.get(`/study-group/user/${userId}`);
        return res as unknown as ApiResponse<IGroup[]>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const transferOwnershipApi = async (groupId: number, newOwnerId: number) => {
    try {
        const res = await axiosInstance.post(`/study-group/${groupId}/transfer-ownership`, null, {
            params: { newOwnerId }
        });
        return res as unknown as ApiResponse<void>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const deleteMessageApi = async (messageId: number) => {
    try {
        const res = await axiosInstance.delete(`/study-group/messages/${messageId}`);
        return res as unknown as ApiResponse<void>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const searchGroupApi = async (keyword: string) => {
    try {
        const res = await axiosInstance.get(`/study-group/search-group/search`, {
            params: { keyword }
        });
        return res as unknown as ApiResponse<SearchGroupResult[]>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const getGroupOfUserApi = async () => {
    try {
        const res = await axiosInstance.get('/study-group/groupMembers');
        return res as unknown as ApiResponse<IGroup[]>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const approveJoinRequestApi = async (joinRequestId: number) => {
    try {
        const res = await axiosInstance.post(`/study-group/join-requests/${joinRequestId}/approve`);
        return res as unknown as ApiResponse<void>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const rejectJoinRequestApi = async (joinRequestId: number) => {
    try {
        const res = await axiosInstance.post(`/study-group/join-requests/${joinRequestId}/reject`);
        return res as unknown as ApiResponse<void>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};


