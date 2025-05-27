import { motion } from 'framer-motion';
import styles from '../view/TestProcess.module.scss';
import classNames from 'classnames/bind';
import { Question } from '../types';

const cx = classNames.bind(styles);

interface QuestionDisplayProps {
    currentQuestionData: Question;
    handleSelectOption: (optionId: string) => void;
}

export default function QuestionDisplay({ 
    currentQuestionData, 
    handleSelectOption 
}: QuestionDisplayProps) {
    return (
        <motion.div
            className={cx('question-container')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            key={currentQuestionData.id}
        >
            <motion.div className={cx('question-header')}>
                <div className={cx('question-label')}>Câu hỏi {currentQuestionData.id}</div>
            </motion.div>

            <motion.div className={cx('question-text')}>
                {currentQuestionData.text}
            </motion.div>

            <motion.div className={cx('options-container')}>
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
                                    transition={{
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 25,
                                        duration: 0.1,
                                    }}
                                ></motion.div>
                            )}
                        </div>
                        <span>{option.text}</span>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
} 