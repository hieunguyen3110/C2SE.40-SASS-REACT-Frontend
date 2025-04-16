import { ApiResponse } from "../../types/response.type";
import { axiosInstance } from "../../utils/AxiosInterceptor";

export type RatingRequest= {
    docId: number;
    rating: number;
}

export const ratedForDocument= async (data: RatingRequest) =>{
    try{
        const res= await axiosInstance.post("/document/ratings/rate",data);
        return res as unknown as ApiResponse<string>;
    }catch(error: any){
        throw new Error(error.message);
    }
}