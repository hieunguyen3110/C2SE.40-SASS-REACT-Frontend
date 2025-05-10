import { motion } from 'framer-motion';
import { CheckCircle, Cancel } from '@mui/icons-material';
import styles from '../view/TestResultDetail.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface QuestionReview {
    question: string;
    correctAnswer: string;
    options: Record<string, string>;
    userAnswer: string;
}

interface TestResultQuestionsProps {
    questions: QuestionReview[];
}

export default function TestResultQuestions({ questions }: TestResultQuestionsProps) {
    const questionVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: 'spring', stiffness: 100 },
        },
    };

    return (
        <motion.div 
            className={cx('question-review-section')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <h2 className={cx('section-title')}>Question Review</h2>
            <div className={cx('questions-list')}>
                {questions.map((q, index) => {
                    const isCorrect = q.userAnswer === q.correctAnswer;
                    return (
                        <motion.div
                            key={index}
                            className={cx('question-item', { correct: isCorrect, incorrect: !isCorrect })}
                            variants={questionVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.1 * index }}
                        >
                            {isCorrect ? (
                                <CheckCircle className={cx('result-icon', 'correct-icon')} />
                            ) : (
                                <Cancel className={cx('result-icon', 'incorrect-icon')} />
                            )}
                            <div className={cx('question-content')}>
                                <p>{q.question}</p>
                                {!isCorrect && (
                                    <div className={cx('correct-answer')}>
                                        <span>Correct answer: </span>
                                        <span className={cx('answer-value')}>
                                            {q.correctAnswer}: {q.options[q.correctAnswer]}
                                        </span>
                                    </div>
                                )}
                                <div className={cx('user-answer')}>
                                    <span>Your answer: </span>
                                    <span className={cx('answer-value', { correct: isCorrect, incorrect: !isCorrect })}>
                                        {q.userAnswer}: {q.options[q.userAnswer]}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
} 