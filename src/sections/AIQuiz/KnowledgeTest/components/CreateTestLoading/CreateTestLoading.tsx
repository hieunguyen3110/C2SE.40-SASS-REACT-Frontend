import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import styles from './CreateTestLoading.module.scss';

const cx = classNames.bind(styles);

export default function CreateTestLoading() {
    return (
        <div className={cx('create-test-loading')}>
            <h1 className={cx('title')}>Đang tạo bài thi mới</h1>
            <p className={cx('subtitle')}>AI đang tạo bài thi cho bạn</p>
            
            <div className={cx('loader-container')}>
                <motion.div 
                    className={cx('spinner')}
                    animate={{ rotate: 360 }}
                    transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: "linear" 
                    }}
                />
            </div>
            
            <h2 className={cx('section-title')}>Tạo bài thi của bạn</h2>
            <p className={cx('description')}>
                AI của chúng tôi đang tạo ra các câu hỏi chất lượng cao, không lặp 
                lại dựa trên các nguồn tài nguyên web để bạn đánh giá...
            </p>
        </div>
    );
}
