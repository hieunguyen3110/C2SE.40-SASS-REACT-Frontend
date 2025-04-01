import { ApiResponse } from '../../types/response.type';
import { axiosInstance } from '../../utils/AxiosInterceptor';
import { AxiosError } from 'axios';
import {
    StudyGroup,
    Message,
    ChatMessage,
    GroupResponse,
    CreateGroupRequest,
    ShareDocumentRequest,
} from '../../types/groupStudy.types';

// API Functions
export const createGroupApi = async (data: CreateGroupRequest) => {
    try {
        const res = await axiosInstance.post('/study-group', data);
        return res as unknown as ApiResponse<StudyGroup>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const getGroupDetailsApi = async (groupId: number) => {
    try {
        const res = await axiosInstance.get(`/study-group/${groupId}`);
        return res as unknown as ApiResponse<StudyGroup>;
    } catch (err: unknown) {
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
        return res as unknown as ApiResponse<Message[]>;
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
        return res as unknown as ApiResponse<GroupResponse[]>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const editGroupApi = async (groupId: number, data: CreateGroupRequest) => {
    try {
        const res = await axiosInstance.put(`/study-group/${groupId}`, data);
        return res as unknown as ApiResponse<StudyGroup>;
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
        return res as unknown as ApiResponse<Message[]>;
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
