export interface StudyGroup {
    id: number;
    groupName: string;
    isPrivate: boolean;
    // Add other properties as needed
}

export interface Message {
    id: number;
    content: string;
    // Add other properties as needed
}

export interface ChatMessage {
    groupId: number;
    senderId: number;
    content: string;
}

export interface GroupResponse {
    // Add member properties
}

export interface CreateGroupRequest {
    groupName: string;
    memberIds: number[];
    description?: string;
    isPrivate: boolean;
}

export interface ShareDocumentRequest {
    userId: number;
    documentId: string;
    shareUrl: string;
}
