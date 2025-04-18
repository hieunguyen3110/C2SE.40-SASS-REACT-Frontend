import styles from './AIQuizHome.module.scss';
import classNames from 'classnames/bind';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Psychology, School, SmartToy, AutoAwesome, FlashOn } from '@mui/icons-material';
import aiQuizIllustration from '../../../assets/images/ai-quiz-illustration.svg';
import { motion } from 'framer-motion';

const cx = classNames.bind(styles);

// Animation variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function AIQuizHome() {
    const navigate = useNavigate();

    const handleStartQuiz = () => {
        navigate('/document/ai-quiz/knowledge-test');
    };

    return (
        <motion.div 
            className={cx('ai-quiz-home')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <motion.header 
                className={cx('hero-section')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div 
                    className={cx('hero-content')}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <motion.h1 
                        className={cx('title')}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Psychology className={cx('icon')} />
                        AI Quiz Generator
                    </motion.h1>
                    <motion.p 
                        className={cx('subtitle')}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        Tạo bài kiểm tra thông minh với sức mạnh của trí tuệ nhân tạo
                    </motion.p>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button 
                            variant="contained" 
                            className={cx('start-button')}
                            onClick={handleStartQuiz}
                        >
                            Bắt đầu ngay
                        </Button>
                    </motion.div>
                </motion.div>
                <motion.div 
                    className={cx('hero-image')}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <motion.img 
                        src={aiQuizIllustration} 
                        alt="AI Quiz Generator"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 100 }}
                    />
                </motion.div>
            </motion.header>

            <motion.section 
                className={cx('features-section')}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <motion.h2 
                    className={cx('section-title')}
                    variants={fadeIn}
                >
                    Tính năng nổi bật
                </motion.h2>
                <motion.div 
                    className={cx('features-grid')}
                    variants={staggerContainer}
                >
                    <motion.div 
                        className={cx('feature-card')}
                        variants={fadeIn}
                        whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                        transition={{ duration: 0.3 }}
                    >
                        <FlashOn className={cx('feature-icon')} />
                        <h3 className={cx('feature-title')}>Tạo quiz nhanh chóng</h3>
                        <p className={cx('feature-description')}>
                            Tạo bài kiểm tra chỉ trong vài giây bằng cách nhập chủ đề hoặc tải tài liệu lên
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        className={cx('feature-card')}
                        variants={fadeIn}
                        whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                        transition={{ duration: 0.3 }}
                    >
                        <SmartToy className={cx('feature-icon')} />
                        <h3 className={cx('feature-title')}>Câu hỏi thông minh</h3>
                        <p className={cx('feature-description')}>
                            AI phân tích và tạo câu hỏi phù hợp với trình độ và mục tiêu học tập
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        className={cx('feature-card')}
                        variants={fadeIn}
                        whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                        transition={{ duration: 0.3 }}
                    >
                        <School className={cx('feature-icon')} />
                        <h3 className={cx('feature-title')}>Nhiều dạng câu hỏi</h3>
                        <p className={cx('feature-description')}>
                            Hỗ trợ đa dạng câu hỏi: trắc nghiệm, đúng/sai, nối đáp án và nhiều hơn nữa
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        className={cx('feature-card')}
                        variants={fadeIn}
                        whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                        transition={{ duration: 0.3 }}
                    >
                        <AutoAwesome className={cx('feature-icon')} />
                        <h3 className={cx('feature-title')}>Tùy chỉnh linh hoạt</h3>
                        <p className={cx('feature-description')}>
                            Điều chỉnh độ khó, thời gian, số lượng câu hỏi và nhiều tùy chọn khác
                        </p>
                    </motion.div>
                </motion.div>
            </motion.section>

            <motion.section 
                className={cx('how-it-works')}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeIn}
                transition={{ duration: 0.5 }}
            >
                <motion.h2 
                    className={cx('section-title')}
                    variants={fadeIn}
                >
                    Cách thức hoạt động
                </motion.h2>
                <motion.div 
                    className={cx('steps-container')}
                    variants={staggerContainer}
                >
                    <motion.div 
                        className={cx('step')}
                        variants={fadeIn}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div 
                            className={cx('step-number')}
                            whileHover={{ 
                                scale: 1.1, 
                                rotate: 10,
                                transition: { duration: 0.2 }
                            }}
                        >
                            1
                        </motion.div>
                        <h3 className={cx('step-title')}>Chọn chủ đề hoặc tải tài liệu</h3>
                        <p className={cx('step-description')}>
                            Nhập chủ đề bạn muốn kiểm tra hoặc tải lên tài liệu học tập của bạn
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        className={cx('step')}
                        variants={fadeIn}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div 
                            className={cx('step-number')}
                            whileHover={{ 
                                scale: 1.1, 
                                rotate: 10,
                                transition: { duration: 0.2 }
                            }}
                        >
                            2
                        </motion.div>
                        <h3 className={cx('step-title')}>Tùy chỉnh bài kiểm tra</h3>
                        <p className={cx('step-description')}>
                            Điều chỉnh số lượng câu hỏi, mức độ khó, loại câu hỏi và thời gian làm bài
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        className={cx('step')}
                        variants={fadeIn}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div 
                            className={cx('step-number')}
                            whileHover={{ 
                                scale: 1.1, 
                                rotate: 10,
                                transition: { duration: 0.2 }
                            }}
                        >
                            3
                        </motion.div>
                        <h3 className={cx('step-title')}>Làm bài và nhận kết quả</h3>
                        <p className={cx('step-description')}>
                            Hoàn thành bài kiểm tra và nhận phân tích chi tiết về hiệu suất của bạn
                        </p>
                    </motion.div>
                </motion.div>
            </motion.section>

            <motion.section 
                className={cx('cta-section')}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div 
                    className={cx('cta-content')}
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <motion.h2 
                        className={cx('cta-title')}
                        initial={{ y: -20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        Sẵn sàng kiểm tra kiến thức của bạn?
                    </motion.h2>
                    <motion.p 
                        className={cx('cta-description')}
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        Tạo bài kiểm tra AI ngay hôm nay và cải thiện việc học tập của bạn
                    </motion.p>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button 
                            variant="contained" 
                            className={cx('cta-button')}
                            onClick={handleStartQuiz}
                        >
                            Tạo AI Quiz
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.section>
        </motion.div>
    );
}
