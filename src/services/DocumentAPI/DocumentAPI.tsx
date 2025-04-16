 

import { AxiosError } from 'axios';
import { axiosInstance } from '../../utils/AxiosInterceptor';
import { DocumentByAccountRequest } from '../../redux/DocumentSlice/InterfaceResponse';
import { DocumentDtos } from '../../redux/ProfileAuthorSlice/ProfileAuthorSlice';
import { toast } from 'react-toastify';
import { GetProfileRequest } from '../ProfilePersonalAPI/ProfilePersonalAPI';
import { ApiResponse } from '../../types/response.type';

// export interface DocumentStorage {
//   saveId: number;
//   title: string;
// }

export interface GetDocument {
    docId: number;
    title: string;
    description: string;
    type: string;
    subjectName: string;
    facultyName: string;
}
export interface GetDocumentStorage {
    first: boolean;
    totalPages: number;
    content: [];
}

// export interface GetEditDocument {
//   docId: number;
//   title: string;
//   description: string;
//   type: string;
//   subjectName: string;
//   facultyName: string;
// }

export const GetDocumentByID = async (id: number) => {
    try {
        const res = await axiosInstance.get(`/document/${id}`);
        return res.data;
    } catch (error: any) {
        if (error) {
            throw new Error(error.message);
        }
    }
    // try {
    //   const res = await axiosInstance.get(`/document/document/${id}`);
    //   return res.data;
    // } catch (error: any) {
    //   if (error) {
    //     throw new Error(error.message);
    //   }
    // }
};

// export const GetAllDocuments = async () => {
//   try {
//     const res = await axiosInstance.get("/document/document/all");
//     return res.data;
//   } catch (error: any) {
//     throw new Error(error.message);
//   }
export const GetAllDocuments = async (size: number) => {
    try {
        const res: any = await axiosInstance.get('/document/document/all' + '?size=' + size);
        return res.data.content;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const GetDocumentByTitle = async (title: string) => {
    try {
        const res = await axiosInstance.get(`/document/search/title?title=${title}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const GetDocumentBySubject = async (subject: string) => {
    try {
        const res = await axiosInstance.get(`/document/search/${subject}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const GetDocumentByFolder = async (folder: string) => {
    try {
        const res = await axiosInstance.get(`/document/search/${folder}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const FindAllDocumentByEmailAPI = async (data: DocumentByAccountRequest) => {
    try {
        const res = await axiosInstance.get(
            `/document/document/account?email=${data.email}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
        );
        return res.data as unknown as DocumentDtos[];
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const AllDocumentPersonalByEmailAPI = async (data: DocumentByAccountRequest) => {
    try {
        const res = await axiosInstance.get(
            `/document/document/account?email=${data.email}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
        );
        return res.data as unknown as GetProfileRequest;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// export const GetDocumentByFalcuty = async (falcuty: string) => {
//     try {
//         const res = await axiosInstance.get(baseUrl + `/search/${falcuty}`);
//         return res.data;
//     } catch (error: any) {
//         throw new Error(error.message);
//     }
// };

export const GetDocumentByFalcuty = async (falcuty: string) => {
    try {
        const res = await axiosInstance.get(`/document/search/${falcuty}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// export const GetDocumentStogeAPI = async (
//   size: number = 3,
//   page: number = 3
// ) => {
//   try {
//     const response = await axiosInstance.get<any>(`document/all`, {
//       params: { page, size },
//     });
//     return res.dataponse;
//   } catch (err: unknown) {
//     const error = err as AxiosError<{ message?: string }>;
//     throw new Error(error.response?.data.message || error.message);
//   }
// };

export const GetDocumentSizeAPI = async (data: DocumentByAccountRequest) => {
    try {
        const res = await axiosInstance.get(
            `/document/account?email=${data.email}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
        );
        return res.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const DownloadDocumentAuthorApi = async (documentId: number) => {
    try {
        const response = await axiosInstance.get(`/document/download/${documentId}`);
        return response as unknown as ApiResponse<string>; // Trả về toàn bộ response
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data?.message || error.message);
    }
};

export const SaveDownLoadHistoryApi = async (username: string, docId: number) => {
    try {
        const res = await axiosInstance.post(
            `/document/history/track`,
            null, // Body là `null` vì dữ liệu được truyền qua query string
            {
                params: {
                    docId,
                    username,
                },
            },
        );
        return res.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const SaveDocummentStogeAPI = async (docId: number) => {
    try {
        const res = await axiosInstance.post(`/document/saved-documents/save`, null, {
            params: { docId },
        });

        return res.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        if (error.status === 502 || error.response?.data.message === 'Error saving document: Document already saved.') {
            toast.error('Tài liệu đã tồn tại trong kho lưu trữ!');
        }
        throw new Error(error.response?.data.message || error.message);
    }
};

export const GetDocumentStogeAPI = async (page: number = 0, size: number = 5) => {
    try {
        const response = await axiosInstance.get(`/document/saved-documents/list`, {
            params: { page, size },
        });
        return response.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};
export const DelectDocumentStoge = async (docId: number) => {
    try {
        const res = await axiosInstance.delete(`/document/saved-documents/delete`, {
            params: { docId },
        });
        return res.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const GetPopularDocuments = async () => {
    try {
        const res = await axiosInstance.get(`/document/popular`);
        return res.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};
