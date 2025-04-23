export interface IGroup {
    groupId: number;
    userId: number;
    message: string | null;
    isPrivate: boolean | null;
    groupName: string;
    description: string;
    subjectName: string;
    picture: string | null;
    memberLimited: number;
    ownerId: number;
    createdAt: string;
    joinRequests: JoinRequest[];
}

export interface SearchGroupResult {
    groupId: number;
    groupName: string;
    description: string;
    subjectName: string;
    memberCount: number;
    picture: string | null;
    memberIds: number[];
    memberLimited: number;
}

export interface Message {
    senderId: number;
    groupId: number;
    content: string;
    timestamp: string | null;
    username: string;
    profilePicture: string | null;
    messageId: number;
    createdAt: string;
}

export interface ChatMessage {
    groupId: number;
    senderId: number;
    content: string;
}

export interface MemberResponse {
    memberId: number;
    name: string;
    email: string;
}

export interface GroupResponse {
    id: number;
    name: string;
    avatar?: string;
    joinDate: string;
    role: 'Admin' | 'Member';
}

export interface CreateGroupRequest {
    groupName: string;
    memberIds: number[];
    description?: string;
    isPrivate: boolean;
    subjectId?: number;
    memberLimited?: number;
}

export interface ShareDocumentRequest {
    userId: number;
    documentId: string;
    shareUrl: string;
}

export interface SubjectDto {
    subjectId: number;
    subjectName: string;
}


export interface JoinRequest {
    id: number;
    userId: number;
    status: string;
    avatar: string | null;
    name: string;
    email: string;
    createdAt: string;
}