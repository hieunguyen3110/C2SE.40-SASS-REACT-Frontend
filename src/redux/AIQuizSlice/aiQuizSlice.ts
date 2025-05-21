import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import {
    startQuizApi,
    startAssignmentApi,
    restoreSessionApi,
    updateSessionAnswerApi,
    submitApi,
    getHistoryApi,
} from '../../services/AIQuizAPI/AIQuizAPI';
import { QuizSessionDTO, Grade, HistoryQuizzes } from '../../types/quiz.types';

// Async Actions
export const startQuizAction = createAsyncThunk<
    QuizSessionDTO,
    {
        subjectId: number;
        numberOfQuestions: number;
        duration: number;
        sessionId?: string;
        startTime?: string;
        endTime?: string;
        isCompleted?: boolean;
    }
>(
    'aiQuiz/startQuiz',
    async ({ subjectId, numberOfQuestions, duration, sessionId, startTime, endTime, isCompleted }) => {
        try {
            const response = await startQuizApi(subjectId, numberOfQuestions, duration);
            return {
                ...response.data,
                sessionId,
                startTime,
                endTime,
                isCompleted,
            };
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            throw Error(error.message);
        }
    },
);

export const startAssignmentAction = createAsyncThunk<
    QuizSessionDTO,
    {
        docId: number;
        subjectId: number;
        numberOfQuestions: number;
        duration: number;
        sessionId?: string;
        startTime?: string;
        endTime?: string;
        isCompleted?: boolean;
    }
>(
    'aiQuiz/startAssignment',
    async ({ docId, subjectId, numberOfQuestions, duration, sessionId, startTime, endTime, isCompleted }) => {
        try {
            const response = await startAssignmentApi(docId, subjectId, numberOfQuestions, duration);
            return {
                ...response.data,
                sessionId,
                startTime,
                endTime,
                isCompleted,
            };
        } catch (err: unknown) {
            const error = err as AxiosError<{ message?: string }>;
            throw Error(error.message);
        }
    },
);

export const restoreSessionAction = createAsyncThunk<
    QuizSessionDTO,
    {
        isAssignment: boolean;
        sessionId?: string;
        startTime?: string;
        endTime?: string;
        isCompleted?: boolean;
    }
>('aiQuiz/restoreSession', async ({ isAssignment, sessionId, startTime, endTime, isCompleted }) => {
    try {
        const response = await restoreSessionApi(isAssignment);
        return {
            ...response.data,
            sessionId,
            startTime,
            endTime,
            isCompleted,
        };
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw Error(error.message);
    }
});

export const updateSessionAnswerAction = createAsyncThunk<
    QuizSessionDTO,
    { userAnswer: string; isAssignment: boolean; questionIndex: number }
>('aiQuiz/updateSessionAnswer', async ({ userAnswer, isAssignment, questionIndex }) => {
    try {
        const response = await updateSessionAnswerApi(userAnswer, isAssignment, questionIndex);
        return response.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw Error(error.message);
    }
});

export const submitAction = createAsyncThunk<
    Grade,
    { subjectId: number; userAnswers: string[]; isAssignment: boolean }
>('aiQuiz/submit', async ({ subjectId, userAnswers, isAssignment }) => {
    try {
        const response = await submitApi(subjectId, userAnswers, isAssignment);
        return response.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw Error(error.message);
    }
});

export const getHistoryAction = createAsyncThunk<HistoryQuizzes[], void>('aiQuiz/getHistory', async () => {
    try {
        const response = await getHistoryApi();
        return response.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw Error(error.message);
    }
});

// Initial State
interface AIQuizState {
    loading: boolean;
    error: string;
    currentSession: QuizSessionDTO | null;
    quizHistory: HistoryQuizzes[];
    result: Grade | null;
    isAssignment: boolean;
}

const initialState: AIQuizState = {
    loading: false,
    error: '',
    currentSession: null,
    quizHistory: [],
    result: null,
    isAssignment: false,
};

// Slice
const AIQuizSlice = createSlice({
    name: 'aiQuiz',
    initialState,
    reducers: {
        resetQuizState: (state) => {
            state.currentSession = null;
            state.result = null;
        },
        setIsAssignment: (state, action: PayloadAction<boolean>) => {
            state.isAssignment = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Start Quiz
            .addCase(startQuizAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(startQuizAction.fulfilled, (state, action) => {
                state.loading = false;
                state.currentSession = action.payload;
                state.isAssignment = false;
                state.result = null;
            })
            .addCase(startQuizAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể bắt đầu bài kiểm tra';
            })

            // Start Assignment
            .addCase(startAssignmentAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(startAssignmentAction.fulfilled, (state, action) => {
                state.loading = false;
                state.currentSession = action.payload;
                state.isAssignment = true;
                state.result = null;
            })
            .addCase(startAssignmentAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể bắt đầu bài tập';
            })

            // Restore Session
            .addCase(restoreSessionAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(restoreSessionAction.fulfilled, (state, action) => {
                state.loading = false;
                state.currentSession = action.payload;
                state.isAssignment = false;
                state.result = null;
            })
            .addCase(restoreSessionAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể khôi phục phiên làm bài';
            })

            // Update Session Answer
            .addCase(updateSessionAnswerAction.pending, () => {})
            .addCase(updateSessionAnswerAction.fulfilled, (state, action) => {
                state.loading = false;
                state.currentSession = action.payload;
            })
            .addCase(updateSessionAnswerAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể cập nhật câu trả lời';
            })

            // Submit
            .addCase(submitAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(submitAction.fulfilled, (state, action) => {
                state.loading = false;
                state.result = action.payload;
                state.currentSession = null;
            })
            .addCase(submitAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể nộp bài';
            })

            // Get History
            .addCase(getHistoryAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(getHistoryAction.fulfilled, (state, action) => {
                state.loading = false;
                state.quizHistory = action.payload;
            })
            .addCase(getHistoryAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể lấy lịch sử làm bài';
            });
    },
});

export const { resetQuizState, setIsAssignment } = AIQuizSlice.actions;

export default AIQuizSlice.reducer;
