export interface DocumentResponse {
    doc_id: number;
    title: string;
    description: string;
    content: string;
    type: string;
    account_id: number;
    file_path: string;
    file_size: number;
    created_at: string;
    updated_at: string;
    folder_id: number;
    folderName?: string | null;
    subjectName?: string;
    facultyName?: string;
    authorName?: string;
    filePath?: string;
    profilePicture?: string | null;
    accountRatingDtos?: AccountRatingDto[];
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
