import classNames from 'classnames/bind';
import styles from './AdminHomeView.module.scss';
const cx = classNames.bind(styles);
import { Statistics } from '../components/Statistics';
import Chart from '../components/Chart/Chart';
import { motion } from 'framer-motion';

export default function AdminHomeView() {
    return (
        <motion.div 
            className={cx('admin-home-view')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className={cx('header')}>
                <motion.h1 
                    className={cx('title')}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    Tổng quan hệ thống
                </motion.h1>
                <motion.p 
                    className={cx('subtitle')}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    Thống kê và theo dõi hoạt động của hệ thống DTU Dashboard
                </motion.p>
            </div>
            
            <motion.div 
                className={cx('dashboard-content')}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                <Statistics />
                <div className={cx('charts-container')}>
                    <Chart />
                </div>
            </motion.div>
        </motion.div>
    );
}
