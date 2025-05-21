import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    DocumentPersonalDtos,
    GetProfileAPI,
    GetProfileRequest,
    listSearch,
    SearchDocProfilePersonalAPI,
    ViewProfilePersonalByEmailApi,
} from '../../services/ProfilePersonalAPI/ProfilePersonalAPI';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { DocumentByAccountRequest } from '../DocumentSlice/InterfaceResponse';
import { AllDocumentPersonalByEmailAPI } from '../../services/DocumentAPI/DocumentAPI';
import { AnalyticsData, SubjectDto } from '../../types/learningAnalytics.types';
import {
    saveCoursePeriod,
    enableLearningAnalytics,
    disableLearningAnalytics,
    getAnalyze,
} from '../../services/LearningAnalyticsAPI/LearningAnalyticsAPI';

export interface SearchDoc {
    loading: boolean;
    error: string;
    listSearch: listSearch[];
    getUserProfile: GetProfileRequest | null;
    analyzeData: AnalyticsData | null;
}

export const SearchDocPersonalAction = createAsyncThunk<listSearch[], string>(
    'ProfilePersonalSlice/SearchDocProfilePersonal',
    async (name: string) => {
        try {
            const res = await SearchDocProfilePersonalAPI(name);
            return res as unknown as listSearch[];
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            throw new Error(error.response?.data.message || error.message);
        }
    },
);
export const GetProFileAction = createAsyncThunk('ProfilePersonalSlice/GetProFileAction', async () => {
    try {
        const response = GetProfileAPI();
        return response as unknown as GetProfileRequest;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
});

export const ViewProfilePersonalByEmailAction = createAsyncThunk<GetProfileRequest, string>(
    'ProfilePersonalSlice/ViewProfilePersonalByEmailAction',
    async (email: string) => {
        try {
            const res = await ViewProfilePersonalByEmailApi(email);
            return res as unknown as GetProfileRequest;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            throw new Error(error.response?.data.message || error.message);
        }
    },
);

export const GetProFilePageAction = createAsyncThunk<DocumentPersonalDtos[], DocumentByAccountRequest>(
    'documents/GetProFileAction',
    async (data: DocumentByAccountRequest) => {
        try {
            const response = await AllDocumentPersonalByEmailAPI(data);
            return response as unknown as DocumentPersonalDtos[];
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            throw new Error(error.response?.data.message || error.message);
        }
    },
);

export const enableLearningAnalyticsAction = createAsyncThunk<string, void>(
    'ProfilePersonalSlice/enableLearningAnalyticsAction',
    async () => {
        try {
            const res = await enableLearningAnalytics();
            return res.data as unknown as string;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            throw new Error(error.response?.data.message || error.message);
        }
    },
);

export const disableLearningAnalyticsAction = createAsyncThunk<string, void>(
    'ProfilePersonalSlice/disableLearningAnalyticsAction',
    async () => {
        try {
            const res = await disableLearningAnalytics();
            return res.data as unknown as string;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            throw new Error(error.response?.data.message || error.message);
        }
    },
);

export const saveCoursePeriodAction = createAsyncThunk<string, SubjectDto[]>(
    'ProfilePersonalSlice/saveCoursePeriodAction',
    async (subjects: SubjectDto[]) => {
        try {
            const res = await saveCoursePeriod(subjects);
            return res.data as unknown as string;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            throw new Error(error.response?.data.message || error.message);
        }
    },
);

export const getAnalyzeAction = createAsyncThunk<AnalyticsData, void>(
    'ProfilePersonalSlice/getAnalyzeAction',
    async () => {
        const res = await getAnalyze();
        return res.data as unknown as AnalyticsData;
    },
);

const initialState: SearchDoc = {
    loading: false,
    error: '',
    listSearch: [],
    getUserProfile: null,
    analyzeData: null,
};
const ProfilePersonalSlice = createSlice({
    name: 'ProfilePersonalSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(SearchDocPersonalAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(GetProFileAction.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(GetProFilePageAction.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(ViewProfilePersonalByEmailAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(SearchDocPersonalAction.fulfilled, (state, action: PayloadAction<listSearch[]>) => {
                state.loading = false;
                state.listSearch = action.payload;
            })
            .addCase(GetProFilePageAction.fulfilled, (state, action: PayloadAction<DocumentPersonalDtos[]>) => {
                state.loading = false;
                if (state.getUserProfile) {
                    state.getUserProfile.documentDtos = action.payload;
                }
            })
            .addCase(GetProFileAction.fulfilled, (state, action: PayloadAction<GetProfileRequest>) => {
                state.loading = false;
                state.getUserProfile = action.payload;
            })
            .addCase(ViewProfilePersonalByEmailAction.fulfilled, (state, action: PayloadAction<GetProfileRequest>) => {
                state.loading = false;
                state.getUserProfile = action.payload;
            })
            .addCase(SearchDocPersonalAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Search Failed';
            })
            .addCase(GetProFileAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Lấy thông tin user thất bại';
                toast.error(state.error);
            })
            .addCase(GetProFilePageAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Lấy thông tin user thất bại';
                toast.error(state.error);
            })
            .addCase(ViewProfilePersonalByEmailAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to get user';
            })
            .addCase(saveCoursePeriodAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Lỗi khi lưu kỳ học';
            })
            .addCase(getAnalyzeAction.fulfilled, (state, action: PayloadAction<AnalyticsData>) => {
                state.loading = false;
                state.analyzeData = action.payload;
            })
            .addCase(getAnalyzeAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Lỗi khi lấy dữ liệu phân tích';
            });
    },
});

export default ProfilePersonalSlice.reducer;
