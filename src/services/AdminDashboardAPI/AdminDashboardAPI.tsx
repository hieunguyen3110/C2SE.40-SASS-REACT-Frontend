 
import { axiosInstance } from '../../utils/AxiosInterceptor';

export const GetDocumentsForAdmin = async (page: number, size: number) => {
    try {
        const res = await axiosInstance.get(`/document/admin/dashboard/documents?page=${page}&size=${size}`);
        return res.data;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

export const GetUsersForAdmin = async (page: number, size: number) => {
    try {
        const res = await axiosInstance.get(`/identity/admin/account/users?page=${page}&size=${size}`);
        return res.data;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

export const GetStatsForAdmin = async () => {
    try {
        const res = await axiosInstance.get('/document/admin/dashboard/stats');
        return res.data;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

export const DeleteUsers = async (accountIds: any) => {
    try {
        const res = await axiosInstance.delete('identity/admin/account/delete-users', {
            data: accountIds,
        });
        return res.data;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

export const DeleteDocuments = async (accountIds: any) => {
    try {
        const res = await axiosInstance.delete('/document/admin/dashboard/documents', {
            data: accountIds,
        });
        return res.data;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

export const ApproveUsers = async (accountIds: any) => {
    try {
        const res = await axiosInstance.post('/identity/admin/account/users/approve', accountIds);
        return res.data;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

export const ApproveDocuments = async (documentIds: any) => {
    try {
        const res = await axiosInstance.post('/document/admin/dashboard/documents/approve', documentIds);
        return res.data;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

export const CheckDocument = async (documentId: number) => {
    try {
        const res = await axiosInstance.post('/document/admin/dashboard/check-document?docId=' + documentId);
        return res.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
