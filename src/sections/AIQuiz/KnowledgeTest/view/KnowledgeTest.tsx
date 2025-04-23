import classNames from 'classnames/bind';
import styles from './KnowledgeTest.module.scss';
import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { debounce } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';
import { searchSubjectsAction } from '../../../../redux/GroupStudySlice/GroupStudySlice';
import CreateTestLoading from '../components/CreateTestLoading/CreateTestLoading';
import { useAlert } from '../../../../contexts/AlertContext';

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
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
        y: 0, 
        opacity: 1,
        transition: { duration: 0.3 }
    }
};

const chipVariants = {
    hover: {
        scale: 1.1,
        transition: { duration: 0.2 }
    },
    tap: { scale: 0.9 }
};

export default function KnowledgeTest() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const { alert } = useAlert();
    
    const [selectedSubject, setSelectedSubject] = useState<{ id: number; name: string } | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [numberOfQuestions, setNumberOfQuestions] = useState<string>('5');
    const [testDuration, setTestDuration] = useState<string>('30');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [subjectInput, setSubjectInput] = useState<string>('');
    const [subjectId, setSubjectId] = useState<string>('');
    
    // Get search results from Redux store
    const searchResults = useAppSelector((state) => state.groupStudy.subjects) || [];
    
    // Debounced search function
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceSearchSubject = useCallback(
        debounce((value: string) => dispatch(searchSubjectsAction(value)).unwrap(), 1000),
        [dispatch]
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
        setNumberOfQuestions(event.target.value);
    };
    
    const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTestDuration(event.target.value);
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
        setSelectedSubject({
            id: result.subjectId,
            name: result.subjectName
        });
        clearSubjects();
    };

    const handleStartTest = () => {
        // Validate inputs
        if (!subjectInput) {
            alert({
                title: 'Thông báo',
                content: 'Vui lòng chọn môn học',
                confirmText: 'OK'
            });
            return;
        }

        if (parseInt(numberOfQuestions) < 1) {
            alert({
                title: 'Thông báo',
                content: 'Vui lòng nhập số câu hỏi hợp lệ',
                confirmText: 'OK'
            });
            return;
        }

        if (parseInt(testDuration) < 1) {
            alert({
                title: 'Thông báo',
                content: 'Vui lòng nhập thời gian làm bài hợp lệ',
                confirmText: 'OK'
            });
            return;
        }
        
        // Generate a test ID (in a real app, this would come from the backend)
        const testId = `${subjectId || selectedCategory || 'general'}-${Date.now()}`;
        
        // Store test configuration in localStorage (in a real app, this would be stored in the backend)
        localStorage.setItem('testConfig', JSON.stringify({
            subject: subjectInput,
            numberOfQuestions: parseInt(numberOfQuestions),
            duration: parseInt(testDuration),
            testId
        }));

        // Show loading for 5 seconds
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            // Navigate to the test page
            navigate(`/document/ai-quiz/test-process/${testId}`);
        }, 3000);
    };

    return (
        <div className={cx('knowledge-test')}>
            {isLoading ? (
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
                    <motion.h1 
                        className={cx('title')}
                        variants={itemVariants}
                    >
                        Online Knowledge Test
                    </motion.h1>

                    <motion.div 
                        className={cx('form-group')}
                        variants={itemVariants}
                    >
                        <label className={cx('label')}>Chọn môn học</label>
                        <div className={cx('search-container')}>
                            <span className={cx('search-icon')}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24">
                                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
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
                        </div>
                        
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
                        
                        <div className={cx('category-chips')}>
                            {categories.map((category) => (
                                <motion.button
                                    key={category.id}
                                    type="button"
                                    onClick={() => handleSelectCategory(category)}
                                    className={cx('category-chip', { 
                                        selected: selectedCategory === category.id 
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

                    <motion.div 
                        className={cx('form-group')}
                        variants={itemVariants}
                    >
                        <label className={cx('label')}>Số câu hỏi</label>
                        <input
                            type="number"
                            className={cx('number-input')}
                            value={numberOfQuestions}
                            onChange={handleNumberChange}
                            min="1"
                            max="50"
                        />
                    </motion.div>

                    <motion.div 
                        className={cx('form-group')}
                        variants={itemVariants}
                    >
                        <label className={cx('label')}>Thời gian làm bài (phút)</label>
                        <input
                            type="number"
                            className={cx('number-input')}
                            value={testDuration}
                            onChange={handleDurationChange}
                            min="1"
                            max="180"
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
