import { motion } from 'framer-motion';
import { LinearProgress } from '@mui/material';
import styles from '../view/TestResultDetail.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface TestResultScoreProps {
    score: number;
    totalQuestions: number;
    originalScore?: number;
}

export default function TestResultScore({ 
    score, 
    totalQuestions,
    originalScore 
}: TestResultScoreProps) {
    const completionPercentage = (score / 10) * 100;
    
    // If originalScore is not provided, we're already using a 0-10 scale
    const displayedScore = score.toFixed(1);

    return (
        <motion.div 
            className={cx('score-section')} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <motion.div
                className={cx('score-container')}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
            >
                <h2 className={cx('score')}>{displayedScore}/10</h2>
                {originalScore && (
                    <div className={cx('original-score')}>
                        Original Score: {originalScore}/{totalQuestions}
                    </div>
                )}
            </motion.div>
            
            <div className={cx('progress-container')}>
                <LinearProgress 
                    variant="determinate" 
                    value={completionPercentage} 
                    className={cx('progress-bar')} 
                />
                <motion.p
                    className={cx('completion-text')}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Đã hoàn thành! ({Math.round(completionPercentage)}%)
                </motion.p>
            </div>
        </motion.div>
    );
} 