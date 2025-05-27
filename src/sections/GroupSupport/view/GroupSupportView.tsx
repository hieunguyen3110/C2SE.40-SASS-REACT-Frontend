import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './GroupSupportView.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ExpandMore, 
    ArrowForward, 
    School, 
    Groups, 
    Forum, 
    QueryBuilder, 
} from '@mui/icons-material';

const cx = classNames.bind(styles);

// Mock FAQ data
const faqData = [
    {
        id: 1,
        question: 'Làm thế nào để tạo một nhóm học tập mới?',
        answer: 'Để tạo một nhóm học tập mới, hãy điều hướng đến phần Group Study trong thanh bên, sau đó nhấp vào nút "Tạo nhóm". Điền các thông tin cần thiết bao gồm tên nhóm, mô tả và cài đặt quyền riêng tư, sau đó nhấp vào "Tạo". Sau đó, bạn có thể mời các thành viên tham gia nhóm của mình.'
    },
    {
        id: 2,
        question: 'Tôi có thể thêm bao nhiêu thành viên vào nhóm học tập của mình?',
        answer: 'Các nhóm học tập tiêu chuẩn có thể có tối đa 50 thành viên. Nếu bạn cần đáp ứng nhiều người tham gia hơn cho các mục đích đặc biệt như các khóa học lớn hoặc hội thảo, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi để được hỗ trợ mở rộng sức chứa nhóm.'
    },
    {
        id: 3,
        question: 'Tôi có thể lên lịch các buổi học định kỳ không?',
        answer: 'Có, khi tạo buổi học, hãy chọn tùy chọn "Định kỳ" và chọn mẫu lịch trình ưa thích của bạn (hàng ngày, hàng tuần, hàng tháng). Bạn có thể đặt ngày kết thúc hoặc giới hạn số lần diễn ra. Tất cả các thành viên trong nhóm sẽ được thông báo về các buổi học đã lên lịch.'
    },
    {
        id: 4,
        question: 'Quyền hạn đối với tệp hoạt động như thế nào trong nhóm học tập?',
        answer: 'Quản trị viên nhóm có thể đặt quyền hạn đối với tệp cho nhóm. Các tùy chọn bao gồm "Chỉ xem" nơi thành viên chỉ có thể đọc tệp, "Bình luận" cho phép thành viên để lại bình luận nhưng không chỉnh sửa, và "Chỉnh sửa" cung cấp quyền truy cập chỉnh sửa đầy đủ. Mỗi tệp có thể có cài đặt quyền khác nhau.'
    },
    {
        id: 5,
        question: 'Làm thế nào để kiểm duyệt các cuộc thảo luận trong nhóm của tôi?',
        answer: 'Với tư cách là quản trị viên hoặc người điều hành nhóm, bạn có thể ghim tin nhắn quan trọng, xóa nội dung không phù hợp và tắt tiếng thành viên gây rối. Để truy cập các tùy chọn này, di chuột qua tin nhắn hoặc người dùng và nhấp vào menu ba chấm để xem các hành động có sẵn.'
    }
];

// Mock resources data
const resourcesData = [
    {
        id: 1,
        title: 'Kỹ thuật học nhóm hiệu quả',
        description: 'Tìm hiểu các chiến lược đã được chứng minh để tối đa hóa năng suất trong các nhóm học tập của bạn.',
        image: 'https://www.euroschoolindia.com/blogs/wp-content/uploads/2023/07/student-study-group.jpg',
        link: '#'
    },
    {
        id: 2,
        title: 'Hướng dẫn nhóm học trực tuyến',
        description: 'Mẹo và công cụ để quản lý các buổi học trực tuyến một cách hiệu quả.',
        image: 'https://www.euroschoolindia.com/blogs/wp-content/uploads/2023/07/student-study-group.jpg',
        link: '#'
    },
    {
        id: 3,
        title: 'Phương pháp ghi chú cộng tác',
        description: 'Kỹ thuật ghi chú cộng tác hiệu quả trong môi trường nhóm.',
        image: 'https://www.euroschoolindia.com/blogs/wp-content/uploads/2023/07/student-study-group.jpg',
        link: '#'
    }
];

export default function GroupSupportView() {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        supportType: '',
        message: ''
    });

    const toggleFaq = (id: number) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission - this would typically connect to your API
        console.log('Form submitted:', formData);
        // Reset form or show success message
        alert('Yêu cầu hỗ trợ của bạn đã được gửi đi. Chúng tôi sẽ liên hệ với bạn sớm!');
        setFormData({
            name: '',
            email: '',
            supportType: '',
            message: ''
        });
    };

    return (
        <div className={cx('groupSupportView')}>
            <motion.header 
                className={cx('header')}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className={cx('title')}>
                    Trung tâm <span>Hỗ trợ Nhóm học tập</span>
                </h1>
                <p className={cx('subtitle')}>
                    Tìm câu trả lời cho các câu hỏi thường gặp về tính năng nhóm học tập, hoặc liên hệ với đội ngũ hỗ trợ của chúng tôi để được hỗ trợ cá nhân.
                </p>
            </motion.header>

            <div className={cx('content')}>
                {/* FAQ Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <h2 className={cx('sectionTitle')}>Câu hỏi thường gặp</h2>
                    <div className={cx('faqSection')}>
                        {faqData.map((faq) => (
                            <div key={faq.id} className={cx('faqItem')}>
                                <div 
                                    className={cx('questionArea')} 
                                    onClick={() => toggleFaq(faq.id)}
                                >
                                    <h3 className={cx('question')}>{faq.question}</h3>
                                    <ExpandMore 
                                        className={cx('expandIcon', { expanded: expandedFaq === faq.id })} 
                                    />
                                </div>
                                <AnimatePresence>
                                    {expandedFaq === faq.id && (
                                        <motion.div 
                                            className={cx('answerArea')}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <p className={cx('answer')}>{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Resources Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className={cx('sectionTitle')}>Tài nguyên hữu ích</h2>
                    <div className={cx('resourcesSection')}>
                        {resourcesData.map((resource, index) => (
                            <motion.div 
                                key={resource.id} 
                                className={cx('resourceCard')}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                            >
                                <div className={cx('resourceImageContainer')}>
                                    <img 
                                        src={resource.image} 
                                        alt={resource.title} 
                                        className={cx('resourceImage')} 
                                    />
                                </div>
                                <div className={cx('resourceContent')}>
                                    <h3 className={cx('resourceTitle')}>{resource.title}</h3>
                                    <p className={cx('resourceDescription')}>{resource.description}</p>
                                    <a href={resource.link} className={cx('resourceButton')}>
                                        Tìm hiểu thêm <ArrowForward fontSize="small" />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Quick Help Links */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h2 className={cx('sectionTitle')}>Chủ đề trợ giúp nhanh</h2>
                    <div className={cx('resourcesSection')}>
                        <motion.div 
                            className={cx('resourceCard')}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className={cx('resourceContent')}>
                                <School style={{ color: '#ff3c3c', fontSize: 32, marginBottom: 10 }} />
                                <h3 className={cx('resourceTitle')}>Bắt đầu</h3>
                                <p className={cx('resourceDescription')}>
                                    Tìm hiểu cơ bản về việc tạo và tham gia nhóm học tập để hợp tác học thuật.
                                </p>
                                <a href="#" className={cx('resourceButton')}>
                                    Xem hướng dẫn <ArrowForward fontSize="small" />
                                </a>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            className={cx('resourceCard')}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className={cx('resourceContent')}>
                                <Groups style={{ color: '#ff3c3c', fontSize: 32, marginBottom: 10 }} />
                                <h3 className={cx('resourceTitle')}>Quản lý nhóm</h3>
                                <p className={cx('resourceDescription')}>
                                    Công cụ và mẹo để quản lý hiệu quả thành viên và vai trò trong nhóm học tập.
                                </p>
                                <a href="#" className={cx('resourceButton')}>
                                    Xem hướng dẫn <ArrowForward fontSize="small" />
                                </a>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            className={cx('resourceCard')}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className={cx('resourceContent')}>
                                <Forum style={{ color: '#ff3c3c', fontSize: 32, marginBottom: 10 }} />
                                <h3 className={cx('resourceTitle')}>Tính năng thảo luận</h3>
                                <p className={cx('resourceDescription')}>
                                    Tìm hiểu cách sử dụng chat, diễn đàn thảo luận và các công cụ giao tiếp khác.
                                </p>
                                <a href="#" className={cx('resourceButton')}>
                                    Xem hướng dẫn <ArrowForward fontSize="small" />
                                </a>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            className={cx('resourceCard')}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className={cx('resourceContent')}>
                                <QueryBuilder style={{ color: '#ff3c3c', fontSize: 32, marginBottom: 10 }} />
                                <h3 className={cx('resourceTitle')}>Lên lịch các buổi học</h3>
                                <p className={cx('resourceDescription')}>
                                    Cách lên lịch, quản lý và nhắc nhở nhóm của bạn về các buổi học sắp tới.
                                </p>
                                <a href="#" className={cx('resourceButton')}>
                                    Xem hướng dẫn <ArrowForward fontSize="small" />
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Contact Form */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h2 className={cx('sectionTitle')}>Vẫn cần trợ giúp?</h2>
                    <div className={cx('contactSection')}>
                        <form className={cx('contactForm')} onSubmit={handleSubmit}>
                            <div className={cx('formGroup')}>
                                <label htmlFor="name">Họ và tên</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required 
                                    placeholder="Nhập họ và tên của bạn"
                                />
                            </div>
                            
                            <div className={cx('formGroup')}>
                                <label htmlFor="email">Địa chỉ Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="example@email.com" 
                                />
                            </div>
                            
                            <div className={cx('formGroup')}>
                                <label htmlFor="supportType">Bạn cần hỗ trợ về vấn đề gì?</label>
                                <select 
                                    id="supportType" 
                                    name="supportType" 
                                    value={formData.supportType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Chọn chủ đề</option>
                                    <option value="create">Tạo nhóm</option>
                                    <option value="join">Tham gia nhóm</option>
                                    <option value="invite">Mời thành viên</option>
                                    <option value="file">Chia sẻ tệp</option>
                                    <option value="chat">Chat và thảo luận</option>
                                    <option value="schedule">Lịch học</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>
                            
                            <div className={cx('formGroup')}>
                                <label htmlFor="message">Mô tả vấn đề của bạn</label>
                                <textarea 
                                    id="message" 
                                    name="message" 
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Vui lòng mô tả chi tiết vấn đề bạn đang gặp phải..."
                                ></textarea>
                            </div>
                            
                            <motion.button 
                                type="submit" 
                                className={cx('submitButton')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Gửi yêu cầu
                            </motion.button>
                        </form>
                    </div>
                </motion.section>
            </div>
        </div>
    );
} 