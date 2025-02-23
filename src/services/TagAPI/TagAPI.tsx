/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "../../utils/AxiosInterceptor";

export const CreateTag = async (tagName: string) => {
    try {
        const res = await axiosInstance.post(`/tags/create`, tagName);
        return res.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const UpdateTag = async (tagData: {
    tagName: string;
    tagId: number;
}) => {
    try {
        const res = await axiosInstance.put(
            `/tags/update/${tagData.tagId}`,
            tagData
        );
        return res.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const DeleteTag = async (tagId: number) => {
    try {
        const res = await axiosInstance.delete(
            `/tags/delete/${tagId}`
        );
        return res.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
