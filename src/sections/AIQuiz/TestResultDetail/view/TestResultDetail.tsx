import styles from './TestResultDetail.module.scss';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import { AssignmentTurnedIn, CheckCircle, Cancel, Description } from '@mui/icons-material';
import { Button, LinearProgress } from '@mui/material';

const cx = classNames.bind(styles);

interface TestResultDetailProps {
    onBack?: () => void;
}

export default function TestResultDetail({ onBack }: TestResultDetailProps) {
    // Animation variants
    const pageVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5, when: 'beforeChildren', staggerChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 },
        },
    };

    const questionVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: 'spring', stiffness: 100 },
        },
    };

    // Sample data for the test result
    const testResult = {
        subject: 'Tên môn thi',
        score: 7,
        totalQuestions: 10,
        correctAnswers: 7,
        incorrectAnswers: 3,
        analysisData: [
            { name: 'Kiến thức', value: 65 },
            { name: 'Ứng dụng', value: 60 },
            { name: 'Phân tích', value: 75 },
        ],
        relatedDocuments: [
            { title: 'Calculus Made Easy', image: '/path/to/image1.jpg' },
            { title: '3D Geometry Guide', image: '/path/to/image2.jpg' },
            { title: 'Linear Equations Handbook', image: '/path/to/image3.jpg' },
            { title: 'Advanced Mathematics', image: '/path/to/image4.jpg' },
        ],
        questions: [
            { id: 1, question: 'What is the formula for the area of a circle?', isCorrect: true },
            { id: 2, question: 'Which of the following is a prime number?', isCorrect: true },
            { id: 3, question: 'What is the value of x in the equation 2x + 5 = 15?', isCorrect: true },
            { id: 4, question: 'What is the derivative of f(x) = x²?', isCorrect: false, correctAnswer: 'A = πr²' },
            { id: 5, question: 'What is the formula for the Pythagorean theorem?', isCorrect: true },
            { id: 6, question: 'What is the value of π (pi) to two decimal places?', isCorrect: true },
            {
                id: 7,
                question: 'What is the formula for the volume of a sphere?',
                isCorrect: false,
                correctAnswer: 'A = πr²',
            },
            { id: 8, question: 'Which of these numbers is irrational?', isCorrect: true },
            { id: 9, question: 'What is the slope of a horizontal line?', isCorrect: false, correctAnswer: 'A = πr²' },
            { id: 10, question: 'What is the formula for the area of a triangle?', isCorrect: true },
        ],
    };

    const completionPercentage = (testResult.score / testResult.totalQuestions) * 100;

    return (
        <motion.div className={cx('test-result-detail')} initial="hidden" animate="visible" variants={pageVariants}>
            {/* Header Section */}
            <motion.div className={cx('result-header')} variants={itemVariants}>
                <h1>Kết quả</h1>
                <p className={cx('subject-name')}>{testResult.subject}</p>
            </motion.div>

            {/* Score Section */}
            <motion.div className={cx('score-section')} variants={itemVariants}>
                <motion.h2
                    className={cx('score')}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                >
                    {testResult.score}/{testResult.totalQuestions}
                </motion.h2>
                <div className={cx('progress-container')}>
                    <LinearProgress variant="determinate" value={completionPercentage} className={cx('progress-bar')} />
                    <motion.p
                        className={cx('completion-text')}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Đã hoàn thành! ({completionPercentage}%)
                    </motion.p>
                </div>
            </motion.div>

            {/* Analysis Section */}
            <div className={cx('analysis-container')}>
                {/* Answer Analysis */}
                <motion.div className={cx('analysis-card')} variants={itemVariants}>
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
                            <span className={cx('stat-count')}>{testResult.correctAnswers}</span>
                            <CheckCircle className={cx('stat-icon')} />
                            <span className={cx('stat-label')}>ĐÚNG</span>
                        </motion.div>
                        <motion.div
                            className={cx('stat-item', 'incorrect')}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <span className={cx('stat-count')}>{testResult.incorrectAnswers}</span>
                            <Cancel className={cx('stat-icon')} />
                            <span className={cx('stat-label')}>SAI</span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Score Analysis */}
                <motion.div className={cx('analysis-card')} variants={itemVariants}>
                    <div className={cx('analysis-header')}>
                        <AssignmentTurnedIn />
                        <h3>Phân tích điểm số</h3>
                    </div>
                    <div className={cx('score-analysis')}>
                        {testResult.analysisData.map((item, index) => (
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

            {/* Related Documents Section */}
            <motion.div className={cx('related-docs-section')} variants={itemVariants}>
                <h2 className={cx('section-title')}>Tài liệu liên quan</h2>
                <div className={cx('docs-container')}>
                    {testResult.relatedDocuments.map((doc, index) => (
                        <motion.div
                            key={index}
                            className={cx('doc-card')}
                            whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                        >
                            <div className={cx('doc-image')}>
                                {/* Placeholder for document image */}
                                <div className={cx('image-placeholder')}></div>
                            </div>
                            <h3 className={cx('doc-title')}>{doc.title}</h3>
                            <Button variant="text" startIcon={<Description />} className={cx('view-doc-btn')}>
                                View Document
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Question Review Section */}
            <motion.div className={cx('question-review-section')} variants={itemVariants}>
                <h2 className={cx('section-title')}>Question Review</h2>
                <div className={cx('questions-list')}>
                    {testResult.questions.map((q, index) => (
                        <motion.div
                            key={q.id}
                            className={cx('question-item', { correct: q.isCorrect, incorrect: !q.isCorrect })}
                            variants={questionVariants}
                        >
                            {q.isCorrect ? (
                                <CheckCircle className={cx('result-icon', 'correct-icon')} />
                            ) : (
                                <Cancel className={cx('result-icon', 'incorrect-icon')} />
                            )}
                            <div className={cx('question-content')}>
                                <p>{q.question}</p>
                                {!q.isCorrect && (
                                    <div className={cx('correct-answer')}>
                                        <span>Correct answer: </span>
                                        <span className={cx('answer-value')}>{q.correctAnswer}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Action Buttons Section */}
            <motion.div
                className={cx('action-buttons')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Button variant="outlined" className={cx('action-btn', 'back-btn')} onClick={onBack}>
                    Quay lại
                </Button>
                <Button variant="contained" className={cx('action-btn', 'next-exercise-btn')}>
                    Làm bài tập khác
                </Button>
            </motion.div>
        </motion.div>
    );
}
