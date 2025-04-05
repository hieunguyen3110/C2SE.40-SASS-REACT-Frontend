import styles from './AIQuizHome.module.scss';
import classNames from 'classnames/bind';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Psychology, School, Quiz, SmartToy, AutoAwesome, FlashOn } from '@mui/icons-material';
import aiQuizIllustration from '../../../assets/images/ai-quiz-illustration.svg';

const cx = classNames.bind(styles);

export default function AIQuizHome() {
    const navigate = useNavigate();

    const handleStartQuiz = () => {
        navigate('/document/ai-quiz/knowledge-test');
    };

    return (
        <div className={cx('ai-quiz-home')}>
            <header className={cx('hero-section')}>
                <div className={cx('hero-content')}>
                    <h1 className={cx('title')}>
                        <Psychology className={cx('icon')} />
                        AI Quiz Generator
                    </h1>
                    <p className={cx('subtitle')}>Tạo bài kiểm tra thông minh với sức mạnh của trí tuệ nhân tạo</p>
                    <Button 
                        variant="contained" 
                        className={cx('start-button')}
                        onClick={handleStartQuiz}
                    >
                        Bắt đầu ngay
                    </Button>
                </div>
                <div className={cx('hero-image')}>
                    <img src={aiQuizIllustration} alt="AI Quiz Generator" />
                </div>
            </header>

            <section className={cx('features-section')}>
                <h2 className={cx('section-title')}>Tính năng nổi bật</h2>
                <div className={cx('features-grid')}>
                    <div className={cx('feature-card')}>
                        <FlashOn className={cx('feature-icon')} />
                        <h3 className={cx('feature-title')}>Tạo quiz nhanh chóng</h3>
                        <p className={cx('feature-description')}>
                            Tạo bài kiểm tra chỉ trong vài giây bằng cách nhập chủ đề hoặc tải tài liệu lên
                        </p>
                    </div>
                    
                    <div className={cx('feature-card')}>
                        <SmartToy className={cx('feature-icon')} />
                        <h3 className={cx('feature-title')}>Câu hỏi thông minh</h3>
                        <p className={cx('feature-description')}>
                            AI phân tích và tạo câu hỏi phù hợp với trình độ và mục tiêu học tập
                        </p>
                    </div>
                    
                    <div className={cx('feature-card')}>
                        <School className={cx('feature-icon')} />
                        <h3 className={cx('feature-title')}>Nhiều dạng câu hỏi</h3>
                        <p className={cx('feature-description')}>
                            Hỗ trợ đa dạng câu hỏi: trắc nghiệm, đúng/sai, nối đáp án và nhiều hơn nữa
                        </p>
                    </div>
                    
                    <div className={cx('feature-card')}>
                        <AutoAwesome className={cx('feature-icon')} />
                        <h3 className={cx('feature-title')}>Tùy chỉnh linh hoạt</h3>
                        <p className={cx('feature-description')}>
                            Điều chỉnh độ khó, thời gian, số lượng câu hỏi và nhiều tùy chọn khác
                        </p>
                    </div>
                </div>
            </section>

            <section className={cx('how-it-works')}>
                <h2 className={cx('section-title')}>Cách thức hoạt động</h2>
                <div className={cx('steps-container')}>
                    <div className={cx('step')}>
                        <div className={cx('step-number')}>1</div>
                        <h3 className={cx('step-title')}>Chọn chủ đề hoặc tải tài liệu</h3>
                        <p className={cx('step-description')}>
                            Nhập chủ đề bạn muốn kiểm tra hoặc tải lên tài liệu học tập của bạn
                        </p>
                    </div>
                    
                    <div className={cx('step')}>
                        <div className={cx('step-number')}>2</div>
                        <h3 className={cx('step-title')}>Tùy chỉnh bài kiểm tra</h3>
                        <p className={cx('step-description')}>
                            Điều chỉnh số lượng câu hỏi, mức độ khó, loại câu hỏi và thời gian làm bài
                        </p>
                    </div>
                    
                    <div className={cx('step')}>
                        <div className={cx('step-number')}>3</div>
                        <h3 className={cx('step-title')}>Làm bài và nhận kết quả</h3>
                        <p className={cx('step-description')}>
                            Hoàn thành bài kiểm tra và nhận phân tích chi tiết về hiệu suất của bạn
                        </p>
                    </div>
                </div>
            </section>

            <section className={cx('cta-section')}>
                <div className={cx('cta-content')}>
                    <h2 className={cx('cta-title')}>Sẵn sàng kiểm tra kiến thức của bạn?</h2>
                    <p className={cx('cta-description')}>
                        Tạo bài kiểm tra AI ngay hôm nay và cải thiện việc học tập của bạn
                    </p>
                    <Button 
                        variant="contained" 
                        className={cx('cta-button')}
                        onClick={handleStartQuiz}
                    >
                        Tạo AI Quiz
                    </Button>
                </div>
            </section>
        </div>
    );
}
