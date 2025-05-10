import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './TestResultDetail.module.scss';
import classNames from 'classnames/bind';
import {
    TestResultHeader,
    TestResultScore,
    TestResultAnalysis,
    TestResultQuestions,
    TestResultActions,
} from '../components';
import { useAppSelector } from '../../../../redux/store';

const cx = classNames.bind(styles);

interface GradeQuestion {
    question: {
        question: string;
        correctAnswer: string;
        options: Record<string, string>;
    };
    userAnswer: string;
}

interface Grade {
    id: number;
    subjectId: number;
    score: number;
    totalQuestions: number;
    type: string;
    gradeQuestions: GradeQuestion[];
    originalScore?: number;
}

interface TestResultDetailProps {
    onBack?: () => void;
}

export default function TestResultDetail({ onBack }: TestResultDetailProps) {
    const [resultData, setResultData] = useState<Grade | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();
    
    // Get result from Redux store
    const reduxResult = useAppSelector((state) => state.aiQuiz.result);
    const reduxLoading = useAppSelector((state) => state.aiQuiz.loading);

    // Load result data from Redux
    useEffect(() => {
        try {
            if (reduxResult) {
                // Verify this is the correct result based on ID
                if (reduxResult.id.toString() === id) {
                    // If the score is on a 0-100 scale, normalize it
                    if (reduxResult.score > 10) {
                        const normalizedResult = {
                            ...reduxResult,
                            originalScore: reduxResult.score, // Store original score
                            score: parseFloat((reduxResult.score / 10).toFixed(1)), // Convert to 0-10 scale
                        };
                        setResultData(normalizedResult);
                    } else {
                        setResultData(reduxResult);
                    }
                } else {
                    setError('Result ID mismatch. Please try again.');
                }
            } else {
                setError('No result data found in Redux store. Please try again.');
            }
        } catch (error) {
            console.error('Error loading result data from Redux:', error);
            setError('Error loading result data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [id, reduxResult]);

    // Animation variants
    const pageVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5, when: 'beforeChildren', staggerChildren: 0.2 },
        },
    };

    // Loading state
    if (loading || reduxLoading) {
        return (
            <div className={cx('loading-container')}>
                <div className={cx('loading-spinner')}></div>
                <p>Loading test results...</p>
            </div>
        );
    }

    // Error state
    if (error || !resultData) {
        return (
            <div className={cx('error-container')}>
                <div className={cx('error-icon')}>❌</div>
                <h2>Error Loading Results</h2>
                <p>{error || 'Unknown error occurred. Please try again.'}</p>
                <button onClick={onBack} className={cx('error-button')}>
                    Go Back
                </button>
            </div>
        );
    }

    // Calculate correct answers
    const correctAnswers = resultData.gradeQuestions.filter((q) => q.userAnswer === q.question.correctAnswer).length;

    return (
        <motion.div className={cx('test-result-detail')} initial="hidden" animate="visible" variants={pageVariants}>
            <TestResultHeader subjectName={`Subject ID: ${resultData.subjectId}`} />

            <TestResultScore
                score={resultData.score}
                totalQuestions={resultData.totalQuestions}
                originalScore={resultData.originalScore}
            />

            <TestResultAnalysis correctAnswers={correctAnswers} totalQuestions={resultData.totalQuestions} />

            <TestResultQuestions
                questions={resultData.gradeQuestions.map((q) => ({
                    question: q.question.question,
                    correctAnswer: q.question.correctAnswer,
                    options: q.question.options,
                    userAnswer: q.userAnswer,
                }))}
            />

            <TestResultActions onBack={onBack} />
        </motion.div>
    );
}
