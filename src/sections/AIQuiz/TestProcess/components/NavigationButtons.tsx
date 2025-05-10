import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import { motion } from 'framer-motion';
import styles from '../view/TestProcess.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface NavigationButtonsProps {
    isLastQuestion: boolean;
    handlePrevious: () => void;
    handleNext: () => void;
    handleOpenSubmitModal: () => void;
}

export default function NavigationButtons({
    isLastQuestion,
    handlePrevious,
    handleNext,
    handleOpenSubmitModal,
}: NavigationButtonsProps) {
    return (
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
    );
}
