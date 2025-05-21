import { Close, Warning } from '@mui/icons-material';
import { Typography, Modal } from '@mui/material';
import { motion } from 'framer-motion';
import styles from '../view/TestProcess.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface SubmitModalProps {
    open: boolean;
    answeredQuestions: number;
    totalQuestions: number;
    unansweredQuestions: number;
    formatTime: () => string;
    handleClose: () => void;
    handleSubmit: () => void;
    isSubmitting?: boolean;
}

export default function SubmitModal({
    open,
    answeredQuestions,
    totalQuestions,
    unansweredQuestions,
    formatTime,
    handleClose,
    handleSubmit,
    isSubmitting = false,
}: SubmitModalProps) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="submit-modal-title"
            aria-describedby="submit-modal-description"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <motion.div
                className={cx('submit-modal')}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30, duration: 0.2 }}
            >
                <div className={cx('submit-modal-header')}>
                    <Typography id="submit-modal-title" variant="h6" component="h2">
                        Xác nhận nộp bài
                    </Typography>
                    <motion.button
                        className={cx('close-button')}
                        onClick={handleClose}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={isSubmitting}
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
                                            )`,
                                }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
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
                                Hãy hoàn thành <strong>{unansweredQuestions}</strong> câu hỏi còn lại trước khi nộp bài.
                            </Typography>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    className={cx('submit-modal-actions')}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                >
                    <motion.button
                        className={cx('modal-button', 'cancel')}
                        onClick={handleClose}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isSubmitting}
                    >
                        Quay lại
                    </motion.button>
                    <motion.button
                        className={cx('modal-button', 'confirm', { submitting: isSubmitting })}
                        onClick={handleSubmit}

                        whileHover={isSubmitting ? {} : { scale: 1.05 }}
                        whileTap={isSubmitting ? {} : { scale: 0.95 }}
                        disabled={isSubmitting || unansweredQuestions > 0}
                    >
                        {isSubmitting ? (
                            <>
                                <div className={cx('button-spinner')}></div>
                                <span>Đang nộp...</span>
                            </>
                        ) : (
                            <span>Nộp bài</span>
                        )}
                    </motion.button>
                </motion.div>
            </motion.div>
        </Modal>
    );
}
