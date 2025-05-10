export interface Question {
    id: number;
    text: string;
    options: { id: string; text: string }[];
    selectedAnswer?: string;
} 