import classNames from 'classnames/bind';
import styles from './AIQuizHeader.module.scss';
import { AutoStories, TaskAlt } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const cx = classNames.bind(styles);

export default function AIQuizHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const buttonVariants = {
        hover: {
            scale: 1.05,
            transition: { duration: 0.2 },
        },
        tap: {
            scale: 0.95,
        },
    };

    return (
        <header className={cx('ai-quiz-header')}>
            <div className={cx('logo')}>
                <span className={cx('dtu')}>AI</span>
                <span className={cx('document')}>QUIZ</span>
            </div>
            <div className={cx('actions')}>
                <motion.div
                    className={cx('action-btn', {
                        active: currentPath.includes('/ai-quiz/knowledge-test') || currentPath === '/document/ai-quiz',
                    })}
                    onClick={() => navigate('/document/ai-quiz/knowledge-test')}
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                >
                    <AutoStories />
                    <span>Bài kiểm tra kiến thức</span>
                </motion.div>
                <motion.div
                    className={cx('action-btn', { active: currentPath.includes('/ai-quiz/learning-statistics') })}
                    onClick={() => navigate('/document/ai-quiz/learning-statistics')}
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    <TaskAlt />
                    <span>Thống kê học tập</span>
                </motion.div>
            </div>
        </header>
    );
}
