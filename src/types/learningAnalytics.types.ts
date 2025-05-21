export interface SubjectDto {
    subjectId: number;
    subjectName: string;
}

export interface CoursePeriodDto {
    coursePeriodId: number;
    subjects: {
        [key: string]: string;
    };
}

export interface AnalyticsData {
    general_assessment: {
        overall_status: string;
        risk_assessment: string;
        strengths: string[];
        weaknesses: string[];
    };
    improvement_suggestions: {
        focus_area: string;
        specific_action: string;
        expected_outcome: string;
    }[];
    progress_tracking: {
        metrics_to_monitor: string[];
        adjustment_strategies: string[];
    };
    weekly_study_plan: {
        short_term_goals: string[];
        long_term_goals: string[];
        daily_schedule: {
            [day: string]: {
                study_hours: string;
                focus_subjects: string[];
                recommended_activities: string[];
            };
        };
    };
    subject_weakens: {
        subject_id: number;
        subject_name: string;
        assigment_grades: any[];
        avg_score: number;
    }[];
    document_recommend: {
        docId: number;
        fileName: string | null;
        description: string;
        filePath: string;
        subjectCode: string;
        subjectId: number;
        subjectName: string;
    }[];
    document_read_again: any[];
}
