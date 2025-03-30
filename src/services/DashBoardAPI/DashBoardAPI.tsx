import { AxiosError } from 'axios';
import { axiosInstance } from '../../utils/AxiosInterceptor';

export interface GetProfileRequest {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string | null;
    birthDate: string;
    gender: string;
    hometown: string;
    phoneNumber: string;
    facultyName: number;
    major: string;
    enrollmentYear: number;
    classNumber: string;
    follower: string;
    following: string;
    roles: string | null;
}

export const GetProfileDashBoardAPI = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/identity/admin/account/users/${id}`);
        return response.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const DelectProfilePictureAPI = async (useId: number) => {
    try {
        const response = await axiosInstance.delete(
            `/identity/admin/account/delete-profile-picture?accountId=${useId}`,
        );
        return response.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};
