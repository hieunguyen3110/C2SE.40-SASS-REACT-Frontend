/* eslint-disable react-refresh/only-export-components */
 
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import {
    DelectDocumentStoge,
    DownloadDocumentAuthorApi,
    GetDocumentStogeAPI,
    GetAllDocuments,
    GetDocumentByFalcuty,
    GetDocumentByFolder,
    GetDocumentByID,
    GetDocumentBySubject,
    GetDocumentByTitle,
    GetDocument,
    GetDocumentSizeAPI,
    SaveDownLoadHistoryApi,
    SaveDocummentStogeAPI,
    GetDocumentStorage,
    GetPopularDocuments,
} from '../../services/DocumentAPI/DocumentAPI';
import { DocumentByAccountRequest, DocumentResponse, DocumentSearchResponse } from './InterfaceResponse';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { ApiResponse } from '../../types/response.type';
import { ratedForDocument, RatingRequest } from '../../services/RatingAPI/RatingAPI';

interface InitialStateStyles {
    Error: string;
    Documents: DocumentResponse[] | undefined;
    DocumentsSearch: DocumentSearchResponse[];
    DocumentDetail: DocumentResponse | undefined;
    loading: boolean;
    isSearching: boolean;
    error: string;
    document: DocumentResponse[];
    informationDocument: GetDocument | null;
    documentStoge: GetDocumentStorage | null;
}

export const getDocumentByIDAction = createAsyncThunk<DocumentResponse, number>(
    'getDocumentByIDAction',
    async (id: number) => {
        try {
            const response = await GetDocumentByID(id);
            return response as unknown as DocumentResponse;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            throw new AxiosError(error.message);
        }
    },
);

export const GetDocumentSizeAction = createAsyncThunk<GetDocument, DocumentByAccountRequest>(
    'GetDocumentSizeAction',
    async (data: DocumentByAccountRequest) => {
        try {
            const response = await GetDocumentSizeAPI(data);

            return response as unknown as GetDocument;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            throw new Error(error.response?.data.message || error.message);
        }
    },
);

export const DownloadDocumentAction = createAsyncThunk<void, { username: string; documentId: number }>(
    'DocumentSlice/DownloadDocumentAuthorAction',
    async ({ documentId, username }) => {
        try {
            const response = await DownloadDocumentAuthorApi(documentId); // Gọi API

            const fileUrl = response.data; // Lấy URL từ phản hồi
            if (fileUrl) {
                const fileResponse = await fetch(fileUrl);
                if (!fileResponse.ok) {
                    throw new Error('Failed to fetch the file from the URL');
                }
                const blob = await fileResponse.blob(); // Chuyển phản hồi thành blob
                const link = document.createElement('a');
                const fileName = fileUrl.split('/').pop() || 'download_file';
                const url = window.URL.createObjectURL(blob); // Tạo object URL từ blob
                link.href = url;
                link.setAttribute('download', fileName); // Đặt thuộc tính download
                document.body.appendChild(link);
                link.click(); // Kích hoạt tải xuống
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url); // Xóa URL tạm thời
                await SaveDownLoadHistoryApi(username, documentId);
            } else {
                throw new Error('File URL is invalid');
            }
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            console.error('Download Error:', err.message);
            toast.error(err.response?.data?.message || 'Download failed');
        }
    },
);

export const SaveDocumentStogeAction = createAsyncThunk<string, number>(
    'SaveDocumentStogeAction',
    async (docId: number) => {
        try {
            const res = await SaveDocummentStogeAPI(docId);
            return res as unknown as string;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            throw new Error(error.response?.data.message || error.message);
        }
    },
);

export const GetDocumentStogeAction = createAsyncThunk<any, { page: number }>(
    'GetDocumentStogeAction',
    async ({ page }) => {
        try {
            const response = await GetDocumentStogeAPI(page);

            return response as unknown as GetDocumentStorage;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            throw new Error(error.response?.data.message || error.message);
        }
    },
);

export const DelectDocumentStogeAction = createAsyncThunk<string, number>(
    'DocumentSlice/DelectDocumentStogeAction',
    async (id: number) => {
        try {
            const response = await DelectDocumentStoge(id);
            return response as unknown as string;
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            throw new Error(error.response?.data.message || error.message);
        }
    },
);

// export const getDocumentByID = createAsyncThunk<DocumentResponse, number>(
//   "documents/getDocumentByID",
//   async (id: number) => {
//     try {
//       const response: any = await GetDocumentByID(id);
//       return response as DocumentResponse;
//     } catch (err: any) {
//       throw Error(err.message);
//     }
//   }
// );

export const getAllDocumentsAction = createAsyncThunk<any, number>(
    'DocumentSlice/getAllDocuments',
    async (size: number) => {
        try {
            const response = await GetAllDocuments(size);
            return response;
        } catch (error: any) {
            throw Error(error.message);
        }
    },
);

// Document Searches
export const getDocumentByTitle = createAsyncThunk<DocumentSearchResponse[], string>(
    'DocumentSlice/getDocumentByTitle',
    async (title: string) => {
        try {
            const response = await GetDocumentByTitle(title);
            return response as unknown as DocumentSearchResponse[];
        } catch (err: any) {
            throw Error(err.message);
        }
    },
);
export const getDocumentBySubject = createAsyncThunk<DocumentResponse, string>(
    'DocumentSlice/getDocumentBySubject',
    async (subject: string) => {
        try {
            const response = await GetDocumentBySubject(subject);
            return response.data as DocumentResponse;
        } catch (err: any) {
            throw Error(err.message);
        }
    },
);
export const getDocumentByFolder = createAsyncThunk<DocumentResponse, string>(
    'DocumentSlice/getDocumentByFolder',
    async (folder: string) => {
        try {
            const response = await GetDocumentByFolder(folder);
            return response.data as DocumentResponse;
        } catch (err: any) {
            throw Error(err.message);
        }
    },
);
export const getDocumentByFalcuty = createAsyncThunk<DocumentResponse, string>(
    'DocumentSlice/getDocumentByFalcuty',
    async (falcuty: string) => {
        try {
            const response = await GetDocumentByFalcuty(falcuty);
            return response.data as DocumentResponse;
        } catch (err: any) {
            throw Error(err.message);
        }
    },
);

export const getPopularDocuments = createAsyncThunk<any>(
    'documents/getPopularDocuments',
    async () => {
        try {
            const response = await GetPopularDocuments();
            return response;
        } catch (err: any) {
            throw Error(err.message);
        }
    },
);

export const rateForDocumentAction = createAsyncThunk<ApiResponse<string>,RatingRequest>(
    'documents/rateForDocument',
    async (data: RatingRequest) => {
        try {
            const response = await ratedForDocument(data);
            return response;
        } catch (err: any) {
            throw Error(err.message);
        }
    },
);


const initialState: InitialStateStyles = {
    loading: false,
    error: '',
    document: [],
    documentStoge: null,
    Error: '',
    Documents: [],
    DocumentDetail: undefined,
    informationDocument: null,
    DocumentsSearch: [],
    isSearching: false,
};

export const DocumentSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        clearDocumentSearch: (state) => {
            state.DocumentsSearch = [];
        },
    },
    extraReducers(builder) {
        builder
            .addCase(getDocumentByIDAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDocumentByIDAction.fulfilled, (state, action) => {
                state.loading = false;
                state.DocumentDetail = action.payload;
            })
            .addCase(getDocumentByIDAction.rejected, (state, action) => {
                state.loading = false;
                state.Error = action.error.message || 'error when i call api get document by id!';
            })
            .addCase(getAllDocumentsAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllDocumentsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.Documents = action.payload;
            })
            .addCase(getAllDocumentsAction.rejected, (state, action) => {
                state.loading = false;
                state.Error = action.error.message || 'error when calling api get all documents';
            })
            .addCase(getDocumentByTitle.pending, (state) => {
                state.isSearching = true;
            })
            .addCase(rateForDocumentAction.pending, (state) => {
                state.loading= true;
            })
            .addCase(rateForDocumentAction.fulfilled, (state) => {
                state.loading= false;
            })
            .addCase(rateForDocumentAction.rejected, (state, action) => {
                state.loading= false;
                state.Error= (action.error && action.error.message)?action.error.message : "Something went wrong!";
                toast.error("Rating is failed!");
            })
            .addCase(getDocumentByTitle.fulfilled, (state, action) => {
                state.isSearching = false;
                state.DocumentsSearch = action.payload;
            })
            .addCase(getDocumentByTitle.rejected, (state, action) => {
                state.isSearching = false;
                state.Error = action.error.message || 'error when calling api get document by title';
            })
            .addCase(getDocumentBySubject.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDocumentBySubject.fulfilled, (state, action) => {
                state.loading = false;
                state.DocumentDetail = action.payload;
            })
            .addCase(getDocumentBySubject.rejected, (state, action) => {
                state.loading = false;
                state.Error = action.error.message || 'error when calling api get document by subject';
            })
            .addCase(getDocumentByFolder.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDocumentByFolder.fulfilled, (state, action) => {
                state.loading = false;
                state.DocumentDetail = action.payload;
            })
            .addCase(getDocumentByFolder.rejected, (state, action) => {
                state.loading = false;
                state.Error = action.error.message || 'error when calling api get document by folder';
            })
            .addCase(getDocumentByFalcuty.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDocumentByFalcuty.fulfilled, (state, action) => {
                state.loading = false;
                state.DocumentDetail = action.payload;
            })
            .addCase(getDocumentByFalcuty.rejected, (state, action) => {
                state.loading = false;
                state.Error = action.error.message || 'error when calling api get document by falcuty';
            })
            .addCase(GetDocumentStogeAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(GetDocumentSizeAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(DownloadDocumentAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(DelectDocumentStogeAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(SaveDocumentStogeAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(GetDocumentStogeAction.fulfilled, (state, action: PayloadAction<GetDocumentStorage>) => {
                state.loading = false;
                state.documentStoge = action.payload;
            })
            .addCase(GetDocumentSizeAction.fulfilled, (state, action) => {
                state.loading = false;
                state.informationDocument = action.payload;
                // state.documentStoge = action.payload;
            })

            .addCase(DownloadDocumentAction.fulfilled, (state) => {
                state.loading = false;
                state.error = '';
            })
            .addCase(DelectDocumentStogeAction.fulfilled, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.success('Xóa tài liệu thanh công');
            })
            .addCase(SaveDocumentStogeAction.fulfilled, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.success('Đã lưu tài liệu thanh công');
            })
            .addCase(SaveDocumentStogeAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Lưu tài liệu thất bại';
            })
            .addCase(GetDocumentStogeAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Get Document Failed';
            })
            .addCase(GetDocumentSizeAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Get Document Failed';
            })
            .addCase(DownloadDocumentAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to download document';
            })
            .addCase(DelectDocumentStogeAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete document';
            })
            .addCase(getPopularDocuments.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPopularDocuments.fulfilled, (state, action) => {
                state.loading = false;
                state.Documents = action.payload;
            })
            .addCase(getPopularDocuments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'error when calling api get all documents';
            });
    },
});

export const { clearDocumentSearch } = DocumentSlice.actions;
export default DocumentSlice.reducer;
