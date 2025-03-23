/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance, baseUrl } from "../../utils/AxiosInterceptor";

export const GetAllFolders = async () => {
    try {
        const res = await axiosInstance.get(`${baseUrl}/document/folder/all`);
        return res.data;
    } catch (error: any) {
        throw Error(error.message);
    }
};

export const CreateFolder = async (folderName: string, description: string) => {
    try {
        const res = await axiosInstance.post(`${baseUrl}/document/folder/create`, {
            folderName,
            description,
        });
        return res.data;
    } catch (error: any) {
        throw Error(error.message);
    }
};

export const GetFolderById = async (id: number) => {
    try {
        const res = await axiosInstance.get(`${baseUrl}/document/folder/${id}?`);
        return res.data;
    } catch (error: any) {
        throw Error(error.message);
    }
};

export const UpdateFolder = async (
    folderId: number,
    folderName: string,
    description: string
) => {
    try {
        const res = await axiosInstance.put(
            `${baseUrl}/document/folder/update/${folderId}`,
            {
                folderName,
                description,
            }
        );
        return res.data;
    } catch (error: any) {
        throw Error(error.message);
    }
};

export const DeleteFolder = async (folderId: number) => {
    try {
        const res = await axiosInstance.delete(
            `${baseUrl}/document/folder/delete/${folderId}`
        );
        return res.data;
    } catch (error: any) {
        throw Error(error.message);
    }
};

export const GetPopularFolders = async (page: number, size: number) => {
    try {
        const res = await axiosInstance.get(
            `/document/folder/top-folders?page=${page}&size=${size}`
        );
        return res.data;
    } catch (err: any) {
        throw Error(err.message);
    }
};
