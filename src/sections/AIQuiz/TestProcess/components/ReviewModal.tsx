import { Close, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { Typography, Modal } from '@mui/material';
import { motion } from 'framer-motion';
import styles from '../view/TestProcess.module.scss';
import classNames from 'classnames/bind';
import { Question } from '../types';

const cx = classNames.bind(styles);

interface ReviewModalProps {
    open: boolean;
    questions: Question[];
    currentQuestion: number;
    answeredQuestions: number;
    totalQuestions: number;
    formatTime: () => string;
    handleClose: () => void;
    handleGoToQuestion: (questionId: number) => void;
}

export default function ReviewModal({
    open,
    questions,
    currentQuestion,
    answeredQuestions,
    totalQuestions,
    formatTime,
    handleClose,
    handleGoToQuestion,
}: ReviewModalProps) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="review-modal-title"
            aria-describedby="review-modal-description"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <motion.div
                className={cx('review-modal')}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30, duration: 0.2 }}
            >
                <div className={cx('review-modal-header')}>
                    <Typography id="review-modal-title" variant="h6" component="h2">
                        Review Questions
                    </Typography>
                    <motion.button
                        className={cx('close-button')}
                        onClick={handleClose}
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
                            <strong>
                                {answeredQuestions}/{totalQuestions} Questions
                            </strong>
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
                                    answered: question.selectedAnswer !== undefined,
                                    current: question.id === currentQuestion,
                                })}
                                onClick={() => handleGoToQuestion(question.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className={cx('question-status-number')}>{question.id}</div>
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
                        onClick={handleClose}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Continue Test
                    </motion.button>
                </motion.div>
            </motion.div>
        </Modal>
    );
}
