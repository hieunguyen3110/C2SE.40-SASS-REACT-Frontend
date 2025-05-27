import { BarChart, Timer } from '@mui/icons-material';
import { motion } from 'framer-motion';
import styles from '../view/TestProcess.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface TestHeaderProps {
    subjectName: string;
    answeredQuestions: number;
    totalQuestions: number;
    timer: number;
}

export default function TestHeader({ 
    subjectName, 
    answeredQuestions, 
    totalQuestions, 
    timer 
}: TestHeaderProps) {
    // Format time as MM:SS
    const formatTime = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className={cx('header')}>
            <motion.div
                className={cx('title')}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
            >
                <BarChart className={cx('icon')} />
                <h1>{subjectName}</h1>
                <span className={cx('test-label')}>Bài kiểm tra</span>
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
                    {answeredQuestions}/{totalQuestions} Câu hỏi đã trả lời
                </span>
            </motion.div>
            <motion.div
                className={cx('timer-container')}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
            >
                <Timer className={cx('timer-icon')} />
                <span className={cx('timer-text')}>Thời gian còn lại: {formatTime()}</span>
            </motion.div>
        </div>
    );
} 