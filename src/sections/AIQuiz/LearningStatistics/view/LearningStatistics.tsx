import styles from './LearningStatistics.module.scss';
import classNames from 'classnames/bind';
import { Timeline, LibraryBooks, AccessTime, History, Check, Close } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getHistoryAction } from '../../../../redux/AIQuizSlice/aiQuizSlice';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';
import { HistoryQuizzes } from '../../../../types/quiz.types';
const cx = classNames.bind(styles);

export default function LearningStatistics() {
    const dispatch = useAppDispatch();
    const { quizHistory } = useAppSelector((state) => state.aiQuiz);
    const [selectedQuiz, setSelectedQuiz] = useState<HistoryQuizzes | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenModal = (quiz: HistoryQuizzes) => {
        setSelectedQuiz(quiz);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedQuiz(null);
    };

    const pageVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.6, when: 'beforeChildren', staggerChildren: 0.2 },
        },
    };

    const cardVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 },
        },
    };

    const tableVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.6, when: 'beforeChildren', staggerChildren: 0.1 },
        },
    };

    const rowVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: 'spring', stiffness: 100 },
        },
    };

    useEffect(() => {
        dispatch(getHistoryAction());
    }, []);

    // Calculate statistics from quizHistory
    const calculateAverageScore = () => {
        if (quizHistory.length === 0) return 0;
        const totalScore = quizHistory.reduce((sum, quiz) => sum + quiz.score, 0);
        return (totalScore / quizHistory.length).toFixed(2);
    };

    const completedTestsCount = quizHistory.length;

    return (
        <motion.div className={cx('test-results-page')} initial="hidden" animate="visible" variants={pageVariants}>
            <motion.h1
                className={cx('page-title')}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Thống kê học tập
            </motion.h1>
            <motion.p
                className={cx('page-subtitle')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                Theo dõi quá trình học tập của bạn qua các bài kiểm tra AI
            </motion.p>

            <div className={cx('stats-container')}>
                <motion.div className={cx('stat-card')} variants={cardVariants}>
                    <Timeline className={cx('stat-icon')} />
                    <div className={cx('stat-label')}>Điểm trung bình</div>
                    <div className={cx('stat-value')}>{calculateAverageScore()}%</div>
                </motion.div>

                <motion.div className={cx('stat-card')} variants={cardVariants}>
                    <LibraryBooks className={cx('stat-icon')} />
                    <div className={cx('stat-label')}>Số bài đã hoàn thành</div>
                    <div className={cx('stat-value')}>{completedTestsCount}</div>
                </motion.div>

                <motion.div className={cx('stat-card')} variants={cardVariants}>
                    <AccessTime className={cx('stat-icon')} />
                    <div className={cx('stat-label')}>Bài kiểm tra gần nhất</div>
                    <div className={cx('stat-value')}>
                        {quizHistory.length > 0
                            ? new Date(
                                  [...quizHistory].sort(
                                      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                                  )[0].createdAt,
                              ).toLocaleDateString('vi-VN')
                            : 'Chưa có'}
                    </div>
                </motion.div>
            </div>

            <motion.div
                className={cx('test-history')}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
            >
                <h2 className={cx('history-title')}>
                    <History className={cx('history-icon')} />
                    Lịch sử bài kiểm tra
                </h2>

                <motion.table className={cx('history-table')} variants={tableVariants}>
                    <thead>
                        <tr>
                            <th>Chủ đề</th>
                            <th>Ngày</th>
                            <th>Số câu hỏi</th>
                            <th>Loại</th>
                            <th>Điểm</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizHistory.length > 0 ? (
                            [...quizHistory]
                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                .map((quiz) => (
                                    <motion.tr key={quiz.id} variants={rowVariants}>
                                        <td>{quiz.subjectName}</td>
                                        <td>{new Date(quiz.createdAt).toLocaleDateString('vi-VN')}</td>
                                        <td>{quiz.totalQuestions}</td>
                                        <td>{quiz.type}</td>
                                        <td>
                                            <span
                                                className={cx('score', {
                                                    excellent: quiz.score >= 85,
                                                    good: quiz.score >= 70 && quiz.score < 85,
                                                    average: quiz.score < 70,
                                                })}
                                            >
                                                {Math.round(quiz.score)}%
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className={cx('detail-button')}
                                                onClick={() => handleOpenModal(quiz)}
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                        ) : (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center' }}>
                                    Chưa có lịch sử bài kiểm tra
                                </td>
                            </tr>
                        )}
                    </tbody>
                </motion.table>
            </motion.div>

            {/* Quiz Detail Modal */}
            {modalOpen && (
                <div className={cx('modal-overlay')} onClick={handleCloseModal}>
                    <div className={cx('modal-content')} onClick={(e) => e.stopPropagation()}>
                        {selectedQuiz && (
                            <>
                                <h2 className={cx('modal-title')}>Chi tiết bài kiểm tra: {selectedQuiz.subjectName}</h2>
                                <p className={cx('modal-subtitle')}>
                                    Ngày tạo: {new Date(selectedQuiz.createdAt).toLocaleDateString('vi-VN')}
                                </p>
                                <p className={cx('modal-subtitle')}>
                                    Điểm số: {Math.round(selectedQuiz.score)}% (
                                    {Math.round((selectedQuiz.score * selectedQuiz.totalQuestions) / 100)}/
                                    {selectedQuiz.totalQuestions} câu đúng)
                                </p>
                                <div className={cx('modal-divider')}></div>

                                <h3 className={cx('question-section-title')}>Danh sách câu hỏi:</h3>

                                <div className={cx('questions-list')}>
                                    {selectedQuiz.gradeQuestions.map((item, index) => (
                                        <div
                                            key={index}
                                            className={cx('question-item', {
                                                correct: item.userAnswer === item.question.correctAnswer,
                                                incorrect: item.userAnswer !== item.question.correctAnswer,
                                            })}
                                        >
                                            <h4 className={cx('question-text')}>
                                                Câu hỏi {index + 1}: {item.question.question}
                                            </h4>

                                            <div className={cx('options-list')}>
                                                {Object.entries(item.question.options).map(([key, value]) => (
                                                    <div
                                                        key={key}
                                                        className={cx('option-item', {
                                                            'correct-answer': key === item.question.correctAnswer,
                                                            'wrong-answer':
                                                                key === item.userAnswer &&
                                                                key !== item.question.correctAnswer,
                                                            selected: key === item.userAnswer,
                                                        })}
                                                    >
                                                        <span className={cx('option-key')}>{key}:</span> {value}
                                                        {key === item.question.correctAnswer && (
                                                            <Check className={cx('icon-check')} />
                                                        )}
                                                        {key === item.userAnswer &&
                                                            key !== item.question.correctAnswer && (
                                                                <Close className={cx('icon-wrong')} />
                                                            )}
                                                    </div>
                                                ))}
                                            </div>

                                            <p className={cx('user-answer')}>
                                                Đáp án của bạn: {item.userAnswer}
                                                {item.userAnswer === item.question.correctAnswer
                                                    ? ' (Đúng)'
                                                    : ` (Sai - Đáp án đúng: ${item.question.correctAnswer})`}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className={cx('modal-footer')}>
                                    <button className={cx('close-button')} onClick={handleCloseModal}>
                                        Đóng
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
