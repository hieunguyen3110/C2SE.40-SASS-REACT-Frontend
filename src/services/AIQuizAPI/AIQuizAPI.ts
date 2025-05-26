import { ApiResponse } from '../../types/response.type';
import { axiosInstance } from '../../utils/AxiosInterceptor';
import { AxiosError } from 'axios';
import { QuizSessionDTO, Grade, HistoryQuizzes } from '../../types/quiz.types';

// API Functions

export const startQuizApi = async (
    subjectId: number,
    numberOfQuestions: number,
    duration: number,
    sessionId?: string,
    startTime?: string,
    endTime?: string,
    isCompleted?: boolean,
) => {
    try {
        const res = await axiosInstance.post('/e-learning/quiz/start', {
            subjectId,
            numberOfQuestions,
            duration,
            sessionId,
            startTime,
            endTime,
            isCompleted,
        });
        return res as unknown as ApiResponse<QuizSessionDTO>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const startAssignmentApi = async (
    docId: number,
    subjectId: number,
    numberOfQuestions: number,
    duration: number,
) => {
    try {
        const res = await axiosInstance.post('/e-learning/assignment/start', {
            docId,
            subjectId,
            numberOfQuestions,
            duration,
        });
        return res as unknown as ApiResponse<QuizSessionDTO>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const restoreSessionApi = async (isAssignment: boolean) => {
    try {
        const res = await axiosInstance.get(`/e-learning/session/restore?isAssignment=${isAssignment}`);
        return res as unknown as ApiResponse<QuizSessionDTO>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const updateSessionAnswerApi = async (userAnswer: string, isAssignment: boolean, questionIndex: number) => {
    try {
        const res = await axiosInstance.post('/e-learning/session/update-answer', {
            userAnswer,
            isAssignment,
            questionIndex,
        });
        return res as unknown as ApiResponse<QuizSessionDTO>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const submitApi = async (docId: number | undefined, subjectId: number, userAnswers: string[], isAssignment: boolean) => {
    try {
        const res = await axiosInstance.post('/e-learning/submit', {
            docId: docId || undefined,
            subjectId,
            userAnswers,
            isAssignment,
        });
        return res as unknown as ApiResponse<Grade>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};

export const getHistoryApi = async () => {
    try {
        const res = await axiosInstance.get('/e-learning/history');
        return res as unknown as ApiResponse<HistoryQuizzes[]>;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        throw new Error(error.response?.data.message || error.message);
    }
};
