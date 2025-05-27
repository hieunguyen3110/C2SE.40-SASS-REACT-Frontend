import { ChevronLeft, ChevronRight, AssignmentTurnedIn } from '@mui/icons-material';
import { motion } from 'framer-motion';
import styles from '../view/TestProcess.module.scss';
import classNames from 'classnames/bind';
import { Question } from '../types';

const cx = classNames.bind(styles);

const QUESTION_NAV_CONFIG = {
    VISIBLE_BUTTONS: 5,
};

interface QuestionNavigationProps {
    currentQuestion: number;
    questions: Question[];
    setCurrentQuestion: (questionId: number) => void;
    handleOpenReviewModal: () => void;
}

export default function QuestionNavigation({ 
    currentQuestion, 
    questions, 
    setCurrentQuestion, 
    handleOpenReviewModal
}: QuestionNavigationProps) {
    // Calculate pagination
    const getPaginationRange = () => {
        const buttonsPerPage = QUESTION_NAV_CONFIG.VISIBLE_BUTTONS;
        const totalQuestions = questions.length;
        const totalPages = Math.ceil(totalQuestions / buttonsPerPage);
        const currentPage = Math.ceil(currentQuestion / buttonsPerPage);
        
        const start = (currentPage - 1) * buttonsPerPage + 1;
        const end = Math.min(currentPage * buttonsPerPage, totalQuestions);

        return { start, end, currentPage, totalPages };
    };

    const { start, end, currentPage, totalPages } = getPaginationRange();

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentQuestion((newPage - 1) * QUESTION_NAV_CONFIG.VISIBLE_BUTTONS + 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            setCurrentQuestion((newPage - 1) * QUESTION_NAV_CONFIG.VISIBLE_BUTTONS + 1);
        }
    };

    return (
        <div className={cx('nav-controls')}>
            <motion.div
                className={cx('question-nav')}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
            >
                {currentPage > 1 && (
                    <motion.button
                        className={cx('nav-control-button')}
                        onClick={handlePreviousPage}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Previous page"
                    >
                        <ChevronLeft />
                    </motion.button>
                )}

                {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((num) => {
                    const question = questions[num - 1];
                    return (
                        <motion.button
                            key={question.id}
                            className={cx('question-number', {
                                active: question.id === currentQuestion,
                                answered: question.selectedAnswer !== undefined,
                            })}
                            onClick={() => setCurrentQuestion(question.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {question.id}
                        </motion.button>
                    );
                })}

                {currentPage < totalPages && (
                    <motion.button
                        className={cx('nav-control-button')}
                        onClick={handleNextPage}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Next page"
                    >
                        <ChevronRight />
                    </motion.button>
                )}
            </motion.div>

            <motion.button
                className={cx('review-button')}
                onClick={handleOpenReviewModal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Review questions"
            >
                <AssignmentTurnedIn />
                <span>Xem lại</span>
            </motion.button>
        </div>
    );
} 