import styles from './LearningStatistics.module.scss';
import classNames from 'classnames/bind';
import { Timeline, LibraryBooks, AccessTime, History } from '@mui/icons-material';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';

const cx = classNames.bind(styles);

export default function LearningStatistics() {
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
                    <div className={cx('stat-value')}>85%</div>
                </motion.div>

                <motion.div className={cx('stat-card')} variants={cardVariants}>
                    <LibraryBooks className={cx('stat-icon')} />
                    <div className={cx('stat-label')}>Số bài đã hoàn thành</div>
                    <div className={cx('stat-value')}>3</div>
                </motion.div>

                <motion.div className={cx('stat-card')} variants={cardVariants}>
                    <AccessTime className={cx('stat-icon')} />
                    <div className={cx('stat-label')}>Thời gian học tập</div>
                    <div className={cx('stat-value')}>2.25 giờ</div>
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
                            <th>Thời gian làm bài</th>
                            <th>Điểm</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <motion.tr variants={rowVariants}>
                            <td>Toán học</td>
                            <td>2023-10-15</td>
                            <td>25</td>
                            <td>45 phút</td>
                            <td>
                                <span className={cx('score', 'good')}>85%</span>
                            </td>
                            <td>
                                <Button size="small" variant="outlined">
                                    Xem chi tiết
                                </Button>
                            </td>
                        </motion.tr>
                        <motion.tr variants={rowVariants}>
                            <td>Vật lý</td>
                            <td>2023-10-10</td>
                            <td>20</td>
                            <td>30 phút</td>
                            <td>
                                <span className={cx('score', 'average')}>78%</span>
                            </td>
                            <td>
                                <Button size="small" variant="outlined">
                                    Xem chi tiết
                                </Button>
                            </td>
                        </motion.tr>
                        <motion.tr variants={rowVariants}>
                            <td>Khoa học máy tính</td>
                            <td>2023-10-05</td>
                            <td>30</td>
                            <td>60 phút</td>
                            <td>
                                <span className={cx('score', 'excellent')}>92%</span>
                            </td>
                            <td>
                                <Button size="small" variant="outlined">
                                    Xem chi tiết
                                </Button>
                            </td>
                        </motion.tr>
                    </tbody>
                </motion.table>
            </motion.div>
        </motion.div>
    );
}
