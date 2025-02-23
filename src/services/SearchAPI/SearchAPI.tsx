/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance, baseUrl } from "../../utils/AxiosInterceptor";

export const SearchDocumentByTitle = async (title: string) => {
    try {
        const res = await axiosInstance.get(
            baseUrl + `/search/title?title=${title}`
        );
        return res.data;
    } catch (error: any) {
        if (error) {
            throw new Error(error.message);
        }
    }
};

export const SearchDocumentBySubject = async (subject: string) => {
    try {
        const res = await axiosInstance.get(
            baseUrl + `/search/subject?subject=${subject}`
        );
        return res.data;
    } catch (error: any) {
        if (error) {
            throw new Error(error.message);
        }
    }
};

export const SearchDocumentByFolder = async (folderName: string) => {
    try {
        const res = await axiosInstance.get(
            baseUrl + `/search/folder?folderName=${folderName}`
        );
        return res.data;
    } catch (error: any) {
        if (error) {
            throw new Error(error.message);
        }
    }
};

export const SearchDocumentByFaculty = async (faculty: string) => {
    try {
        const res = await axiosInstance.get(
            baseUrl + `/search/faculty?facultyName=${faculty}`
        );
        return res.data;
    } catch (error: any) {
        if (error) {
            throw new Error(error.message);
        }
    }
};
