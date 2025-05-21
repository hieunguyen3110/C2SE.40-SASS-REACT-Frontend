import { SubjectDto } from '../../types/learningAnalytics.types';
import { ApiResponse } from '../../types/response.type';
import { axiosInstance } from '../../utils/AxiosInterceptor';

export const enableLearningAnalytics = async () => {
    try {
        const res = await axiosInstance.get('/identity/account/enable-analyze-data');
        return res as unknown as ApiResponse<string>;
    } catch (error) {
        throw error;
    }
};

export const disableLearningAnalytics = async () => {
    try {
        const res = await axiosInstance.get('/identity/account/disable-analyze-data');
        return res as unknown as ApiResponse<string>;
    } catch (error) {
        throw error;
    }
};

export const saveCoursePeriod = async (subjects: SubjectDto[]) => {
    try {
        const res = await axiosInstance.post('/identity/account/save-course-period', subjects);
        return res as unknown as ApiResponse<string>;
    } catch (error) {
        throw error;
    }
};
