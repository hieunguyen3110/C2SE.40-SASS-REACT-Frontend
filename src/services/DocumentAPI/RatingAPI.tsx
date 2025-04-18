import { ApiResponse } from '../../types/response.type';
import { axiosInstance } from '../../utils/AxiosInterceptor';
import { AxiosError } from 'axios';

interface RatingRequest {
    docId: number;
    rating: number;
}

export const rateDocumentApi = async (documentId: number, rating: number) => {
    try {
        const res = await axiosInstance.post('/document/ratings/rate', { docId: documentId, rating });
        return res as unknown as ApiResponse<string>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};


