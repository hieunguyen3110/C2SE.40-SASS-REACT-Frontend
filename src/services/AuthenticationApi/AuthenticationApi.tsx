import { ApiResponse } from "../../types/response.type";
import { axiosInstance } from "../../utils/AxiosInterceptor";
import { AxiosError } from "axios";

interface LoginData {
    email: string;
    password: string;
}

export interface ILoginS {
    accountId: number;
    listRoles: string[];
    accessToken: string;
    refreshToken: string;
    username: string;
    follower: number;
    following: number;
    upload: number;
    profilePicture: string;
}
interface IRegister {
    email: string;
    password: string;
    roleName: string;
}

export interface IChangePassWord {
    oldPassword: string;
    newPassword: string;
}
export type SendOtpRequest = {
    email: string;
    otp: string;
};

export type NewPasswordRequest = {
    email: string;
    password: string;
    otp: string;
};

export type ClearTokenRequest = {
    otp: string;
};

export const LoginApi = async (data: LoginData) => {
    try {
        const res = await axiosInstance.post("/identity/auth/login", data);
        return res as unknown as ApiResponse<ILoginS>;
        // return res.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;

        if (error.response?.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(error.message || "Đăng nhập thất bại");
    }
};

export const RegisterApi = async (data: IRegister) => {
    try {
        const res = await axiosInstance.post("/identity/auth/register", data);
        return res as unknown as ApiResponse<IRegister>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;

        throw new Error(error.response?.data.message || error.message);
    }
};
export const LogoutApi = async () => {
    try {
        const res = await axiosInstance.get("/identity/auth/logout");
        return res as unknown as ApiResponse<null>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.message);
    }
};

export const ChangePasswordAPI = async (data: IChangePassWord) => {
    try {
        const res = await axiosInstance.put(
            `/identity/auth/change-password`,
            data
        );
        return res as unknown as ApiResponse<null>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message);
    }
};

export const AutoLoginApi = async () => {
    try {
        const res = await axiosInstance.get("/identity/auth/autoLogin");
        return res as unknown as ApiResponse<ILoginS>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.message);
    }
};

export const SendAuthOtp = async (data: SendOtpRequest) => {
    try {
        const res = await axiosInstance.post(
            "/identity/auth/validate/reset-password",
            data
        );
        return res as unknown as ApiResponse<SendOtpRequest>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.message);
    }
};

export const UpdatePasswordApi = async (data: NewPasswordRequest) => {
    try {
        const res = await axiosInstance.post(
            "/identity/auth/update/new-password",
            data
        );
        return res as unknown as ApiResponse<NewPasswordRequest>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.message);
    }
};

export const ClearTokenApi = async (data: ClearTokenRequest) => {
    try {
        const res = await axiosInstance.post(
            "/identity/auth/delete/clear-token",
            data
        );
        return res as unknown as ApiResponse<ClearTokenRequest>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.message);
    }
};
