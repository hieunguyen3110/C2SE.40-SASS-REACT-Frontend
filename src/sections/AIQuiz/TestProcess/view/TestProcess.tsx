import { useState, useEffect } from 'react';
import styles from './TestProcess.module.scss';
import classNames from 'classnames/bind';
import { 
    BarChart, 
    NavigateBefore, 
    NavigateNext, 
    Close, 
    Warning, 
    Timer, 
    FirstPage, 
    LastPage, 
    AssignmentTurnedIn, 
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    RadioButtonUnchecked
} from '@mui/icons-material';
import { Modal, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

// Configuración de la navegación de preguntas
const QUESTION_NAV_CONFIG = {
    VISIBLE_BUTTONS: 5, // Número de botones visibles en la navegación
};

interface Question {
    id: number;
    text: string;
    options: { id: number; text: string }[];
    selectedAnswer?: number;
}

export default function TestProcess() {
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState<number>(1);
    const [questions, setQuestions] = useState<Question[]>([
        {
            id: 1,
            text: 'What is the formula for the area of a circle?',
            options: [
                { id: 1, text: 'A = πr²' },
                { id: 2, text: 'A = 2πr' },
                { id: 3, text: 'A = πd' },
                { id: 4, text: 'A = r²' },
            ],
        },
        {
            id: 2,
            text: 'Question 2',
            options: [
                { id: 1, text: 'Option 1' },
                { id: 2, text: 'Option 2' },
                { id: 3, text: 'Option 3' },
                { id: 4, text: 'Option 4' },
            ],
        },
        {
            id: 3,
            text: 'What is the value of x in the equation 2x + 5 = 15?',
            options: [
                { id: 1, text: 'x = 5' },
                { id: 2, text: 'x = 7' },
                { id: 3, text: 'x = 10' },
                { id: 4, text: 'x = 20' },
            ],
            selectedAnswer: 1,
        },
        {
            id: 4,
            text: 'Question 4',
            options: [
                { id: 1, text: 'Option 1' },
                { id: 2, text: 'Option 2' },
                { id: 3, text: 'Option 3' },
                { id: 4, text: 'Option 4' },
            ],
        },
        {
            id: 5,
            text: 'Question 5',
            options: [
                { id: 1, text: 'Option 1' },
                { id: 2, text: 'Option 2' },
                { id: 3, text: 'Option 3' },
                { id: 4, text: 'Option 4' },
            ],
        },
        {
            id: 6,
            text: 'Which of the following is the derivative of f(x) = x²?',
            options: [
                { id: 1, text: 'f\'(x) = 2x' },
                { id: 2, text: 'f\'(x) = x²' },
                { id: 3, text: 'f\'(x) = 1/x' },
                { id: 4, text: 'f\'(x) = x' },
            ],
        },
        {
            id: 7,
            text: 'What is the capital of France?',
            options: [
                { id: 1, text: 'London' },
                { id: 2, text: 'Berlin' },
                { id: 3, text: 'Paris' },
                { id: 4, text: 'Madrid' },
            ],
        },
        {
            id: 8,
            text: 'If a triangle has sides of lengths 3, 4, and 5, what type of triangle is it?',
            options: [
                { id: 1, text: 'Equilateral' },
                { id: 2, text: 'Isosceles' },
                { id: 3, text: 'Scalene' },
                { id: 4, text: 'Right-angled' },
            ],
        },
    ]);
    const [openSubmitModal, setOpenSubmitModal] = useState(false);
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [timer, setTimer] = useState<number>(3600); // 60 minutes in seconds
    const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const currentQuestionData = questions.find((q) => q.id === currentQuestion) || questions[0];
    const totalQuestions = questions.length;
    const answeredQuestions = questions.filter((q) => q.selectedAnswer !== undefined).length;
    const isLastQuestion = currentQuestion === totalQuestions;
    const unansweredQuestions = totalQuestions - answeredQuestions;

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        
        if (isTimerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer(prevTime => prevTime - 1);
            }, 1000);
        } else if (timer === 0) {
            // Auto-submit when time is up
            handleOpenSubmitModal();
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timer, isTimerActive]);

    // Format time as MM:SS
    const formatTime = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSelectOption = (optionId: number) => {
        // Automatically save the answer when selecting an option
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === currentQuestion ? { ...question, selectedAnswer: optionId } : question,
            ),
        );

        // Optional: automatically move to next question after selection
        // if (currentQuestion < totalQuestions) {
        //   setTimeout(() => setCurrentQuestion(currentQuestion + 1), 500);
        // }
    };

    const handlePrevious = () => {
        if (currentQuestion > 1) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < totalQuestions) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handleOpenSubmitModal = () => {
        setOpenSubmitModal(true);
    };

    const handleCloseSubmitModal = () => {
        setOpenSubmitModal(false);
    };

    const handleSubmit = () => {
        // Xử lý logic khi người dùng nộp bài kiểm tra
        console.log('Bài kiểm tra đã được nộp', questions);

        // Đóng modal
        setOpenSubmitModal(false);
        
        // Stop the timer
        setIsTimerActive(false);

        // Có thể xử lý dữ liệu ở đây hoặc gửi lên server
        // Ví dụ: gửi kết quả lên server API
        // submitTestResults(questions);

        // Navigate to the test result page
        // For now using a placeholder ID, you might want to replace this with the actual test ID
        navigate('/document/ai-quiz/test-result/1');
    };

    const handleOpenReviewModal = () => {
        setOpenReviewModal(true);
    };

    const handleCloseReviewModal = () => {
        setOpenReviewModal(false);
    };

    const handleGoToQuestion = (questionId: number) => {
        setCurrentQuestion(questionId);
        handleCloseReviewModal();
    };

    // Calculate pagination
    const getPaginationRange = () => {
        const buttonsPerPage = QUESTION_NAV_CONFIG.VISIBLE_BUTTONS;
        const totalPages = Math.ceil(totalQuestions / buttonsPerPage);
        
        // Update currentPage based on the current question
        const newPage = Math.ceil(currentQuestion / buttonsPerPage);
        if (newPage !== currentPage) {
            setCurrentPage(newPage);
        }
        
        const start = (currentPage - 1) * buttonsPerPage + 1;
        const end = Math.min(currentPage * buttonsPerPage, totalQuestions);
        
        return { start, end, totalPages };
    };
    
    const { start, end, totalPages } = getPaginationRange();
    
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            setCurrentQuestion((newPage - 1) * QUESTION_NAV_CONFIG.VISIBLE_BUTTONS + 1);
        }
    };
    
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            setCurrentQuestion((newPage - 1) * QUESTION_NAV_CONFIG.VISIBLE_BUTTONS + 1);
        }
    };

    return (
        <motion.div 
            className={cx('test-process')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className={cx('header')}>
                <motion.div 
                    className={cx('title')}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <BarChart className={cx('icon')} />
                    <h1>Mathematics</h1>
                    <span className={cx('test-label')}>Test</span>
                </motion.div>
                <motion.div 
                    className={cx('progress-container')}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                >
                    <div className={cx('progress-bar')}>
                        <motion.div
                            className={cx('progress')}
                            initial={{ width: 0 }}
                            animate={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
                            transition={{ duration: 0.2 }}
                        ></motion.div>
                    </div>
                    <span className={cx('progress-text')}>
                        {answeredQuestions}/{totalQuestions} Questions Answered
                    </span>
                </motion.div>
                <motion.div 
                    className={cx('timer-container')}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                >
                    <Timer className={cx('timer-icon')} />
                    <span className={cx('timer-text')}>
                        Time Left: {formatTime()}
                    </span>
                </motion.div>
            </div>

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
                    <span>Review</span>
                </motion.button>
            </div>

            <AnimatePresence mode="wait" initial={false}>
                <motion.div 
                    key={currentQuestion}
                    className={cx('question-container')}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <motion.div 
                        className={cx('question-header')}
                    >
                        <div className={cx('question-label')}>Question {currentQuestion}</div>
                    </motion.div>

                    <motion.div 
                        className={cx('question-text')}
                    >
                        {currentQuestionData.text}
                    </motion.div>

                    <motion.div 
                        className={cx('options-container')}
                    >
                        {currentQuestionData.options.map((option) => (
                            <motion.div
                                key={option.id}
                                className={cx('option', {
                                    selected: option.id === currentQuestionData.selectedAnswer,
                                })}
                                onClick={() => handleSelectOption(option.id)}
                                whileHover={{ scale: 1.02, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className={cx('radio')}>
                                    {option.id === currentQuestionData.selectedAnswer && (
                                        <motion.div 
                                            className={cx('radio-dot')}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 25, duration: 0.1 }}
                                        ></motion.div>
                                    )}
                                </div>
                                <span>{option.text}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            <motion.div 
                className={cx('navigation')}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
            >
                <motion.button 
                    className={cx('nav-button', 'prev')} 
                    onClick={handlePrevious}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <NavigateBefore />
                    <span>Previous</span>
                </motion.button>

                {isLastQuestion ? (
                    <motion.button 
                        className={cx('nav-button', 'submit')} 
                        onClick={handleOpenSubmitModal}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>Submit</span>
                    </motion.button>
                ) : (
                    <motion.button 
                        className={cx('nav-button', 'next')} 
                        onClick={handleNext}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>Next</span>
                        <NavigateNext />
                    </motion.button>
                )}
            </motion.div>

            {/* Submit Confirmation Modal */}
            <AnimatePresence>
                {openSubmitModal && (
                    <Modal
                        open={openSubmitModal}
                        onClose={handleCloseSubmitModal}
                        aria-labelledby="submit-modal-title"
                        aria-describedby="submit-modal-description"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <motion.div 
                            className={cx('submit-modal')}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30, duration: 0.2 }}
                        >
                            <div className={cx('submit-modal-header')}>
                                <Typography id="submit-modal-title" variant="h6" component="h2">
                                    Xác nhận nộp bài
                                </Typography>
                                <motion.button 
                                    className={cx('close-button')} 
                                    onClick={handleCloseSubmitModal}
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Close />
                                </motion.button>
                            </div>

                            <motion.div 
                                className={cx('submit-modal-content')}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.05, duration: 0.2 }}
                            >
                                <div className={cx('progress-summary')}>
                                    <div className={cx('progress-circle-container')}>
                                        <motion.div
                                            className={cx('progress-circle')}
                                            initial={{ rotate: -90 }}
                                            animate={{ 
                                                rotate: 0,
                                                background: `conic-gradient(
                                                    #ff0000 0% ${(answeredQuestions / totalQuestions) * 100}%, 
                                                    #f0f0f0 ${(answeredQuestions / totalQuestions) * 100}% 100%
                                                )`
                                            }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                        >
                                            <div className={cx('progress-circle-inner')}>
                                                <motion.span 
                                                    className={cx('progress-percentage')}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    {Math.round((answeredQuestions / totalQuestions) * 100)}%
                                                </motion.span>
                                            </div>
                                        </motion.div>
                                        <div className={cx('progress-text-summary')}>
                                            <span className={cx('answered-text')}>
                                                Đã trả lời: <strong>{answeredQuestions}</strong>
                                            </span>
                                            <span className={cx('total-text')}>
                                                Tổng số câu: <strong>{totalQuestions}</strong>
                                            </span>
                                            <span className={cx('time-text')}>
                                                Thời gian còn lại: <strong>{formatTime()}</strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {unansweredQuestions > 0 && (
                                    <motion.div 
                                        className={cx('warning-message')}
                                        initial={{ x: -5, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1, duration: 0.2 }}
                                    >
                                        <Warning className={cx('warning-icon')} />
                                        <Typography>
                                            Bạn còn <strong>{unansweredQuestions}</strong> câu hỏi chưa trả lời.
                                        </Typography>
                                    </motion.div>
                                )}

                                <Typography id="submit-modal-description" className={cx('confirmation-text')}>
                                    Bạn có chắc chắn muốn nộp bài kiểm tra này?
                                </Typography>
                            </motion.div>

                            <motion.div 
                                className={cx('submit-modal-actions')}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.2 }}
                            >
                                <motion.button 
                                    className={cx('modal-button', 'cancel')} 
                                    onClick={handleCloseSubmitModal}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Quay lại
                                </motion.button>
                                <motion.button 
                                    className={cx('modal-button', 'confirm')} 
                                    onClick={handleSubmit}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Nộp bài
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </Modal>
                )}
            </AnimatePresence>

            {/* Review Questions Modal */}
            <AnimatePresence>
                {openReviewModal && (
                    <Modal
                        open={openReviewModal}
                        onClose={handleCloseReviewModal}
                        aria-labelledby="review-modal-title"
                        aria-describedby="review-modal-description"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <motion.div 
                            className={cx('review-modal')}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30, duration: 0.2 }}
                        >
                            <div className={cx('review-modal-header')}>
                                <Typography id="review-modal-title" variant="h6" component="h2">
                                    Review Questions
                                </Typography>
                                <motion.button 
                                    className={cx('close-button')} 
                                    onClick={handleCloseReviewModal}
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Close />
                                </motion.button>
                            </div>

                            <motion.div 
                                className={cx('review-modal-content')}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.05, duration: 0.2 }}
                            >
                                <div className={cx('review-progress-summary')}>
                                    <div className={cx('review-progress')}>
                                        <span>Progress: </span>
                                        <strong>{answeredQuestions}/{totalQuestions} Questions</strong>
                                    </div>
                                    <div className={cx('review-time')}>
                                        <span>Time Left: </span>
                                        <strong>{formatTime()}</strong>
                                    </div>
                                </div>

                                <div className={cx('question-status-grid')}>
                                    {questions.map((question) => (
                                        <motion.div 
                                            key={question.id}
                                            className={cx('question-status', {
                                                'answered': question.selectedAnswer !== undefined,
                                                'current': question.id === currentQuestion
                                            })}
                                            onClick={() => handleGoToQuestion(question.id)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <div className={cx('question-status-number')}>
                                                {question.id}
                                            </div>
                                            <div className={cx('question-status-icon')}>
                                                {question.selectedAnswer !== undefined ? (
                                                    <CheckCircle className={cx('answered-icon')} />
                                                ) : (
                                                    <RadioButtonUnchecked className={cx('unanswered-icon')} />
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div 
                                className={cx('review-modal-actions')}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.2 }}
                            >
                                <motion.button 
                                    className={cx('modal-button', 'primary')} 
                                    onClick={handleCloseReviewModal}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Continue Test
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </Modal>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
