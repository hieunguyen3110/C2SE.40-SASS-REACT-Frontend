import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AnalyzeLearningModal.module.scss';
import { motion } from 'framer-motion';
import { 
    AccessTime, 
    Psychology, 
    Smartphone, 
    NightsStay,
    Close,
    CheckCircle
} from '@mui/icons-material';

const cx = classNames.bind(styles);

interface AnalyzeLearningModalProps {
    onClose?: () => void;
}

export default function AnalyzeLearningModal({ onClose }: AnalyzeLearningModalProps) {
    const [learningStyle, setLearningStyle] = useState('Kinesthetic');
    const [studyHours, setStudyHours] = useState('12');
    const [socialMedia, setSocialMedia] = useState('20');
    const [sleepHours, setSleepHours] = useState('4');
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleAnalyze = () => {
        // Handle analysis logic here
        console.log('Đang phân tích phương pháp học tập...');
    };

    return (
        <motion.div 
            className={cx('wrapper')}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            {onClose && (
                <button className={cx('close-button')} onClick={onClose}>
                    <Close />
                </button>
            )}
            
            <motion.h1 
                className={cx('title')}
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Đánh giá học tập
            </motion.h1>
            <p className={cx('subtitle')}>Hãy phân tích các mô hình học tập của bạn để tạo ra một lộ trình cá nhân hóa</p>
            
            <p className={cx('description')}>
                Những thông tin này sẽ được chúng tôi sử dụng để phân tích và đánh giá kết quả học tập của bạn, 
                từ đó đưa ra những giải pháp học tập phù hợp nhằm hỗ trợ bạn nâng cao kết quả và phát huy tối đa tiềm năng của mình.
            </p>
            
            <div className={cx('form-grid')}>
                <motion.div 
                    className={cx('input-container')}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                >
                    <div className={cx('input-label')}>
                        <AccessTime className={cx('icon')} />
                        <span>Số giờ học mỗi tuần</span>
                    </div>
                    <input 
                        type="number" 
                        value={studyHours}
                        onChange={(e) => setStudyHours(e.target.value)}
                        className={cx('input-field')}
                    />
                </motion.div>
                
                <motion.div 
                    className={cx('input-container')}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                >
                    <div className={cx('input-label')}>
                        <Psychology className={cx('icon')} />
                        <span>Phương pháp học ưa thích</span>
                    </div>
                    <select 
                        value={learningStyle}
                        onChange={(e) => setLearningStyle(e.target.value)}
                        className={cx('input-field')}
                    >
                        <option value="Visual">Thị giác</option>
                        <option value="Auditory">Thính giác</option>
                        <option value="Kinesthetic">Vận động</option>
                        <option value="Reading/Writing">Đọc/Viết</option>
                    </select>
                </motion.div>
                
                <motion.div 
                    className={cx('input-container')}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                >
                    <div className={cx('input-label')}>
                        <Smartphone className={cx('icon')} />
                        <span>Thời gian dùng mạng xã hội (giờ/tuần)</span>
                    </div>
                    <input 
                        type="number" 
                        value={socialMedia}
                        onChange={(e) => setSocialMedia(e.target.value)}
                        className={cx('input-field')}
                    />
                </motion.div>
                
                <motion.div 
                    className={cx('input-container')}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                >
                    <div className={cx('input-label')}>
                        <NightsStay className={cx('icon')} />
                        <span>Số giờ ngủ mỗi đêm</span>
                    </div>
                    <input 
                        type="number" 
                        value={sleepHours}
                        onChange={(e) => setSleepHours(e.target.value)}
                        className={cx('input-field')}
                    />
                </motion.div>
            </div>
            
            <div className={cx('confirm-section')}>
                <label className={cx('confirm-label')}>
                    <input 
                        type="checkbox" 
                        checked={isConfirmed}
                        onChange={(e) => setIsConfirmed(e.target.checked)}
                        className={cx('confirm-checkbox')}
                    />
                    <span className={cx('confirm-text')}>
                        Tôi xác nhận những thông tin trên là chính xác
                    </span>
                </label>
            </div>
            
            {isConfirmed ? (
                <motion.button 
                    className={cx('analyze-button')}
                    onClick={handleAnalyze}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <CheckCircle className={cx('button-icon')} />
                    Phân tích phương pháp học tập
                </motion.button>
            ) : (
                <button 
                    className={cx('analyze-button-disabled')}
                    disabled
                >
                    Phân tích phương pháp học tập
                </button>
            )}
        </motion.div>
    );
}
