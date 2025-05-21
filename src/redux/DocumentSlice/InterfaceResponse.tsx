export interface DocumentResponse {
    docId: number;
    title: string;
    folderName: string;
    subjectId: number;
    subjectName: string;
    facultyName: string;
    createdAt: string;
    authorName: string;
    filePath: string;
    fileSize: number;
    profilePicture: string | null;
    accountRatingDtos: AccountRatingDto[];

    // Các trường có thể vẫn cần trong ứng dụng nhưng không có trong response mới
    // Đánh dấu là optional
    description?: string;
    content?: string;
    type?: string;
    account_id?: number;
    updated_at?: string;
    folder_id?: number;
}

export interface DocumentSearchResponse {
    docId: number;
    title: string;
    description: string;
    content: string;
    type: string;
    subjectName: string;
    facultyName: string;
}

export interface DocumentByAccountRequest {
    email: string;
    pageSize: number;
    pageNum: number;
}

export interface AccountRatingDto {
    accountId: number;
    rating: number;
}
