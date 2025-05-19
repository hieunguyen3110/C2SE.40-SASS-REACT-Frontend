import { motion } from 'framer-motion';
import { LinearProgress } from '@mui/material';
import { AssignmentTurnedIn, CheckCircle, Cancel } from '@mui/icons-material';
import styles from '../view/TestResultDetail.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface TestResultAnalysisProps {
    correctAnswers: number;
    totalQuestions: number;
}

export default function TestResultAnalysis({ correctAnswers, totalQuestions }: TestResultAnalysisProps) {
    const incorrectAnswers = totalQuestions - correctAnswers;
    
    // Calculate percentages for different skill areas based on correctness
    const knowledgePercentage = Math.round((correctAnswers / totalQuestions) * 100 - 10); // Just an example calculation
    const applicationPercentage = Math.round((correctAnswers / totalQuestions) * 100 - 15);
    const analysisPercentage = Math.round((correctAnswers / totalQuestions) * 100 + 5);
    
    const analysisData = [
        { name: 'Kiến thức', value: Math.max(0, knowledgePercentage) },
        { name: 'Ứng dụng', value: Math.max(0, applicationPercentage) },
        { name: 'Phân tích', value: Math.max(0, analysisPercentage) },
    ];

    return (
        <div className={cx('analysis-container')}>
            {/* Answer Analysis */}
            <motion.div 
                className={cx('analysis-card')} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <div className={cx('analysis-header')}>
                    <AssignmentTurnedIn />
                    <h3>Phân tích câu trả lời</h3>
                </div>
                <div className={cx('answer-stats')}>
                    <motion.div
                        className={cx('stat-item', 'correct')}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <span className={cx('stat-count')}>{correctAnswers}</span>
                        <CheckCircle className={cx('stat-icon')} />
                        <span className={cx('stat-label')}>ĐÚNG</span>
                    </motion.div>
                    <motion.div
                        className={cx('stat-item', 'incorrect')}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <span className={cx('stat-count')}>{incorrectAnswers}</span>
                        <Cancel className={cx('stat-icon')} />
                        <span className={cx('stat-label')}>SAI</span>
                    </motion.div>
                </div>
            </motion.div>

            {/* Score Analysis */}
            <motion.div 
                className={cx('analysis-card')} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <div className={cx('analysis-header')}>
                    <AssignmentTurnedIn />
                    <h3>Phân tích điểm số</h3>
                </div>
                <div className={cx('score-analysis')}>
                    {analysisData.map((item, index) => (
                        <motion.div
                            key={index}
                            className={cx('analysis-item')}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                        >
                            <div className={cx('analysis-item-header')}>
                                <span>{item.name}</span>
                                <span>{item.value}%</span>
                            </div>
                            <LinearProgress
                                variant="determinate"
                                value={item.value}
                                className={cx('analysis-progress', `analysis-type-${index}`)}
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
} 