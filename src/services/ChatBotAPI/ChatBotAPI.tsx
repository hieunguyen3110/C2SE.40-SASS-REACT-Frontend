/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatbotResponse } from "../../redux/ChatBotSlice/ChatBotSlice";
import { ApiResponse } from "../../types/response.type";
import { axiosInstance } from "../../utils/AxiosInterceptor";

export interface TrainChatbotRequest {
  fileName: string;
  filePath: string;
}

export const sendMessageService = async (message: string) => {
  try {
    const data = {
      parts: [
        {
          text: message,
        },
      ],
    };
    const res = await axiosInstance.post(`/document/chat-bot/send-message`, data);
    return res as unknown as ApiResponse<ChatbotResponse>;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const trainChatbotService = async (data: TrainChatbotRequest[]) => {
  try {
    
    const res = await axiosInstance.post(`/document/admin/dashboard/train-document`, data);
    return res as unknown as ApiResponse<any>;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
