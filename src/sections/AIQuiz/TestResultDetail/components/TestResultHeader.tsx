import { motion } from 'framer-motion';
import styles from '../view/TestResultDetail.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface TestResultHeaderProps {
    subjectName: string;
}

export default function TestResultHeader({ subjectName }: TestResultHeaderProps) {
    return (
        <motion.div 
            className={cx('result-header')} 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1>Kết quả</h1>
            <p className={cx('subject-name')}>{subjectName}</p>
        </motion.div>
    );
} 