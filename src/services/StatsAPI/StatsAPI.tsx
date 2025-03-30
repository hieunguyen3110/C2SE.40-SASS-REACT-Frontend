 
import { axiosInstance } from '../../utils/AxiosInterceptor';

export const GetStatsForUser = async () => {
    try {
        const res = await axiosInstance.get(`/document/user/stats`);
        return res.data;
    } catch (error: any) {
        throw Error(error.message);
    }
};
