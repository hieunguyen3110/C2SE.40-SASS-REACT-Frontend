import classNames from 'classnames/bind';
import styles from './KnowledgeTest.module.scss';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { debounce } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';
import { searchSubjectsAction } from '../../../../redux/GroupStudySlice/GroupStudySlice';
import { startQuizAction } from '../../../../redux/AIQuizSlice/aiQuizSlice';
import CreateTestLoading from '../components/CreateTestLoading/CreateTestLoading';
import { useAlert } from '../../../../contexts/AlertContext';
import Cookies from 'js-cookie';

const cx = classNames.bind(styles);

// Available categories
const categories = [
    { id: 'programming', label: 'Lập trình' },
    { id: 'language', label: 'Ngôn ngữ' },
    { id: 'economics', label: 'Kinh tế' },
    { id: 'law', label: 'Luật' },
    { id: 'tourism', label: 'Du lịch' },
    { id: 'design', label: 'Thiết kế đồ họa' },
    { id: 'management', label: 'QTKD' },
    { id: 'medicine', label: 'Y khoa' },
];

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
            when: 'beforeChildren',
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.3 },
    },
};

const chipVariants = {
    hover: {
        scale: 1.1,
        transition: { duration: 0.2 },
    },
    tap: { scale: 0.9 },
};

export default function KnowledgeTest() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const { alert } = useAlert();

    const { loading } = useAppSelector((state) => state.aiQuiz);
    const { accountId } = useAppSelector((state) => state.authentication);

    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [numberOfQuestions, setNumberOfQuestions] = useState<string>('5');
    const [testDuration, setTestDuration] = useState<string>('30');
    const [subjectInput, setSubjectInput] = useState<string>('');
    const [subjectId, setSubjectId] = useState<string>('');

    // Get search results from Redux store
    const searchResults = useAppSelector((state) => state.groupStudy.subjects) || [];

    // Debounced search function
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceSearchSubject = useCallback(
        debounce((value: string) => dispatch(searchSubjectsAction(value)).unwrap(), 1000),
        [dispatch],
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const clearSubjects = useCallback(() => {
        dispatch({ type: 'groupStudy/searchSubjects/fulfilled', payload: [] });
    }, [dispatch]);

    // Search subject handler
    const handleSearchSubject = async (value: string) => {
        setSubjectInput(value);

        if (!value.trim()) {
            clearSubjects();
            return;
        }

        try {
            debounceSearchSubject(value);
        } catch (error) {
            console.log(error);
        }
    };

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/[^0-9]/g, ''); // Only allow digits
        const numValue = parseInt(value);

        if (value === '') {
            setNumberOfQuestions('');
        } else if (!isNaN(numValue)) {
            if (numValue > 30) {
                setNumberOfQuestions('30');
            } else if (numValue < 1) {
                setNumberOfQuestions('1');
            } else {
                setNumberOfQuestions(value);
            }
        }
    };

    const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/[^0-9]/g, ''); // Only allow digits
        const numValue = parseInt(value);

        if (value === '') {
            setTestDuration('');
        } else if (!isNaN(numValue)) {
            if (numValue > 60) {
                setTestDuration('60');
            } else if (numValue < 1) {
                setTestDuration('1');
            } else {
                setTestDuration(value);
            }
        }
    };

    const preventMinusSign = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === '.') {
            e.preventDefault();
        }
    };

    const handleSelectCategory = (category: { id: string; label: string }) => {
        setSelectedCategory(category.id);
        setSubjectInput(category.label);
        debounceSearchSubject(category.label);

        // Focus the input after setting the selection
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    const handleSelectSearchResult = (result: any) => {
        setSubjectId(String(result.subjectId));
        setSubjectInput(result.subjectName);
        clearSubjects();
    };

    // Check for existing quiz in cookies
    useEffect(() => {
        const existingQuizCookie = Cookies.get('quiz_session');
        if (existingQuizCookie) {
            try {
                const quizData = JSON.parse(existingQuizCookie);
                const endTime = new Date(quizData.endTime).getTime();
                const now = new Date().getTime();

                // If the quiz hasn't expired yet
                if (endTime > now) {
                    // Navigate to the test process page with the existing sessionId
                    navigate(`/document/ai-quiz/test-process`);
                } else {
                    // If quiz has expired, remove the cookie
                    Cookies.remove('quiz_session');
                }
            } catch (error) {
                // If there's an error parsing the cookie, remove it
                Cookies.remove('quiz_session');
                console.error('Error parsing quiz cookie:', error);
            }
        }
    }, [navigate]);

    const handleStartTest = () => {
        // Check if there's an existing quiz in cookies
        const existingQuizCookie = Cookies.get('quiz_session');
        if (existingQuizCookie) {
            try {
                const quizData = JSON.parse(existingQuizCookie);
                const endTime = new Date(quizData.endTime).getTime();
                const now = new Date().getTime();

                // If the quiz hasn't expired yet
                if (endTime > now) {
                    alert({
                        title: 'Bài kiểm tra đang diễn ra',
                        content:
                            'Bạn đang có một bài kiểm tra chưa hoàn thành. Vui lòng hoàn thành bài kiểm tra đó trước khi tạo bài mới.',
                        confirmText: 'Tiếp tục làm bài',
                        onConfirm: () => navigate(`/document/ai-quiz/test-process`),
                    });
                    return;
                } else {
                    // If quiz has expired, remove the cookie
                    Cookies.remove('quiz_session');
                }
            } catch (error) {
                // If there's an error parsing the cookie, remove it
                Cookies.remove('quiz_session');
            }
        } else {
            if (!subjectId) {
                alert({
                    title: 'Thông báo',
                    content: 'Vui lòng chọn môn học',
                    confirmText: 'OK',
                });
                return;
            }

            const questionsNum = parseInt(numberOfQuestions);
            if (questionsNum < 1 || questionsNum > 30) {
                alert({
                    title: 'Thông báo',
                    content: 'Số câu hỏi phải từ 1 đến 30 câu',
                    confirmText: 'OK',
                });
                return;
            }

            const durationNum = parseInt(testDuration);
            if (durationNum < 1 || durationNum > 60) {
                alert({
                    title: 'Thông báo',
                    content: 'Thời gian làm bài phải từ 1 đến 60 phút',
                    confirmText: 'OK',
                });
                return;
            }

            // Generate session ID locally using userId and timestamp
            const currentTime = new Date().getTime();
            const localSessionId = `${accountId || 'guest'}_${currentTime}`;
            const startTimeStr = new Date(currentTime).toISOString();
            const endTimeStr = new Date(currentTime + durationNum * 60 * 1000).toISOString();

            dispatch(
                startQuizAction({
                    subjectId: parseInt(subjectId),
                    numberOfQuestions: parseInt(numberOfQuestions),
                    duration: durationNum,
                    sessionId: localSessionId,
                    startTime: startTimeStr,
                    endTime: endTimeStr,
                    isCompleted: false,
                }),
            );

            // Create quiz data object
            const quizData = {
                sessionId: localSessionId,
                startTime: currentTime,
                endTime: endTimeStr,
                duration: durationNum * 60 * 1000, // Chuyển từ phút sang milliseconds
                subjectId: parseInt(subjectId),
                numberOfQuestions: questionsNum,
                subjectName: subjectInput,
            };

            // Set cookie with expiration time based on quiz duration
            Cookies.set('quiz_session', JSON.stringify(quizData), {
                expires: new Date(currentTime + durationNum * 60 * 1000),
                sameSite: 'strict',
            });

            // Chuyển hướng đến trang làm bài không cần sessionId
            navigate(`/document/ai-quiz/test-process`);
        }
    };

    // Handle clicks outside of search dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target as Node) &&
                searchResults.length > 0
            ) {
                clearSubjects();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [clearSubjects, searchResults.length]);

    return (
        <div className={cx('knowledge-test')}>
            {loading ? (
                <div className={cx('knowledge-test-container')}>
                    <CreateTestLoading />
                </div>
            ) : (
                <motion.div
                    className={cx('knowledge-test-container')}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1 className={cx('title')} variants={itemVariants}>
                        Bài kiểm tra trực tuyến
                    </motion.h1>

                    <motion.div className={cx('form-group')} variants={itemVariants}>
                        <label className={cx('label')}>Chọn môn học</label>
                        <div className={cx('search-container')} ref={searchContainerRef}>
                            <span className={cx('search-icon')}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24">
                                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                                </svg>
                            </span>
                            <input
                                ref={searchInputRef}
                                type="text"
                                className={cx('search-input')}
                                placeholder="Tìm kiếm môn học..."
                                value={subjectInput}
                                onChange={(e) => handleSearchSubject(e.target.value)}
                            />

                            {/* Subject search results dropdown */}
                            {subjectInput.trim() && searchResults?.length > 0 && (
                                <motion.div
                                    className={cx('search-results')}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ul>
                                        {searchResults.map((result, index) => (
                                            <motion.li
                                                key={index}
                                                whileHover={{ backgroundColor: 'rgba(255, 60, 60, 0.1)' }}
                                                onClick={() => handleSelectSearchResult(result)}
                                            >
                                                {result.subjectName}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </div>

                        <div className={cx('category-chips')}>
                            {categories.map((category) => (
                                <motion.button
                                    key={category.id}
                                    type="button"
                                    onClick={() => handleSelectCategory(category)}
                                    className={cx('category-chip', {
                                        selected: selectedCategory === category.id,
                                    })}
                                    whileHover="hover"
                                    whileTap="tap"
                                    variants={chipVariants}
                                >
                                    {category.label}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div className={cx('form-group')} variants={itemVariants}>
                        <label className={cx('label')}>Số câu hỏi</label>
                        <input
                            type="number"
                            className={cx('number-input')}
                            value={numberOfQuestions}
                            onChange={handleNumberChange}
                            onKeyDown={preventMinusSign}
                            min="1"
                            max="30"
                        />
                    </motion.div>

                    <motion.div className={cx('form-group')} variants={itemVariants}>
                        <label className={cx('label')}>Thời gian làm bài (phút)</label>
                        <input
                            type="number"
                            className={cx('number-input')}
                            value={testDuration}
                            onChange={handleDurationChange}
                            onKeyDown={preventMinusSign}
                            min="1"
                            max="60"
                        />
                    </motion.div>

                    <motion.button
                        className={cx('start-button')}
                        onClick={handleStartTest}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        variants={itemVariants}
                    >
                        Bắt đầu
                    </motion.button>
                </motion.div>
            )}
        </div>
    );
}
