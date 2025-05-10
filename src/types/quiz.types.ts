import { SubjectDto } from './groupStudy.types';

export interface QuestionDTO {
    question: string;
    correctAnswer: string;
    options: Record<string, string>; // Cụ thể hơn: map từ "A", "B", "C", "D" đến nội dung tương ứng
}

export interface Question {
    id: number;
    content: string;
    options: string[];
    index: number;
}

export interface QuizSessionDTO {
    accountId: number;
    subjectId: number;
    questions: QuestionDTO[];
    userAnswers: string[];
    assignment: boolean;

    sessionId?: string;
    startTime?: string;
    endTime?: string;
    subject?: SubjectDto;
    isCompleted?: boolean;
}

export interface HistoryQuizzes {
    id: number;
    subjectId: number;
    subjectName: string;
    createdAt: string;
    score: number;
    totalQuestions: number;
    type: string;
    gradeQuestions: GradeQuestion[];
}

export interface GradeQuestion {
    question: {
        question: string;
        correctAnswer: string;
        options: Record<string, string>;
    };
    userAnswer: string;
}

export interface Grade {
    id: number;
    subjectId: number;
    score: number;
    totalQuestions: number;
    type: string;
    gradeQuestions: any | null;
}
