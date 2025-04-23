import classNames from 'classnames/bind';
import styles from './GroupStudyHome.module.scss';
import { 
  Groups, 
  Assignment, 
  Forum, 
  VideoCameraFront, 
  CalendarMonth, 
  Storage, 
  School
} from '@mui/icons-material';
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

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};
    
export default function GroupStudyHome() {
  return (
    <div className={cx('group-study-home')}>
      <motion.div 
        className={cx('hero-section')}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.6 }}
      >
        <h1>Group Study</h1>
        <p>Học tập cùng nhau, thành công cùng nhau</p>
      </motion.div>

      <motion.div 
        className={cx('features-container')}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        <h2>Các tính năng nổi bật</h2>
        
        <motion.div 
          className={cx('features-grid')}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div className={cx('feature-card')} variants={cardVariant}>
            <Groups className={cx('feature-icon')} />
            <h3>Nhóm học tập</h3>
            <p>Tạo và tham gia các nhóm học tập với bạn bè hoặc sinh viên cùng ngành</p>
          </motion.div>

          <motion.div className={cx('feature-card')} variants={cardVariant}>
            <Assignment className={cx('feature-icon')} />
            <h3>Bài tập nhóm</h3>
            <p>Quản lý, phân công và nộp bài tập nhóm một cách hiệu quả</p>
          </motion.div>

          <motion.div className={cx('feature-card')} variants={cardVariant}>
            <Forum className={cx('feature-icon')} />
            <h3>Thảo luận</h3>
            <p>Thảo luận về các vấn đề học tập và chia sẻ kiến thức với nhau</p>
          </motion.div>

          <motion.div className={cx('feature-card')} variants={cardVariant}>
            <VideoCameraFront className={cx('feature-icon')} />
            <h3>Họp nhóm trực tuyến</h3>
            <p>Tổ chức các cuộc họp trực tuyến để thảo luận và làm việc nhóm</p>
          </motion.div>

          <motion.div className={cx('feature-card')} variants={cardVariant}>
            <CalendarMonth className={cx('feature-icon')} />
            <h3>Lịch học nhóm</h3>
            <p>Lên kế hoạch và quản lý lịch học cùng nhau dễ dàng</p>
          </motion.div>

          <motion.div className={cx('feature-card')} variants={cardVariant}>
            <Storage className={cx('feature-icon')} />
            <h3>Chia sẻ tài liệu</h3>
            <p>Chia sẻ và quản lý tài liệu học tập trong nhóm</p>
          </motion.div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className={cx('benefits-section')}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        <h2>Lợi ích của việc học nhóm</h2>
        
        <motion.div 
          className={cx('benefits-list')}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div className={cx('benefit-item')} variants={cardVariant}>
            <School className={cx('benefit-icon')} />
            <div>
              <h3>Nâng cao hiệu quả học tập</h3>
              <p>Học cùng nhau giúp hiểu sâu hơn và ghi nhớ kiến thức tốt hơn</p>
            </div>
          </motion.div>
          
          <motion.div className={cx('benefit-item')} variants={cardVariant}>
            <School className={cx('benefit-icon')} />
            <div>
              <h3>Phát triển kỹ năng mềm</h3>
              <p>Rèn luyện kỹ năng làm việc nhóm, giao tiếp và giải quyết vấn đề</p>
            </div>
          </motion.div>
          
          <motion.div className={cx('benefit-item')} variants={cardVariant}>
            <School className={cx('benefit-icon')} />
            <div>
              <h3>Mở rộng mạng lưới</h3>
              <p>Kết nối với những người học cùng lĩnh vực và mở rộng mạng lưới của bạn</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className={cx('cta-section')}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        <h2>Sẵn sàng để bắt đầu?</h2>
        <p>Tham gia học nhóm ngay hôm nay để cùng nhau đạt được thành công</p>
        <motion.button 
          className={cx('cta-button')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Bắt đầu ngay
        </motion.button>
      </motion.div>
    </div>
  );
}
