import { ApiResponse } from '../../types/response.type';
import { axiosInstance } from '../../utils/AxiosInterceptor';

export type ViewTimeRequest= {
    docId: number;
    startTime: Date;
    duration: number;
}

export const trackingViewTimeDocumentDetail= async (data : ViewTimeRequest)=>{
    try{
        const res = await axiosInstance.post("/document/save-duration",data);
        return res as unknown as ApiResponse<string> 
    }catch(error: any){
        throw new Error(error.message);
    }
}