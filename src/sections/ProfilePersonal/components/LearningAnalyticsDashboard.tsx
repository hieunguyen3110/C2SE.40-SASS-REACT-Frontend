import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import classnames from 'classnames/bind';
import styles from './LearningAnalyticsDashboard.module.scss';
import SubjectSelectionModal from './SubjectSelectionModal';
import { SubjectDto } from '../../../types/groupStudy.types';
import { toast } from 'react-toastify';

// Only keep MUI icons
import {
    Assignment,
    Timeline,
    Warning,
    Book,
    TrendingUp,
    AutoGraph,
    Check,
    School,
    Lightbulb,
    Schedule,
    TrendingDown,
    KeyboardArrowDown,
    KeyboardArrowUp,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
    enableLearningAnalyticsAction,
    disableLearningAnalyticsAction,
    saveCoursePeriodAction,
} from '../../../redux/ProfilePersonalSlice/ProfilePersonalSlice';
import { AppDispatch } from '../../../redux/store';

// Import sample analytics data (will be replaced with API call later)
import sampleAnalyticsData from './samleAnalyzeData.json';
import { AnalyticsData } from '../../../types/learningAnalytics.types';

const cx = classnames.bind(styles);

// Animation variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const LearningAnalyticsDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState<boolean>(false);
    const [showSubjectModal, setShowSubjectModal] = useState<boolean>(false);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Expanded state for collapsible sections
    const [expandedSections, setExpandedSections] = useState({
        overview: true,
        strengths: true,
        weaknesses: true,
        metrics: true,
        suggestions: true,
        adjustments: true,
    });

    const { getUserProfile, error } = useSelector((state: RootState) => state.profilePersonal);
    const dispatch = useDispatch<AppDispatch>();

    const handleTabChange = (tabIndex: number) => {
        setActiveTab(tabIndex);
    };

    const toggleSection = (section: string) => {
        setExpandedSections({
            ...expandedSections,
            [section]: !expandedSections[section as keyof typeof expandedSections],
        });
    };

    // Fetch analytics data (mock implementation using sample data)
    const fetchAnalyticsData = async () => {
        setIsLoading(true);
        try {
            // This will be replaced with an actual API call in the future
            setTimeout(() => {
                setAnalyticsData(sampleAnalyticsData as unknown as AnalyticsData);
                setIsLoading(false);
            }, 500);
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            toast.error('Không thể tải dữ liệu phân tích. Vui lòng thử lại sau.');
            setIsLoading(false);
        }
    };

    const handleStatusChange = () => {
        if (!isAnalyticsEnabled) {
            // Dispatch enable action right away when showing the modal
            dispatch(enableLearningAnalyticsAction());
            if (!getUserProfile?.coursePeriodDto) {
                setShowSubjectModal(true);
            } else {
                fetchAnalyticsData();

                setIsAnalyticsEnabled(true);
                toast.success('Phân tích học tập đã được bật');
            }
        } else {
            // If turning off analytics
            dispatch(disableLearningAnalyticsAction());
            setIsAnalyticsEnabled(false);
            toast.info('Phân tích học tập đã được tắt');
        }
    };

    const handleSubjectSelection = (subjects: SubjectDto[]) => {
        if (subjects.length > 0 && !getUserProfile?.coursePeriodDto) {
            dispatch(saveCoursePeriodAction(subjects));
            setIsAnalyticsEnabled(true);
            toast.success('Phân tích học tập đã được bật');
            // Fetch analytics data after enabling
            fetchAnalyticsData();
        }
    };

    const handleModalClose = () => {
        // If the user cancels the modal without selecting subjects
        dispatch(disableLearningAnalyticsAction());
        setShowSubjectModal(false);
    };

    useEffect(() => {
        if (getUserProfile?.isEnableAnalyze) {
            setIsAnalyticsEnabled(getUserProfile.isEnableAnalyze);
            // Fetch analytics data if analytics is enabled
            fetchAnalyticsData();
        }
    }, [getUserProfile?.isEnableAnalyze]);

    // Get weak subjects from analytics data
    const getWeakSubjects = () => {
        if (!analyticsData || !analyticsData.subject_weakens) return [];
        return analyticsData.subject_weakens;
    };

    // Get recommended documents from analytics data
    const getRecommendedDocuments = () => {
        if (!analyticsData || !analyticsData.document_recommend) return [];
        return analyticsData.document_recommend;
    };

    // Get number of documents and average score
    const getDocumentStats = () => {
        const documents = getRecommendedDocuments();
        return {
            count: documents.length,
            avgScore: analyticsData?.subject_weakens?.[0]?.avg_score || 0,
        };
    };

    useEffect(() => {
        if (error === 'Lỗi khi lưu kỳ học') {
            dispatch(disableLearningAnalyticsAction());
            setIsAnalyticsEnabled(false);
        }
    }, [error]);

    // Collapsible section component
    const CollapsibleSection = ({
        title,
        children,
        id,
        iconColor = '#333',
    }: {
        title: string;
        children: React.ReactNode;
        id: string;
        iconColor?: string;
    }) => {
        const isExpanded = expandedSections[id as keyof typeof expandedSections];

        return (
            <div className={cx('collapsible-section')}>
                <div className={cx('section-header')} onClick={() => toggleSection(id)}>
                    <h5 style={{ color: iconColor }}>{title}</h5>
                    {isExpanded ? (
                        <KeyboardArrowUp className={cx('toggle-icon')} />
                    ) : (
                        <KeyboardArrowDown className={cx('toggle-icon')} />
                    )}
                </div>
                {isExpanded && <div className={cx('section-content')}>{children}</div>}
            </div>
        );
    };

    return (
        <motion.div className={cx('learning-analytics-dashboard')} initial="hidden" animate="visible" variants={fadeIn}>
            <div className={cx('dashboard-header')}>
                <h3>PHÂN TÍCH HỌC TẬP CÁ NHÂN</h3>
                <button onClick={handleStatusChange} className={cx('status-label', { enabled: isAnalyticsEnabled })}>
                    {isAnalyticsEnabled ? 'Tắt phân tích' : 'Bật phân tích'}
                </button>
            </div>

            {isLoading ? (
                <div className={cx('loading-state')}>
                    <p>Đang tải dữ liệu phân tích...</p>
                </div>
            ) : (
                <>
                    <motion.div className={cx('analytics-cards')} variants={staggerContainer}>
                        <motion.div className={cx('analytics-card')} variants={fadeIn}>
                            <div className={cx('card-icon')}>
                                <Assignment className={cx('icon')} />
                            </div>
                            <div className={cx('card-content')}>
                                <div className={cx('card-title')}>Tài liệu được gợi ý</div>
                                <div className={cx('card-value')}>{getDocumentStats().count}</div>
                                <div className={cx('card-info')}>Số lượng: {getDocumentStats().count}</div>
                                <div className={cx('card-info')}>
                                    Điểm trung bình: {getDocumentStats().avgScore.toFixed(1)}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div className={cx('analytics-card')} variants={fadeIn}>
                            <div className={cx('card-icon')}>
                                <TrendingDown className={cx('icon', 'warning')} />
                            </div>
                            <div className={cx('card-content')}>
                                <div className={cx('card-title')}>Môn học yếu</div>
                                <div className={cx('card-value')}>{getWeakSubjects().length}</div>
                                {getWeakSubjects().length > 0 ? (
                                    <>
                                        <div className={cx('card-info')}>
                                            {getWeakSubjects()[0].subject_name}:{' '}
                                            {getWeakSubjects()[0].avg_score.toFixed(1)}
                                        </div>
                                        <div className={cx('card-info')}>Cần cải thiện ngay!</div>
                                    </>
                                ) : (
                                    <div className={cx('card-info')}>Không có môn học nào cần cải thiện</div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div className={cx('analytics-card')} variants={fadeIn}>
                            <div className={cx('card-icon')}>
                                <Warning className={cx('icon', 'warning')} />
                            </div>
                            <div className={cx('card-content')}>
                                <div className={cx('card-title')}>Trạng thái học tập</div>
                                {isAnalyticsEnabled && analyticsData ? (
                                    <div className={cx('card-alert-important')}>
                                        <p>{analyticsData.general_assessment.risk_assessment.substring(0, 100)}...</p>
                                    </div>
                                ) : (
                                    <div className={cx('card-alert')}>
                                        <p>Vui lòng hoàn thành ít nhất 3 bài kiểm tra</p>
                                        <p>để có thể phân tích trạng thái học tập của bạn!</p>
                                    </div>
                                )}
                                <button className={cx('start-button')}>
                                    <TrendingUp />
                                    <span>Bắt đầu học tập</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>

                    <div className={cx('analytics-detail')}>
                        <h4>PHÂN TÍCH HỌC TẬP VÀ PHƯƠNG PHÁP HỌC DÀNH CHO BẠN</h4>
                        <div className={cx('divider')}></div>

                        <div className={cx('tabs')}>
                            <div className={cx('tab', { active: activeTab === 0 })} onClick={() => handleTabChange(0)}>
                                <Timeline />
                                <span>Phân tích học tập</span>
                            </div>
                            <div className={cx('tab', { active: activeTab === 1 })} onClick={() => handleTabChange(1)}>
                                <AutoGraph />
                                <span>Đề xuất phương pháp</span>
                            </div>
                            <div className={cx('tab', { active: activeTab === 2 })} onClick={() => handleTabChange(2)}>
                                <Book />
                                <span>Tài liệu gợi ý</span>
                            </div>
                            <div className={cx('tab', { active: activeTab === 3 })} onClick={() => handleTabChange(3)}>
                                <Schedule />
                                <span>Kế hoạch học tập</span>
                            </div>
                        </div>

                        <div className={cx('tab-content')}>
                            {activeTab === 0 && (
                                <div className={cx('tab-panel')}>
                                    {!isAnalyticsEnabled || !analyticsData ? (
                                        <div className={cx('info-alert')}>
                                            <h5>Thông tin phân tích</h5>
                                            <p>
                                                Hiện tại bạn cần hoàn thành ít nhất 3 bài tập hoặc bài thi để có thể xem
                                                phân tích chi tiết về quá trình học tập của mình.
                                            </p>
                                            <div className={cx('button-container')}>
                                                <button className={cx('primary-button')}>Xem danh sách bài tập</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <CollapsibleSection
                                                title="Đánh giá tổng quan"
                                                id="overview"
                                                iconColor="#5c6bc0"
                                            >
                                                <div className={cx('overview-content')}>
                                                    <p>{analyticsData.general_assessment.overall_status}</p>
                                                </div>
                                            </CollapsibleSection>

                                            <div className={cx('analysis-columns')}>
                                                <div className={cx('analysis-column')}>
                                                    <CollapsibleSection
                                                        title="Điểm mạnh"
                                                        id="strengths"
                                                        iconColor="#558b2f"
                                                    >
                                                        <div className={cx('analysis-item', 'strength')}>
                                                            <ul>
                                                                {analyticsData.general_assessment.strengths.map(
                                                                    (strength, index) => (
                                                                        <li key={index}>{strength}</li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </CollapsibleSection>
                                                </div>
                                                <div className={cx('analysis-column')}>
                                                    <CollapsibleSection
                                                        title="Điểm yếu"
                                                        id="weaknesses"
                                                        iconColor="#f57c00"
                                                    >
                                                        <div className={cx('analysis-item', 'weakness')}>
                                                            <ul>
                                                                {analyticsData.general_assessment.weaknesses.map(
                                                                    (weakness, index) => (
                                                                        <li key={index}>{weakness}</li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </CollapsibleSection>
                                                </div>
                                            </div>

                                            <CollapsibleSection
                                                title="Chỉ số cần theo dõi"
                                                id="metrics"
                                                iconColor="#5c6bc0"
                                            >
                                                <ul className={cx('metrics-list')}>
                                                    {analyticsData.progress_tracking.metrics_to_monitor.map(
                                                        (metric, index) => (
                                                            <li key={index}>{metric}</li>
                                                        ),
                                                    )}
                                                </ul>
                                            </CollapsibleSection>
                                        </>
                                    )}
                                </div>
                            )}

                            {activeTab === 1 && (
                                <div className={cx('tab-panel')}>
                                    {!isAnalyticsEnabled || !analyticsData ? (
                                        <div className={cx('info-alert')}>
                                            <h5>Phương pháp học tập</h5>
                                            <p>
                                                Dựa trên dữ liệu học tập, hệ thống sẽ đề xuất các phương pháp học tập
                                                phù hợp. Vui lòng hoàn thành thêm bài tập để nhận đề xuất chi tiết.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <CollapsibleSection
                                                title="Đề xuất cải thiện"
                                                id="suggestions"
                                                iconColor="#5c6bc0"
                                            >
                                                <div className={cx('suggestions-container')}>
                                                    {analyticsData.improvement_suggestions.map((suggestion, index) => (
                                                        <div className={cx('suggestion-card')} key={index}>
                                                            <div className={cx('suggestion-header')}>
                                                                <Lightbulb className={cx('suggestion-icon')} />
                                                                <h5>{suggestion.focus_area}</h5>
                                                            </div>
                                                            <p className={cx('suggestion-action')}>
                                                                {suggestion.specific_action}
                                                            </p>
                                                            <div className={cx('suggestion-outcome')}>
                                                                <strong>Kết quả mong đợi:</strong>{' '}
                                                                {suggestion.expected_outcome}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CollapsibleSection>

                                            <CollapsibleSection
                                                title="Chiến lược điều chỉnh"
                                                id="adjustments"
                                                iconColor="#5c6bc0"
                                            >
                                                <ul className={cx('adjustment-list')}>
                                                    {analyticsData.progress_tracking.adjustment_strategies.map(
                                                        (strategy, index) => (
                                                            <li key={index}>
                                                                <Check className={cx('check-icon')} />
                                                                <span>{strategy}</span>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </CollapsibleSection>
                                        </>
                                    )}

                                    <div className={cx('tips-card')}>
                                        <h5>Mẹo học tập hiệu quả:</h5>
                                        <ul className={cx('tips-list')}>
                                            <li>
                                                <Check className={cx('check-icon')} />
                                                <span>Lập kế hoạch học tập cụ thể với thời gian biểu chi tiết</span>
                                            </li>
                                            <li>
                                                <Check className={cx('check-icon')} />
                                                <span>Sử dụng phương pháp Pomodoro (25 phút học, 5 phút nghỉ)</span>
                                            </li>
                                            <li>
                                                <Check className={cx('check-icon')} />
                                                <span>Luyện tập giải bài tập thường xuyên để củng cố kiến thức</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {activeTab === 2 && (
                                <div className={cx('tab-panel')}>
                                    <h5>Tài liệu tham khảo được đề xuất dựa trên quá trình học tập của bạn:</h5>
                                    <div className={cx('resources-grid')}>
                                        {!isAnalyticsEnabled || !analyticsData ? (
                                            <>
                                                <div className={cx('resource-card')}>
                                                    <div className={cx('resource-icon')}>
                                                        <Book className={cx('book-icon')} />
                                                    </div>
                                                    <h6>Calculus Made Easy</h6>
                                                    <button className={cx('outline-button')}>Xem Tài Liệu</button>
                                                </div>
                                                <div className={cx('resource-card')}>
                                                    <div className={cx('resource-icon')}>
                                                        <Book className={cx('book-icon')} />
                                                    </div>
                                                    <h6>3D Geometry Guide</h6>
                                                    <button className={cx('outline-button')}>Xem Tài Liệu</button>
                                                </div>
                                            </>
                                        ) : (
                                            analyticsData.document_recommend.map((doc, index) => (
                                                <div className={cx('resource-card')} key={index}>
                                                    <div className={cx('resource-icon')}>
                                                        <Book className={cx('book-icon')} />
                                                    </div>
                                                    <h6>{doc.description}</h6>
                                                    <p className={cx('resource-subject')}>{doc.subjectName}</p>
                                                    <a
                                                        href={doc.filePath}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={cx('outline-button')}
                                                    >
                                                        Xem Tài Liệu
                                                    </a>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 3 && (
                                <div className={cx('tab-panel')}>
                                    {!isAnalyticsEnabled || !analyticsData ? (
                                        <div className={cx('info-alert')}>
                                            <h5>Kế hoạch học tập</h5>
                                            <p>
                                                Để xem kế hoạch học tập chi tiết, vui lòng hoàn thành các bài tập và bật
                                                tính năng phân tích học tập.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className={cx('goals-section')}>
                                                <div className={cx('goals-column')}>
                                                    <h5>Mục tiêu ngắn hạn</h5>
                                                    <ul>
                                                        {analyticsData.weekly_study_plan.short_term_goals.map(
                                                            (goal, index) => (
                                                                <li key={index}>{goal}</li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                                <div className={cx('goals-column')}>
                                                    <h5>Mục tiêu dài hạn</h5>
                                                    <ul>
                                                        {analyticsData.weekly_study_plan.long_term_goals.map(
                                                            (goal, index) => (
                                                                <li key={index}>{goal}</li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>

                                            <h5>Lịch học hàng tuần</h5>
                                            <div className={cx('schedule-grid')}>
                                                {Object.entries(analyticsData.weekly_study_plan.daily_schedule).map(
                                                    ([day, schedule]) => (
                                                        <div className={cx('schedule-card')} key={day}>
                                                            <div className={cx('schedule-day')}>
                                                                <School />
                                                                <h6>{day.charAt(0).toUpperCase() + day.slice(1)}</h6>
                                                            </div>
                                                            <div className={cx('schedule-time')}>
                                                                {schedule.study_hours}
                                                            </div>
                                                            <div className={cx('schedule-subjects')}>
                                                                <strong>Môn học:</strong>{' '}
                                                                {schedule.focus_subjects.join(', ')}
                                                            </div>
                                                            <div className={cx('schedule-activities')}>
                                                                <strong>Hoạt động:</strong>
                                                                <ul>
                                                                    {schedule.recommended_activities.map(
                                                                        (activity, index) => (
                                                                            <li key={index}>{activity}</li>
                                                                        ),
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={cx('warning-section')}>
                        <div className={cx('warning-content')}>
                            <Warning className={cx('warning-icon')} />
                            <div>
                                <h5>CHÚ Ý</h5>
                                <p>
                                    Phân tích AI dưới đây chỉ mang tính tương đối thông qua quá trình học tập, điểm số
                                    và thời gian học tập của bạn ở trên web. AI của chúng tôi không đánh giá hoàn toàn
                                    trình độ và khả năng của bạn, mọi thông tin được đưa ra chỉ mang tính chất tham
                                    khảo!
                                </p>
                                <p>
                                    Mỗi tuần AI chúng tôi sẽ lấy dữ liệu điểm số và số bài đã làm của bạn để phân tích
                                    quá trình học tập và đưa ra giải pháp học tập phù hợp dành cho bạn. Vui lòng làm bài
                                    và học bài đầy đủ, ít nhất làm 3 bài thi 1 tuần để AI có thể phân tích được chi tiết
                                    và cụ thể hơn.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Subject Selection Modal */}
            <SubjectSelectionModal
                isOpen={showSubjectModal}
                onClose={handleModalClose}
                onConfirm={handleSubjectSelection}
            />
        </motion.div>
    );
};

export default LearningAnalyticsDashboard;
