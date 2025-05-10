import { motion } from 'framer-motion';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from '../view/TestResultDetail.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface TestResultActionsProps {
    onBack?: () => void;
}

export default function TestResultActions({ onBack }: TestResultActionsProps) {
    const navigate = useNavigate();
    
    const handleBackToQuiz = () => {
        if (onBack) {
            onBack();
        } else {
            navigate('/document/ai-quiz');
        }
    };
    
    const handleNewQuiz = () => {
        navigate('/document/ai-quiz');
    };
    
    return (
        <motion.div
            className={cx('action-buttons')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
        >
            <Button 
                variant="outlined" 
                className={cx('action-btn', 'back-btn')} 
                onClick={handleBackToQuiz}
            >
                Quay lại
            </Button>
            <Button 
                variant="contained" 
                className={cx('action-btn', 'next-exercise-btn')}
                onClick={handleNewQuiz}
            >
                Làm bài tập khác
            </Button>
        </motion.div>
    );
} 