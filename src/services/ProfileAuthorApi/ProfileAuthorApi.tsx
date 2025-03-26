import { AxiosError } from "axios"
import { axiosInstance } from "../../utils/AxiosInterceptor"
import { IViewProfile } from "../../redux/ProfileAuthorSlice/ProfileAuthorSlice"



export const FollowAuthorApi=async(email:string)=>{
  try {
    const response = await axiosInstance.post(`/document/follow/follow-by-email?email=${email}`,null)
    return response.data
  } catch (err:unknown) {
    const error= err as AxiosError<{message?:string}>
    throw new Error(error.response?.data.message || error.message)
    
  }
}

export const UnFollowAuthorApi=async(email:string)=>{
  try {
    const response = await axiosInstance.delete(`/document/follow/unfollow-by-email?email=${email}`)
    return response.data
  } catch (err:unknown) {
    const error= err as AxiosError<{message?:string}>
    throw new Error(error.response?.data.message || error.message)
    
  }
}

export const ViewProfileAuthorApi=async()=>{
  try {
    const response = await axiosInstance.get(`/document/account/profile`)
    return response.data
  } catch (err:unknown) {
    const error= err as AxiosError<{message?:string}>
    throw new Error(error.response?.data.message || error.message)
    
  }
}

export const ViewProfileAuthorByEmailApi=async(email:string)=>{
  try {
    const response = await axiosInstance.get(`/document/account/profile/email?email=${email}`)
    return response.data as unknown as IViewProfile
  } catch (err:unknown) {
    const error= err as AxiosError<{message?:string}>
    throw new Error(error.response?.data.message || error.message)
    
  }
}